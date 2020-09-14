const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid')
const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: 9000, path: '/peerjs' });

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
})

app.get('/:roomId', (req, res) => {
    res.render('room', {roomId: req.params.roomId})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log('joinned room ' + roomId + ' ' + userId)
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
    })
})

server.listen(3030)