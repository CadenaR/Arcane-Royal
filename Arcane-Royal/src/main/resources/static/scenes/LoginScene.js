class LoginScene extends Phaser.Scene {
    constructor() {
        super("loginScene");
    }
    preload() {
        this.load.html('nameform', 'resources/Text/loginform.html');
    }

    create() {
        
        this.add.image(0, 0, "fondo").setOrigin(0).setDepth(0);
        var element = this.add.dom(400, this.game.renderer.height * .45).createFromCache('nameform');
        element.setDepth(100);
        
        const startBtn = this.add.text(this.game.renderer.width * .27, this.game.renderer.height * 0.6, 'Comenzar', {
            fontSize: '80px',
            fill: '#000',
            align: "center",
            fontFamily: 'mifuente'
        }).setInteractive();

        startBtn.on('pointerover', () => {
            startBtn.setStyle({
                fill: '#ff0'
            });
        });

        startBtn.on('pointerout', () => {
            startBtn.setStyle({
                fill: '#000'
            });
        });

        var that = this;
        startBtn.on('pointerdown', () => {
            user=1;
            if (user!=null){
                this.scene.start("gameScene");
            }
        });
    

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