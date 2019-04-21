const io = require('../server').io

//classes
const Player = require('./classes/Player')
const PlayerConfig = require('./classes/PlayerConfig')
const PlayerData = require('./classes/PlayerData')

let tankSize = undefined

const fps = 30

let gameSettings = {
    mapWidth : 1000,
    mapHeight : 1000,
    tickRate : 1000/fps
}

let players = []
let bullets = []


io.on('connect', (socket) => {
    console.log('connection established with ' + socket.id)
    //socket variables
    let player = {}

    //socket listeners
    socket.on('init', (data) => {
        //init player config
        let playerConfig = new PlayerConfig()

        //init playerdata
        let playerData = new PlayerData(socket.id,data.username,0,0)

        if(tankSize === undefined) tankSize = data.tankSize

        player = new Player(data.username,socket.id,playerConfig,playerData)



        players.push(player)
        console.log(player)

        let playersData = Array.from(players, player => player.playerData)
        socket.emit('initialized', {
            players: playersData,
            playerX : playerData.x,
            playerY : playerData.y,
            playerAngle : playerData.angle,
            playerTurretAngle : playerData.turretAngle,
            gameSettings
        })

        Array.from(players, player => player.playerData)

        //initialize heartbeat pulse
        setInterval( () => {
            //update movement


    

            //grab players data
            let playersData = Array.from(players, player => player.playerData)

            //emit data
            socket.emit('tock',{
            players: playersData,
            playerX: player.playerData.x,
            playerY: player.playerData.y,
            playerAngle: player.playerData.angle,
            playerTurretAngle: playerData.turretAngle,
            health: player.playerData.health
        }) 
    }, gameSettings.tickRate)
        
    })

    socket.on('disconnect', () => {
        
        players.splice(players.indexOf(player),1)
    })

    socket.on('tick', (data) => {
        //handle movement

        let newX = undefined, newY = undefined
     
        player.playerData.turretAngle = data.turretAngle

        
        if(data.forwards && !data.backwards) {
            newX =  player.playerData.x +  Math.sin(player.playerData.angle) * player.playerConfig.speed
            newY = player.playerData.y -  Math.cos(player.playerData.angle) * player.playerConfig.speed
        }
        else if(data.backwards && !data.forwards) {
            newX = player.playerData.x -  Math.sin(player.playerData.angle) * player.playerConfig.speed
            newY = player.playerData.y +  Math.cos(player.playerData.angle) * player.playerConfig.speed
        }

        
        //check if valid move
        if(newX != undefined && newY != undefined && newX >= 0 && newX <= gameSettings.mapWidth && newY >= 0 && newY <= gameSettings.mapHeight) {
            player.playerData.x = newX
            player.playerData.y = newY
        }

        if(data.left && !data.right) {
            player.playerData.angle -= player.playerConfig.angularSpeed
        }

        if(data.right && !data.left) {
            player.playerData.angle += player.playerConfig.angularSpeed
        }

    })
})