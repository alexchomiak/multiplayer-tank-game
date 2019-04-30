const io = require('../server').io

//classes
const Player = require('./classes/Player')
const PlayerConfig = require('./classes/PlayerConfig')
const PlayerData = require('./classes/PlayerData')
const Bullet = require('./classes/Bullet')
const Pillar = require('./classes/Pillar')

let tankSize = 65
let pillarSize = 64

const fps = 30

let gameConfig = {
    pillarCount : 75
}

let gameSettings = {
    mapWidth : 2500,
    mapHeight : 2500,
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

        let player = bulletCollidingWithPlayer(bullet,players,tankSize)

        if( player !== null) {
            
            player.playerData.health -= 10


            if(player.playerData.health <= 0) {
                player.playerData.death = true

                if(player.id !== bullet.ownerID)  {
                    bullet.owner.score += 50
                }
            } else {
                if(player.id !== bullet.ownerID) {
                    player.playerData.score -= 10
                    bullet.owner.score += 10
                }
            
            }
            console.log(bullet.owner.score)




            bullets.splice(bullets.indexOf(bullet),1)
        }


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
    socket.on('init', async (data) => {
        //init player config
        let playerConfig = new PlayerConfig()


        let x = 0, y = 0
        //find random coordinate for player spawn
        let coordinateFound = false;
        while(!coordinateFound) {
            x = Math.random() * gameSettings.mapWidth;
            y = Math.random() * gameSettings.mapHeight

            if(x < 50 || x > gameSettings.mapWidth - 50) continue
            if(y < 50 || x > gameSettings.mapHeight - 50) continue


            if(playerCollision(socket.id,x,y,players,tankSize) !== null) continue
            if(playerCollidingWithPillar(x,y,pillars,tankSize) !== null) continue
            coordinateFound = true;
        }

        //init playerdata
        let playerData = new PlayerData(socket.id,data.username,x,y)

    

        player = new Player(socket.id,playerConfig,playerData)



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
            death: player.playerData.death,
            score: player.playerData.score
        }) 
    }, gameSettings.tickRate)
        
    })  

    

    socket.on('disconnect', () => {
        
        console.log('disconnected' + socket.id)
        players = players.filter((p) => p.id != player.id)
    })

    let tickCount = 0
    let secondCount = 0;
    let shotCoolOff = 0;
    socket.on('tick',   (data) => {
        //handle movement
        tickCount++;

        //decrement shotCoolOff
        if(shotCoolOff !== 0) shotCoolOff--;

        if(tickCount === fps) {
            tickCount = 0
            secondCount++;

            //player invincible for first 3 seconds of game
            if(secondCount === 3 && player.playerData.invincible) {
                secondCount = 0;
                player.playerData.invincible = false;
            }

            if(secondCount === 2 && !player.playerData.invincible) {
                //regenerate 10 health every 2 seconds
                if(player.playerData.health !== 100) {
                    player.playerData.health += 10;
                }

                if(player.playerData.health > 100) player.playerData.health = 100;
                secondCount = 0;
            }
        }

        if(players.length < 4) player.playerData.invincible = true

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

      
        if(playerCollision(player,newX,newY,players,tankSize) !== null) {
            validMove = false;
        }

        if(playerCollidingWithPillar(newX,newY,pillars,tankSize) !== null) validMove = false
        
        //await playerCollision(player.id,newX,newY,players,tankSize).then(() => validMove = false).catch(() => {})
    
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
         if(shotCoolOff === 0 &&  data.clicked && !player.playerData.invincible) {
             shotCoolOff = 10;
            let initialX = player.playerData.x
            let initialY = player.playerData.y
            initialX += tankSize /2
            initialY += tankSize /2

            initialX += (tankSize/1.5) * Math.sin(player.playerData.turretAngle)
            initialY -= (tankSize/1.5) * Math.cos(player.playerData.turretAngle)

            bullets.push(new Bullet(initialX,initialY,player.playerData.turretAngle,player.playerData,player.id))
        }

        

    })


  
})



//collision functions
function playerCollision(player,newX,newY,players,tankSize) {
    let ret = null
    players.forEach((p) => {
        if(ret !== null) return
        if(p.id === player.id) return
        if(rectCollision({x: newX, y: newY},tankSize,p.playerData,tankSize)) ret = p
    })
    if(ret !== null) return ret
    else return null
}


function rectCollision(rect1,rect1size,rect2,rect2size) {
    if(rect1.x <= rect2.x + rect2size && rect1.x + rect1size >= rect2.x && rect1.y <= rect2.y + rect2size && rect1.y + rect1size >= rect2.y) {
        //console.log('collision')
        
        return true
    }




    return false
}


function bulletCollidingWithPlayer(bullet, players, tankSize) {
        let ret = null
        players.forEach((player) => {
            //  console.log(bullet,player)
            if(!player.playerData.invincible && bullet.x >= player.playerData.x && bullet.x <= (player.playerData.x + tankSize) && (bullet.y >= player.playerData.y && bullet.y <= player.playerData.y + tankSize)) {
                ret = player
            } 
        })
        

        return ret
   
}


function playerCollidingWithPillar(newX,newY,pillars,tankSize) {
    let ret = null
    pillars.forEach((pillar) => {
        if(rectCollision({x: newX, y: newY},tankSize,pillar,pillarSize)) ret = pillar
    })
    return ret
}