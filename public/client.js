let socket = io.connect('http://localhost:9999')
console.log(socket)

function init() {
    draw()

    socket.emit('init', {
        username: prompt("username"),
        tankSize: tank.width
    })
}

init()


//socket listeners
socket.on('initialized', (data) => {
    console.log(data)
    player = {
        x: data.playerX,
        y: data.playerY,
        angle: data.playerAngle,
        turretAngle: data.playerTurretAngle
    }

    settings = data.gameSettings
    players = data.players
    pillars = data.pillars
    console.log(pillars)
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

    updateScore(data.score)
    updateScoreBoard()

    if(death) socket.close()

    socket.emit('tick', {
        left,
        right,
        forwards,
        backwards,
        turretAngle,
        clicked
    })



    
})

//tick


//update ui
function updateScore(score){
    document.querySelector(".player-score").innerHTML = score
}

function updateScoreBoard() {
    //console.log(players)
    let scores = players.map((p) => {
        return {name: p.name, score: p.score}
    })

   
    
    scores.sort((a,b) => {
        return (a.score > b.score) ? -1 : 1;
    })


    

    //console.log(scores)
    scores = scores.splice(0,5)
    document.querySelector(".leader-board").innerHTML = ""
    scores.forEach((p) => {
        document.querySelector(".leader-board").innerHTML += `<li class="leaderboard-player"> ${p.name} - ${p.score}</li>`
    })
    
}


//modal functioms