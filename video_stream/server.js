/*require('dotenv').config({  
    path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
})*/
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid')

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
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })
    })
})

server.listen(3000)