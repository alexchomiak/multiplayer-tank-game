class PlayerData {
    constructor(id, name, initialX, initialY) {
        this.id = id;
        this.name = name;
        this.x = initialX
        this.y = initialY
        this.angle = 0;
        this.turretAngle = 0;
        this.health = 100;
    }
}

module.exports = PlayerData