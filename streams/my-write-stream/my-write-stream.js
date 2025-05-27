const { Writable } = require('node:stream');
const fs = require('node:fs')

class MyWritable extends Writable {

  constructor({ highWaterMark, filename }) {
    super({ highWaterMark, filename });

    this.filename = filename;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.writesCount = 0;
  }

  _construct(callback) {
    setTimeout(() => {
      fs.open(this.filename, 'w', (err, fd) => {
        if (err) {
          return callback(err);
        }
        this.fd = fd;
        callback();
      });
    }
    , 5000);
  }
  
  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    console.log(chunk.length);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      const data = Buffer.concat(this.chunks);
      fs.write(this.fd, data, (err) => {
        if (err) {
          return callback(err);
        }
        this.chunks = [];
        this.chunksSize = 0;
        ++this.writesCount;
        callback();
      })
    } else {
      callback()
    }
  }

  _final(callback) {
    const data = Buffer.concat(this.chunks, this.chunksSize);
    fs.write(this.fd, data, (err) => {
      if (err) {
        return callback(err);
      }  
      callback()
    });
  }

  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (closeErr) => {
        callback(closeErr || err);
      });
    } else {
      callback(err);
    }

  }
}

const stream = new MyWritable({ filename: 'output.txt', highWaterMark: 16 * 1024 });

stream.write(Buffer.from('Hello, World!'))

stream.end()

stream.on('finish', () => {
  console.log('Stream finished');
});

