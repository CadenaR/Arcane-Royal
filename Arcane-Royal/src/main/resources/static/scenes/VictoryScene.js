class VictoryScene extends Phaser.Scene {
    constructor() {
        super("victoryScene");
    }
    
    preload(){
        this.load.image("loginfondo", "../resources/Images/loginfondo.png");
        this.load.image("fondo", "../resources/Images/sky1.png");
        
    }
    
    create() {

        //this.add.image(0, 0, "loginfondo").setOrigin(0).setDepth(0);
        fondo = this.add.image(0, 0, "fondo").setOrigin(0).setDepth(0);
       var ganar = this.add.text(this.game.renderer.width * .05, this.game.renderer.height * 0.25, ganador, {
            fontSize: '60px',
            fill: '#000',
            align: "center",
            fontFamily: 'mifuente'
        });

       

        var salirMenu =  this.add.text(this.game.renderer.width * .15, this.game.renderer.height * 0.75, "Volver al menu", {
            fontSize: '60px',
            fill: '#000',
            align: "center",
            fontFamily: 'mifuente'
        }).setInteractive();

        salirMenu.on('pointerover', () => {
            salirMenu.setStyle({
                fill: '#ff0'
            });
        });

        salirMenu.on('pointerout', () => {

            salirMenu.setStyle({
                fill: '#000'
            });
        });

        salirMenu.on('pointerdown', () => {

            scene.sound.play("click");
            this.scene.start("menuScene");
            websocket.close();
        });
        //this.scene.start("menuScene");
    }
}