const http = require('node:http');

class TZ {
  routes = {};

  constructor() {
    this.server = http.createServer((req, res) => {
     
      res.status = function (code) {
        res.statusCode = code;
        return res;
      };

      res.send = function (body) {
        if (typeof body === 'object') {
          res.setHeader('Content-Type', 'application/json');
          body = JSON.stringify(body);
        } else if (typeof body === 'string') {
          res.setHeader('Content-Type', 'text/plain');
        }
        res.end(body);
      };

      const route = this.routes[req.url];
      if (!route) {
        return res.status(404).send('Not Found');
      }

      const method = route[req.method.toLowerCase()];
      if (!method) {
        return res.status(405).send('Method Not Allowed');
      }

      const cb = method.cb;
      cb(req, res);
    });
  }

  listen = (port, cb) => {
    this.server.listen(port, cb);
  };

  route = (method, path, cb) => {
    const m = method.toLowerCase();
    if (!this.routes[path]) {
      this.routes[path] = {};
    }

    this.routes[path][m] = { cb };
  };
}

module.exports = TZ;
