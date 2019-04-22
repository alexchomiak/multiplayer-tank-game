//setup game canvas

let canvas = document.querySelector("#game")
let context = canvas.getContext('2d')


let wHeight = $(window).height();
let wWidth = $(window).width();
canvas.width = wWidth
canvas.height = wHeight

var fillTexture = new Image()
fillTexture.src ="texture.jpg"


//resize event listener for canvas
$(window).resize(() => {
    let windowHeight = $(window).height();
    let windowWidth = $(window).width();

    if(window.width != canvas.width) {
        canvas.width = windowWidth
    }

    if(window.height != canvas.height) {
        canvas.height = windowHeight
    }
})


function draw() {
    var fillPattern = context.createPattern(fillTexture, "repeat");

 

    //set transform
    context.setTransform(1,0,0,1,0,0)


    //clear canvas map width and height 110%
    context.clearRect(0,0,settings.mapWidth + canvas.width, settings.mapHeight + canvas.height)

   

     //camera code !TODO
    //clamp cam to player
    const camX = -player.x + canvas.width/2 - tank.width
    const camY = -player.y + canvas.height/2 - tank.height
    //translate awllows us to move canvas around
    


    if(death) return
    //translate to camera
    context.translate(camX,camY)
    
    //draw texture rectangle
    context.fillStyle = fillPattern
    context.fillRect(0,0, settings.mapWidth + tank.width, settings.mapHeight + tank.height)

        //draw map border
    context.lineWidth = 10;
    context.strokeStyle= 'rgb(114, 0, 0)'
    
    context.strokeRect(0,0, settings.mapWidth + tank.width, settings.mapHeight + tank.height)
    


 

   

   

    players.forEach((p) => {
        context.save()
      
        context.scale(1,1)
   
        
     
   


        //draw player
        context.translate(p.x + (tank.width/2),p.y + (tank.height/2))
        context.rotate(p.angle)
    
        context.drawImage(tank,-tank.width/2,-tank.height/2)

        context.rotate(-p.angle)
        context.rotate(p.turretAngle)
        context.drawImage(turret,-tank.width/2,-tank.height/2)

        context.restore()


        //draw each players health bar
        //draw players health bar base
        context.fillStyle = 'rgb(255,0,0)'
        context.fillRect(p.x - 15, p.y - 40, 100 ,10)
    
        //draw players health
        context.fillStyle = 'rgb(0,255,0)'
        context.fillRect(p.x - 15, p.y - 40, (p.health/100.0) * 100,10)


        //outline healthbar
        context.lineWidth = 3;
        context.strokeStyle= 'rgb(0, 0, 0)'
        context.strokeRect(p.x - 15, p.y - 40, 100,10)
        
    })




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

document.oncontextmenu = (e) => {
    e.preventDefault()
    console.log('right click')
}
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


