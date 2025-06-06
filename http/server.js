const TZ = require('./framework/tz')

const server = new TZ()

server.route('get', '/login', (req, res) => {
  res.status(200).send({ message: 'Test' })
})

server.listen(9000, () => {
  console.log('Server has started on port 9000')
})