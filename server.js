'use strict'

const http = require('http')
const app = require('./src/app')

const PORT = process.env.PORT || 8080
const HOST = `http://localhost:${PORT}/`

app.set('port', PORT)

const server = http.createServer(app)

server.listen(PORT, console.log(`Server is running on ${HOST}`))
server.on('error', onError)

function onError (error) {
  if(error.syscall !== 'listen') throw error

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`)
      process.exit(1)
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`)
      process.exit(1)
      break;
    default:
      throw error
  }
}
