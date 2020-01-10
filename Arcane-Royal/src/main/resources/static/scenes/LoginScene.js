class LoginScene extends Phaser.Scene {
    constructor() {
        super("loginScene");
    }
    preload() {
        this.load.image("loginfondo", "../resources/Images/loginfondo.png");
        this.load.html('nameform', 'resources/Text/loginform.html');
        this.load.audio("click", "../resources/Sounds/click_interface.wav");
        this.load.image("Sel1", "../resources/Images/player1_selected.png");
        this.load.image("Sel2", "../resources/Images/player2_selected.png");
        this.load.image("NoSel1", "../resources/Images/player1_no_selected.png");
        this.load.image("NoSel2", "../resources/Images/player2_no_selected.png");
        openSocket();
    }

    create() {


        this.add.image(0, 0, "loginfondo").setOrigin(0).setDepth(0);
        var element = this.add.dom(400, this.game.renderer.height * .45).createFromCache('nameform');
        element.setDepth(100);
        if (orden === 0) {
            this.add.image(225, 140, "Sel1").setOrigin(0).setDepth(1);
            this.add.image(845, 140, "NoSel2").setOrigin(0).setDepth(1);

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
                if (user != null) {

                    scene.sound.play("click");
                    doSend("Jugar");
                }
            });


        } else {
            this.add.image(845, 140, "Sel2").setOrigin(0).setDepth(1);
            this.add.image(225, 140, "NoSel1").setOrigin(0).setDepth(1);
        }



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
            websocket.close();
            scene.sound.play("click");
            this.scene.start("menuScene");
        });
    }
}