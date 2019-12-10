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
    }

    create() {
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

    update() {
        if (numMsgs >= 0) {
            loadMessages(function (messages) {
                for (var i = numMsgs + 1; i < messages.length; i++) {
                    showOtherMessage(messages[i]);
                }

            });

        }
    }
}

function createConnection(connection, callback) {
    $.ajax({
        url: "/connections",
        method: "POST",
        processData: false,
        data: JSON.stringify(connection),
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (response) {
        callback(response);
    });

}

function updateConnection(connection) {
    $.ajax({
        method: 'PUT',
        url: '/connections/' + connection.id,
        data: JSON.stringify(connection),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (connection) {
        console.log("Updated item: " + JSON.stringify(connection))
    })
}

//Carga de mensajes desde servidor
function loadMessages(callback) {
    $.ajax({
        url: '/messages'
    }).done(function (message) {
        callback(message);
    })
}

//Crear mensaje en el servidor
function createMessage(message, callback) {
    $.ajax({
        method: "POST",
        url: '/messages',
        data: JSON.stringify(message),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (message) {
        callback(message);
    })
}

//Mostrar mensaje en el chat
function showOtherMessage(message) {
    if (message.text == "conectado") {
        showConnectMessage(message)
    } else if (message.text == "desconectado") {
        showDisconnectMessage(message)
    } else {
        numMsgs++;
        $('#myMessages').append(
            '<div class="message-other"><span>' + message.text +
            '</span> </div>')
    }

}

function showMyMessage(message) {
    numMsgs++;
    $('#myMessages').append(
        '<div class="message-mine"><span>' + message +
        '</span> </div>')
}

function showConnectMessage(message) {
    numMsgs++;
    $('#myMessages').append(
        '<div class="message-connection"><span>' + message.ip + ' ' + message.text +
        '</span> </div>')
}

function showDisconnectMessage(message) {
    numMsgs++;
    $('#myMessages').append(
        '<div class="message-disconnection"><span>' + message.ip + ' ' + message.text +
        '</span> </div>')
}

$(document).ready(function () {

    var input = $('#value-input')

    //Boton de enviar
    $("#send").click(function () {

        var value = input.val();
        input.val('');

        var message = {
            text: value,
        }
        showMyMessage(value);
        createMessage(message, function (messageWithId) {

        });
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

    createMessage(disconnection, function (m) {

    });

    return null;
});