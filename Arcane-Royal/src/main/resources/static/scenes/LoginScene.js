class LoginScene extends Phaser.Scene {
    constructor() {
        super("loginScene");
    }
    preload() {
        this.load.image("loginfondo", "../resources/Images/loginfondo.png");
        this.load.html('nameform', 'resources/Text/loginform.html');
        this.load.audio("click", "../resources/Sounds/click_interface.wav");
    }

    create() {
        openSocket();        

        this.add.image(0, 0, "loginfondo").setOrigin(0).setDepth(0);
        var element = this.add.dom(400, this.game.renderer.height * .45).createFromCache('nameform');
        element.setDepth(100);
        
        const startBtn = this.add.text(this.game.renderer.width * .31, this.game.renderer.height * 0.70, 'Comenzar', {
            fontSize: '60px',
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
            if (user!=null){
                
                scene.sound.play("click");
                this.scene.start("gameScene");
            }
        });
    

        const backBtn = this.add.text(this.game.renderer.width * .36, this.game.renderer.height * 0.83, 'Volver', {
            fontSize: '60px',
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
}