class MenuScene extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        this.load.image("logo", "../resources/Images/logoArcane.png");
        this.load.image("fondo", "../resources/Images/sky1.png");
    }

    create() {

        this.add.image(this.game.renderer.width / 2-3, this.game.renderer.height * .40+15, "logo").setDepth(1);
        this.add.image(0, 0, "fondo").setOrigin(0).setDepth(0);
        const playBtn = this.add.text(this.game.renderer.width * .40-72, this.game.renderer.height * 0.45, 'Jugar', {
            fontSize: '80px',
            fill: '#000',
            align: "center",
            fontFamily: 'mifuente'
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
   
        const ControlBtn = this.add.text(this.game.renderer.width * .31-75-55+11, this.game.renderer.height * 0.6, 'Controles', {
            fontSize: '80px',
            fill: '#000',
            align: "center",
            fontFamily: 'mifuente'
        }).setInteractive();

        ControlBtn.on('pointerover', () => {
            ControlBtn.setStyle({
                fill: '#ff0'
            });
        });

        ControlBtn.on('pointerout', () => {
            ControlBtn.setStyle({
                fill: '#000'
            });
        });

        var that = this;
        ControlBtn.on('pointerdown', () => {
            this.scene.start("creditScene");
        });
             
        const CreditBtn = this.add.text(this.game.renderer.width * .31-75-55+11+48, this.game.renderer.height * 0.75, 'Créditos', {
            fontSize: '80px',
            fill: '#000',
            align: "center",
            fontFamily: 'mifuente'
        }).setInteractive();

        CreditBtn.on('pointerover', () => {
            CreditBtn.setStyle({
                fill: '#ff0'
            });
        });

        CreditBtn.on('pointerout', () => {
            CreditBtn.setStyle({
                fill: '#000'
            });
        });

        var that = this;
        CreditBtn.on('pointerdown', () => {
            this.scene.start("creditScene");
        });
        
    }
}