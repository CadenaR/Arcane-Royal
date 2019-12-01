class MenuScene extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        this.load.image("logo", "../resources/Images/logoArcane.png");
        this.load.image("fondo", "../resources/Images/sky2.jpg");
    }

    create() {

        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * .40, "logo").setDepth(1);
        this.add.image(0, 0, "fondo").setOrigin(0).setDepth(0);
        const playBtn = this.add.text(this.game.renderer.width * .40, this.game.renderer.height * 0.60, 'Play', {
            fontSize: '100px',
            fill: '#000',
            align: "center"
        }).setInteractive();

        playBtn.on('pointerover', () => {
            playBtn.setStyle({
                fill: '#ff0'
            });
        });

        playBtn.on('pointerout', () => {
            playBtn.setStyle({
                fill: '#000'
            });
        });

        var that = this;
        playBtn.on('pointerdown', () => {
            this.scene.start("gameScene");
        });
    }
}