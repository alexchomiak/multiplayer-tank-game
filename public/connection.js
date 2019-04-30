class Connection {
    constructor(socket) {
        socket.emit('init', {
            username: name,
            tankSize: tank.width
        })


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

            if(death) {
                socket.close()
                //socket = io.connect('http://localhost:9999')

                document.querySelector('.end-message').innerHTML = "You died with a score of " + data.score + ". Play again?"

                $('#loginModal').modal('show')
                $('.hiddenOnStart').attr("hidden",true)
                return;
            }

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
            if(players.length < 4) {
                document.querySelector(".leader-board").innerHTML = ""
                document.querySelector(".leader-board").innerHTML += "<p> There must be 4 players</p>"
                document.querySelector(".leader-board").innerHTML += "<p> to play!</p>"
                return;
            }
            
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
                document.querySelector(".leader-board").innerHTML += `<li class="leaderboard-player"> ${p.name} has ${p.score} points.</li>`
            })
            
        }

    }
}
