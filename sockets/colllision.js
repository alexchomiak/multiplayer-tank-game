function playerCollision(playerID,newX,newY,players,tankSize) {
    return new Promise((resolve, reject) => {
        players.forEach((p) => {
            if(p.id === playerID) return;
            if(rectCollideswithOtherRect({x: newX, y: newY},tankSize,p.playerData,tankSize)) {
                resolve(p)
            }
        })
        reject()
    })
  

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

function rectCollideswithOtherRect(rect1,rect1size,rect2,rect2size) {
    if(rect1.x <= rect2.x + rect2size && rect1.x + rect1size >= rect2.x && rect1.y <= rect2.y + rect2size && rect1.y + rect1size >= rect2.y) {
        //console.log('collision')
        
        return true
    }




    return false
}

module.exports = {
    bulletCollidingWithPlayer,
    rectCollideswithOtherRect,
    playerCollision
}