class Player {
    constructor(name,id,playerConfig,playerData) {
        this.name = name
        this.id = id;
        this.playerConfig = playerConfig
        this.playerData = playerData
        this.invincible = true
    }
}

module.exports = Player