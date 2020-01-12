class ControlScene extends Phaser.Scene {
    constructor() {
        super("controlScene");
    }
    preload() {
        this.load.image("controles", "../resources/Images/controles.png");
        this.load.audio("click", "../resources/Sounds/click_interface.wav");
    }

    create() {

        this.add.image(0, 0, "fondo").setOrigin(0).setDepth(0);
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * .385, "controles").setDepth(1);
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
            
            scene.sound.play("click");
            this.scene.start("menuScene");
        });
    }
    update(){
        chatRun()
    }
}