const io = require('../server').io

//classes
const Player = require('./classes/Player')
const PlayerConfig = require('./classes/PlayerConfig')
const PlayerData = require('./classes/PlayerData')
const Bullet = require('./classes/Bullet')
const Pillar = require('./classes/Pillar')

//collision functions
const bulletCollidingWithPlayer = require('./colllision').bulletCollidingWithPlayer
const rectCollision = require('./colllision').rectCollideswithOtherRect


let tankSize = undefined
let pillarSize = 64

const fps = 30

let gameConfig = {
    pillarCount : 10
}

let gameSettings = {
    mapWidth : 1000,
    mapHeight : 1000,
    tickRate : 1000/fps
}

let players = []
let bullets = []
let pillars = []


//create pillars
for(var i = 0; i < gameConfig.pillarCount; i++) {
    let coordinateFound = false
    let newPillar = {}
    while(!coordinateFound) {
        coordinateFound = true;
        let x = Math.floor(Math.random() * gameSettings.mapWidth)
        let y =  Math.floor(Math.random() * gameSettings.mapHeight)

        newPillar = new Pillar(x,y)
        pillars.forEach((pillar) => {
            if(rectCollision(newPillar,pillarSize,pillar,pillarSize)) {
                coordinateFound = false;
            }
        })
    }

  
    pillars.push(newPillar)
}

setInterval(() => {
    //update bullet locations
    bullets.forEach((bullet) => {
       
        bullet.x += bullet.xVec
        bullet.y -= bullet.yVec
        bulletCollidingWithPlayer(bullet,players,tankSize).then((player) => {
         
            console.log('collision with ' + player.id)
            player.playerData.health -= 10
            console.log(player.playerData.health)

            if(player.playerData.health <= 0) player.playerData.death = true

            bullets.splice(bullets.indexOf(bullet),1)
        }).catch(() => {})
        if(bullet.x > gameSettings.mapWidth + tankSize || bullet.x < 0 || bullet.y > gameSettings.mapHeight + tankSize || bullet.y < 0) {
            if(bullet.x < 0) {
                bullet.x = 1;
                bullet.xVec = -bullet.xVec
            }
            if(bullet.x > gameSettings.mapWidth + tankSize){
                bullet.x = (gameSettings.mapWidth + tankSize) - 1
                bullet.xVec = -bullet.xVec
            }

            if(bullet.y < 0){
                bullet.y = 1;
                bullet.yVec = -bullet.yVec
            }
            if(bullet.y > gameSettings.mapHeight + tankSize){
                bullet.y = (gameSettings.mapHeight + tankSize) - 1
                bullet.yVec = -bullet.yVec
            }

            
           
            //let dotproduct = xVec

        

           // bullet.shotAngle = Math.PI
            bullet.reflectCount++;
       

      
        }

        let oldBulletX = bullet.x - bullet.xVec
        let oldBulletY = bullet.y + bullet.yVec
        //check if bullet colliding with pillar
        pillars.forEach((pillar) => {
            if(rectCollision(bullet,1,pillar,pillarSize)) {
                //console.log('pillar collision')
                let offset = 10

            
                console.log(pillar.y, pillar.y + pillarSize)
                console.log(oldBulletY,bullet.y)
                console.log('--------------')
                if(oldBulletX < pillar.x || oldBulletX > pillar.x + pillarSize) {
                    bullet.xVec = -bullet.xVec
                }

                if(oldBulletY <= pillar.y || oldBulletY >= pillar.y + pillarSize) {
                    bullet.yVec = -bullet.yVec
                }

            
                bullet.reflectCount += .5
            }
        })

        if(bullet.reflectCount > 2) bullets.splice(bullets.indexOf(bullet),1)
       
    })
},gameSettings.tickRate)


io.on('connect', (socket) => {
    console.log('connection established with ' + socket.id)
    //socket variables
    let player = {}

    //socket listeners
    socket.on('init', (data) => {
        //init player config
        let playerConfig = new PlayerConfig()

        //init playerdata
        let playerData = new PlayerData(socket.id,data.username,10,10)

        if(tankSize === undefined) tankSize = data.tankSize

        player = new Player(data.username,socket.id,playerConfig,playerData)



        players.push(player)
        console.log(player)

        let playersData = Array.from(players, player => player.playerData)
        socket.emit('initialized', {
            bullets,
            players: playersData,
            playerX : playerData.x,
            playerY : playerData.y,
            playerAngle : playerData.angle,
            playerTurretAngle : playerData.turretAngle,
            gameSettings,
            pillars
        })

        Array.from(players, player => player.playerData)

        //initialize heartbeat pulse
        setInterval( () => {

            //grab players data
            let playersData = Array.from(players, player => player.playerData)

            //emit data
            socket.emit('tock',{
            bullets,
            players: playersData,
            playerX: player.playerData.x,
            playerY: player.playerData.y,
            death: player.playerData.death
        }) 
    }, gameSettings.tickRate)
        
    })  

    

    socket.on('disconnect', () => {
        
        console.log('disconnected' + socket.id)
        players = players.filter((p) => p.id != player.id)
    })

    socket.on('tick', (data) => {
        //handle movement

        let validMove = true
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

        pillars.forEach((pillar) => {
            if(rectCollision({x: newX, y: newY},tankSize,pillar,pillarSize)) validMove = false
        })

        
        //check if valid move
        if(validMove && newX != undefined && newY != undefined && newX >= 0 && newX <= gameSettings.mapWidth && newY >= 0 && newY <= gameSettings.mapHeight) {
            player.playerData.x = newX
            player.playerData.y = newY
        }

        if(data.left && !data.right) {
            player.playerData.angle -= player.playerConfig.angularSpeed
        }

        if(data.right && !data.left) {
            player.playerData.angle += player.playerConfig.angularSpeed
        }

        //check if clicked
        if(data.clicked) {
            let initialX = player.playerData.x
            let initialY = player.playerData.y
            initialX += tankSize /2
            initialY += tankSize /2

            initialX += (tankSize/1.5) * Math.sin(player.playerData.turretAngle)
            initialY -= (tankSize/1.5) * Math.cos(player.playerData.turretAngle)

            bullets.push(new Bullet(initialX,initialY,player.playerData.turretAngle,player.name,player.id))
        }

    })


  
})