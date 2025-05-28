const net = require('net');
const readline = require('node:readline/promises');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const clearLine = (dir) => {
  return new Promise((resolve) => {
    process.stdout.clearLine(dir, resolve);
  });
};

const moveCursor = async (dx, dy) => {
  return new Promise((resolve) => {
    process.stdout.moveCursor(dx, dy, resolve);
  });
};

const ask = async (socket) => {
  const message = await rl.question('Enter a message > ');
  await moveCursor(0, -1);
  await clearLine(0);
  socket.write(message);
};

const socket = net.createConnection({ port: 3000 }, async () => {
  console.log('Connected to the server');
  await ask(socket);
});

socket.on('data', async (data) => {
  console.log();
  await moveCursor(0, -1);
  await clearLine(0);
  console.log(data.toString());
  await ask(socket);
});

socket.on('close', () => {
  console.log('Connection closed');
  rl.close();
  process.exit(0);
});
