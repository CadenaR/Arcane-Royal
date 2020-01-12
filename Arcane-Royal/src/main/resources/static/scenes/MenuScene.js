//Variables de API
var connectionIP;
var connectionID;
var connectionDate;
var numMsgs;
class MenuScene extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        this.load.image("logo", "../resources/Images/logoArcane.png");
        this.load.image("fondo", "../resources/Images/sky1.png");
        this.load.audio("click", "../resources/Sounds/click_interface.wav");
        
    }

    create() {
        orden = 0;
        connectionDate = new Date();
        
        var connection = {
            connected: true,
            date: connectionDate
        }

        createConnection(connection, function (connectionWithId) {
            connectionID = connectionWithId.id;
            connectionIP = connectionWithId.ip;

        });

        var newConnection = {
            text: 'conectado',
        }

        createMessage(newConnection, function (messageWithId) {

        });

        loadMessages(function (messages) {
            numMsgs = messages.length - 1;
        });

        this.add.image(this.game.renderer.width / 2 - 3, this.game.renderer.height * .40, "logo").setDepth(1);
        this.add.image(0, 0, "fondo").setOrigin(0).setDepth(0);
        const playBtn = this.add.text(this.game.renderer.width * .40 - 72, this.game.renderer.height * 0.45, 'Jugar', {
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

        playBtn.on('pointerdown', () => {

            scene.sound.play("click");
            play = true;
            openSocket();
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

        controlBtn.on('pointerdown', () => {

            scene.sound.play("click");
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

        
        creditBtn.on('pointerdown', () => {

            scene.sound.play("click");
            this.scene.start("creditScene");
        });
        comenzar = false;
        jugar = false;
    }

    update() {
        console.log("chat running");
        if (play && asignado){
            play = false;
            asignado = false;

            this.scene.start("loginScene");            
        }
        chatRun();
    }
}



$(document).ready(function () {
    var userInput = $('#userInput');
    var input = $('#value-input')

    //Boton de enviar
    $("#send").click(function () {

        var value = input.val();
        input.val('');
        if (user === null) {
            user2 = 'Anónimo';
        } else {
            user2 = user;
        }
        var message = {
            text: user2 + ':<br>' + value
        }
        showMyMessage(value);
        createMessage(message, function (messageWithId) {

        });
    })

    $("#user").click(function () {
        user = userInput.val();
    })
})

$(window).on("beforeunload", function () {
    var updatedConnection = {
        id: connectionID,
        connected: false,
        ip: connectionIP,
        date: connectionDate

    }

    updateConnection(updatedConnection);

    var disconnection = {
        text: 'desconectado',
    }

    return null;
});