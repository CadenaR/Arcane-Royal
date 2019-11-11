class MenuScene extends Phaser.Scene {
    constructor() {

        super("MenuScene");
    }

    create() {


        super("menuScene");
    }

    create() {
        

        const playBtn = this.add.text(this.game.renderer.width / 3, this.game.renderer.height / 3, 'Play', {
            fontSize: '100px',
            fill: '#0f0'
        });
        playBtn.setInteractive();

        playBtn.on('pointerover', () => {
            console.log('pointerover');
        });

        var that = this;
        playBtn.on('pointerdown', () => {
            this.scene.start("gameScene");
        });

    }
}