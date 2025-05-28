const net = require('net');

const server = net.createServer();
const clients = [];

server.on('connection', (socket) => {
  console.log('New connection:', socket.remoteAddress, socket.remotePort);
  clients.push(socket); // Add new client to the list

  socket.on('data', (data) => {
    for (const client of clients) {
      client.write(`User: ${data}`);
    }
  });

  socket.on('end', () => {
    console.log('Connection closed:', socket.remoteAddress, socket.remotePort);
    clients.splice(clients.indexOf(socket), 1); // Remove the client
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(3000, '127.0.0.1', () => {
  console.log('TCP server is running on port 3000', server.address());
});
