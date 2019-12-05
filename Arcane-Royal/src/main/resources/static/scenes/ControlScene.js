class ControlScene extends Phaser.Scene {
    constructor() {
        super("controlScene");
    }
    preload() {
        this.load.image("controles", "../resources/Images/controles.png");
        
    }

    create() {

        this.add.image(0, 0, "fondo").setOrigin(0).setDepth(0);
        this.add.image(this.game.renderer.width / 2-3, this.game.renderer.height * .33, "controles").setDepth(1);
        const backBtn = this.add.text(this.game.renderer.width * .32, this.game.renderer.height * 0.75, 'Volver', {
            fontSize: '80px',
            fill: '#000',
            align: "center",
            fontFamily: 'mifuente'
        }).setInteractive();

        backBtn.on('pointerover', () => {
            backBtn.setStyle({
                fill: '#ff0'
            });
        });

        backBtn.on('pointerout', () => {
            backBtn.setStyle({
                fill: '#000'
            });
        });

        var that = this;
        backBtn.on('pointerdown', () => {
            this.scene.start("menuScene");
        });
    }
}