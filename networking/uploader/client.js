const net = require('net');
const fs = require('node:fs/promises')

const socket = net.createConnection(({ port: 3000 }), async () => {
  const filePath = 'input.tsv'

  const fileHandle = await fs.open(filePath, 'r')
  const fileReadStream = fileHandle.createReadStream()

  fileReadStream.on('data', (chunk) => {
    console.log('READING FILE')
    if (!socket.write(chunk)) {
      console.log('STOP WRITING')
      fileReadStream.pause();
    }
  })

  socket.on('drain', () => {
    console.log('DRAIN AND RESUME READING')
    fileReadStream.resume();
  });


  fileReadStream.on('end', () => {
    console.log('The file ended')
    socket.end()
    fileHandle.close()
  })
});