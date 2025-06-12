const http = require('http');
const cluster = require('cluster');
const os = require('os');

const WORKERS = 1; 

if (cluster.isPrimary) {
  console.log(`🧠 Master ${process.pid} running`);
  console.log(`🔧 Starting ${WORKERS} worker(s)`);

  for (let i = 0; i < WORKERS; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`💥 Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  const server = http.createServer((req, res) => {
    if (req.url === '/test') {
      
      const sum = Array(5e6).fill(0).map((_, i) => i).reduce((a, b) => a + b, 0);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ pid: process.pid, sum }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(3000, () => {
    console.log(`🚀 Worker ${process.pid} started`);
  });
}
