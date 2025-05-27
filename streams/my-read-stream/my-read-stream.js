const { Readable } = require('node:stream');
const fs = require('node:fs')

class MyReadable extends Readable {

  constructor({ highWaterMark, filename }) {
    super({ highWaterMark, filename });

    this.filename = filename;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.filename, 'r', (err, fd) => {
      if (err) return callback(err);
      this.fd = fd;
      callback();
    });
  }
  
  _read(size) {
    const buf = Buffer.alloc(size);
    fs.read(this.fd, buf, 0, size, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.subarray(0, bytesRead) : null);
      }
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

const stream = new MyReadable({ filename: 'src.txt', highWaterMark: 16 * 1024 });

stream.on('data', (chunk) => {
  console.log('DATA', chunk)
});

stream.on('end', () => {
  console.log('Stream ended');
});

