
class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    create() {

    }
}

class LoadScene extends Phaser.Scene {
    constructor() {
        super("LoadScene");
    }

    preload() {

    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("MenuScene");

    }
}