const http = require('node:http')

const agent = new http.Agent({ keepAlive: true, timeout: 5 })

const request = http.request({
  agent: agent,
  hostname: 'localhost',
  port: 3000,
  method: 'POST',
  path: '/create-post',
  headers: {
    'content-type': 'application/json'
  }
})

request.write(JSON.stringify({ message: 'Hi there!' }))