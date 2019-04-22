
const bulletVelocity = 15
class Bullet {
    constructor(initialX, initialY, shotAngle, owner,ownerID) {
        this.x = initialX
        this.y = initialY
        this.xVec =  Math.sin(shotAngle) * bulletVelocity
        this.yVec =  Math.cos(shotAngle) * bulletVelocity
        this.owner = owner
        this.ownerID = ownerID
        this.reflectCount= 0;
    }
}

module.exports = Bullet