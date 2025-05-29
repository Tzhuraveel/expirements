const net = require('node:net')
const fs = require('node:fs/promises')

const server = net.createServer()

server.on('connection', async (socket) => {
  console.log('Someone connected to your server.')

  let fileHandle = await fs.open('storage/output.txt', 'w');
  let fileWriteStream = fileHandle.createWriteStream();

  socket.on('data', async (data) => {
    console.log('READING SOCKET')

    if(!fileWriteStream.write(data)) {
      console.log('STOP WRITING')
      socket.pause()
    }
  });

  fileWriteStream.on('drain', () => {
    console.log('DRAIN AND RESUME READING')
    socket.resume()
  })

  socket.on('end', async () => {
    console.log('END')
    fileHandle.close()
  })
});

server.listen(3000, () => {
  console.log('Server is started.')
})