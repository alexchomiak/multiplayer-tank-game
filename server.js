const express = require('express')
const app = express()
const socketio = require('socket.io')
const port = 9999
//serve from public folder
app.use(express.static(__dirname + '/public'))

//serve basic index file
app.get('/',(req,res) => {
    res.sendFile(path.join('/index.html'))
})

const expressServer = app.listen(port)
const io = socketio(expressServer)
module.exports = {
    app,io
}

console.log('server running on port ' + port)