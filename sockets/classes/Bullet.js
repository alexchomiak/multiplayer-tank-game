class Bullet {
    constructor(initialX, initialY, shotAngle, ownerUserName, ownerID) {
        this.x = initialX
        this.y = initialY
        this.shotAngle = shotAngle
        this.ownerUserName = ownerUserName
        this.ownerID = ownerID
        this.reflectCount= 0;
    }
}

module.exports = Bullet