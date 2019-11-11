
class GameScene extends Phaser.Scene {

class LoadScene extends Phaser.Scene {

    constructor() {
        super("loadScene");
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

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("gameScene");
    }
}