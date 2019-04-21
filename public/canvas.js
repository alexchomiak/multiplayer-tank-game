//setup game canvas
let wHeight = $(window).height();
let wWidth = $(window).width();
let canvas = document.querySelector("#game")
let context = canvas.getContext('2d')
canvas.width = wWidth
canvas.height = wHeight






function draw() {
     //set transform
     context.setTransform(1,0,0,1,0,0)


    //clear canvas map width and height 110%
    context.clearRect(0,0,settings.mapWidth + canvas.width, settings.mapHeight + canvas.height)


     //camera code !TODO
    //clamp cam to player
    const camX = -player.x + canvas.width/2 - tank.width
    const camY = -player.y + canvas.height/2 - tank.height
    //translate awllows us to move canvas around
    



    context.translate(camX,camY)

        //draw map border
        context.strokeRect(0,0, settings.mapWidth + tank.width, settings.mapHeight + tank.height)

    context.lineWidth = 5;
    context.strokeStyle= 'rgb(0,255,0)'



 

   

   

    console.log('---------')
    players.forEach((p) => {
        console.log(p.x,p.y)
      
        context.save()
        context.scale(1,1)
   
        context.translate(p.x + (tank.width/2),p.y + (tank.height/2))
        context.rotate(p.angle)
    
        context.drawImage(tank,-tank.width/2,-tank.height/2)

        context.rotate(-p.angle)
        context.rotate(p.turretAngle)
        context.drawImage(turret,-tank.width/2,-tank.height/2)
        
        context.restore()
    })

    console.log('----------')
    bullets.forEach((bullet) => {
        context.beginPath()
        context.fillStyle = "rgb(255, 255, 0)"
        context.arc(bullet.x,bullet.y,5,0,Math.PI *2)
        context.fill()
    })


    context.beginPath()
    context.fillStyle = 'rgb(0,255,0)'
     context.fill()
     //x += .1
     
    requestAnimationFrame(draw)
}

document.onkeydown = checkKeyDown;
document.onkeyup = checkKeyUp


document.onclick = handleClick;

canvas.addEventListener('mousemove',(event) => {
    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };
    turretAngle = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) + (Math.PI / 2);
    
})

function handleClick() {
    clicked = true
}

function checkKeyDown(e) {
	if (e.keyCode == '38' || e.keyCode == '87') {
        // up arrow
		forwards = true
    }
    else if (e.keyCode == '40' || e.keyCode == '83') {
        // down arrow
		backwards = true
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
       // left arrow
	   left = true
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
       // right arrow
	   right = true
    }


}
function checkKeyUp(e) {
    // console.log(e);
    if (e.keyCode == '38' || e.keyCode == '87') {
        // up arrow
		forwards = false
    }
    else if (e.keyCode == '40' || e.keyCode == '83') {
        // down arrow
		backwards = false
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
       // left arrow
	   left = false
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
       // right arrow
	   right = false
    }
}


