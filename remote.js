/**
 * smart-mirror remote by Evan Cohen
 */
const stream = require('stream')
let remote = new stream.Writable()

remote.start = function () {
  const express = require('express')
  const app = express()
  const config = require(__dirname + "/config.js")
  const server = require('http').createServer(app)

  // Start the server
  server.listen(config.remote.port)
  // Use the remote directory and initilize socket connection
  app.use(express.static(__dirname + '/remote'))
  remote.io = require('socket.io')(server)

  /**
   * When the connection begins
   */
  remote.io.on('connection', function (socket) {
    socket.emit('connected')

    // When the mirror recieves a remote command
    socket.on('command', function (command) {
      remote.emit('command', command)
    })

    socket.on('devtools', function (open) {
      remote.emit('devtools', open)
    })

    socket.on('kiosk', function () {
      remote.emit('kiosk')
    })

    socket.on('reload', function () {
      remote.emit('reload')
    })

  }) // end - connection

  /**
   * When a remote disconnects
   */
  remote.io.on('disconnect', function () {
    remote.emit('disconnected')
  })// end - disconnect
} // end - start

module.exports = remote