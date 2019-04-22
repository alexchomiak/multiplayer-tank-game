function collision(player,players) {
    
}

function bulletCollidingWithPlayer(bullet, players, tankSize) {

    return new Promise((resolve,reject) => {
        players.forEach((player) => {
            //  console.log(bullet,player)
        

            if(bullet.x >= player.playerData.x && bullet.x <= (player.playerData.x + tankSize) && (bullet.y >= player.playerData.y && bullet.y <= player.playerData.y + tankSize)) {
                //collision


              

                console.log('yay')
                resolve(player)
            } 
        })
        

        reject()
    })
   
}

function bulletCollidingWithPillar() {

}

module.exports = {
    bulletCollidingWithPlayer
}