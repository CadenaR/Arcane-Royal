class MenuScene extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        this.load.image("logo", "../resources/Images/logoArcane.png");
        this.load.image("fondo", "../resources/Images/sky1.png");
    }

    create() {
        this.add.image(this.game.renderer.width / 2-3, this.game.renderer.height * .40, "logo").setDepth(1);
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
            this.scene.start("loginScene");
        });
        
        const controlBtn = this.add.text(this.game.renderer.width * .31 - 75 - 55 + 11, this.game.renderer.height * 0.6, 'Controles', {
            fontSize: '80px',
            fill: '#000',
            align: "center",
            fontFamily: 'mifuente'
        }).setInteractive();

        controlBtn.on('pointerover', () => {
            controlBtn.setStyle({
                fill: '#ff0'
            });
        });

        controlBtn.on('pointerout', () => {
            controlBtn.setStyle({
                fill: '#000'
            });
        });

        var that = this;
        controlBtn.on('pointerdown', () => {
            this.scene.start("controlScene");
        });

        const creditBtn = this.add.text(this.game.renderer.width * .31 - 75 - 55 + 11 + 48, this.game.renderer.height * 0.75, 'Creditos', {
            fontSize: '80px',
            fill: '#000',
            align: "center",
            fontFamily: 'mifuente'
        }).setInteractive();

        creditBtn.on('pointerover', () => {
            creditBtn.setStyle({
                fill: '#ff0'
            });
        });

        creditBtn.on('pointerout', () => {
            creditBtn.setStyle({
                fill: '#000'
            });
        });

        var that = this;
        creditBtn.on('pointerdown', () => {
            this.scene.start("creditScene");
        });
    }
}