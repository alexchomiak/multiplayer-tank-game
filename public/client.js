let socket = io.connect('http://localhost:9999')
console.log(socket)

function init() {
    draw()

    socket.emit('init', {
        username: "test",
        tankSize: tank.width
    })
}

init()


//socket listeners
socket.on('initialized', (data) => {
    player = {
        x: data.playerX,
        y: data.playerY,
        angle: data.playerAngle,
        turretAngle: data.playerTurretAngle
    }

    settings = data.gameSettings
    players = data.players
})


//tock
socket.on('tock', (data) => {
    player = {
        x: data.playerX,
        y: data.playerY,
        angle: data.playerAngle,
        turretAngle: data.playerTurretAngle
    }
    players = data.players
    bullets = data.bullets

    death = data.death

    if(death) socket.close()

    socket.emit('tick', {
        left,
        right,
        forwards,
        backwards,
        turretAngle,
        clicked
    })



    if(clicked === true) clicked = false
})

//tick

