//=====Variables globales=====
// Variables para API
var numMsgs;
var noChating = true;
var user = "Anónimo";
var user2;

//Variables websocket
var websocket;
var datosEnv;
var datosRecib;
var cambio;
var response = false;

//Variables de los jugadores
var player = new Object();
var orden = 0;
var magoAzul;
var magoRojo;
var playerSprite;
var velocity = [];
var animation;
var pastPos = [];
var comenzar;
var jugar;

//Variables de conexión
var newCon = false;
var disc;
var asignado = false;
var play = false;

//Variables globales de la escena
var scene;
var globalScore = [0, 0];
var gameWin = 3; // rondas de victoria
var ganador;

var salirMenu;
var volver;
var fondo;

//Variables de la UI
var uiPos = [];
var cargaR;
var cargaA;

//Variables de los disparos
var bullets1;
var bullets2;
var BuVel = 900;

//Variables de la generación de items
var delaySpawn = 3; //En segundos
var ratio;
var damage = 0.75;
var heal = 0.85;
var shield = 1;
var selected;
var full = false;

//Variables que regulan la velocidad de los personajes
var plVel = 300;
var framer = 14;

//Variables empleadas al generar y procesar tiles
var tiles = [];
var tileStr = [];
var occCount;
var mapselect = [];

//Array de archivos de mapas
var archivosMapas = [];

//Referencias colisiones de los jugadores con las balas
var colision1;
var colision2;

//Variables de items
var items = [];
var itemLimit = 15;
var orbes;
var escudo;
var escudoTime;
var cursors;
//=====Clases=====
class Mage {
    constructor(color, colorN, sprite, vida, escudo, ataque, velocidad, mAngle, spriteEscudo, moveSprite) {
        this.color = color;
        this.colorN = colorN;
        this.sprite = sprite;
        this.vida = vida;
        this.escudo = escudo;
        this.ataque = ataque;
        this.velocidad = velocidad;
        this.mAngle = mAngle;
        this.spriteEscudo = spriteEscudo;
        this.escudoTime = 0;
        this.moveSprite = moveSprite;
        this.moveSprite.setVisible(false);
    }
    updateVida(v) {
        this.vida += v;
        GameScene.prototype.updateUI(this.color, this.colorN, this.vida);
    }
    updateCarga(v, alpha) {
        this.ataque = v;
        GameScene.prototype.updateCarga(this.colorN, alpha);
    }
    setEnemy(enemy) {
        this.enemy = enemy;
    }
    getEnemy() {
        return this.enemy;
    }
}

class Tile {
    constructor(type) {
        this.type = type;
        this.occup = false;
        //Solo queremos generar items en los tiles del tipo 0 así que marcamos los demás como ocupados
        if (type != 0) {
            occCount++;
            this.occup = true;
        }
        this.x = -1;
        this.y = -1;
    }
    free() {
        this.occup = false;
        full = false;
    }
    fill() {
        this.occup = true;
    }
    getType() {
        return this.type;
    }
    getOccup() {
        return this.occup;
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    //Los métodos getX2 y getY2 devuelven el número del tile según x e y por ejemplo, si usamos
    //los métodos getX y getY en el tile que está ubicado en la posición 2, 3; estos métodos nos
    //devolverán la posición en la que se ha dibujado el tile, pero si usamos getX2 y getY2, se
    //nos devolverá el tile 2, 3
    getX2() {
        return this.x / 64;
    }
    getY2() {
        return (this.y - 16) / 64;
    }
}

//=====Funciones=====
function chatRun(){
    
    if (numMsgs >= 0) {
        loadMessages(function (messages) {
            for (var i = numMsgs + 1; i < messages.length; i++) {
                showOtherMessage(messages[i]);
            }

        });

    }
}
function openSocket() {
    //WebSockets
    disc = false;
    websocket = new WebSocket("ws://" + location.host + "/echo");
    websocket.onmessage = function (evt) {
        onMessageConnection(evt)
    };
    websocket.onopen = function (evt) {
        onOpen(evt)
    };
    websocket.onclose = function (evt) {
        onClose(evt)
    };
    websocket.onerror = function (evt) {
        onError(evt)
    };
}

//Esta función se usa para calcular en que parte del mapa está el tile opuesto simetricamente en el eje x
//al tile en n
function searchTile(x, y) {
    for (const t of tiles) {
        if (t.getX2() == x && t.getY2() == y) {
            return t;
        }
    }
}

//Comprueba que no se ha llegado al límite de items
function checkFull() {
    full = true;
    var n = 0;
    for (const t of tiles) {
        if (t.getOccup() == true) {
            n++;
        }
    }
    //El límite de items son 15, aquí usamos 67 porque también debemos contar los 52 tiles ocupados
    //en los que no podemos generar items
    if (n < occCount + itemLimit) {
        full = false;
    }
}

function destroyBullet(bullet, wall) {
    bullet.destroy();
}

//lee la configuracion del mapa en txt
function leerConfig() {
    var fileRuta = [];

    for (var x = 0; x < 5; x++) {
        fileRuta[x] = '../resources/maps/mapa' + (x + 1) + '.txt';
        archivosMapas[x] = fileRuta[x];
    }
    var arrayData = new Array();
    var archivoTXT = new XMLHttpRequest();
    archivoTXT.open("GET", archivosMapas[mapselect[globalScore[0] + globalScore[1]]], false);
    archivoTXT.send(null);
    var txt = archivoTXT.responseText;

    for (var i = 0; i < txt.length; i++) {
        if (txt[i] != "\n" && txt[i] != '\r')
            arrayData.push(parseInt(txt[i]));
    }
    return arrayData;
}

//Se define lo que ocurre al coger un objeto
function pickup(mago, item) {
    scene.sound.play("pickup");
    switch (item.texture.key) {
        case "orbe1":
            if (mago.mago.vida < 3) {
                mago.mago.updateVida(1);
                scene.sound.play("healing");
            }
            break;
        case "orbe2":
            if (!mago.mago.escudo) {
                scene.sound.play("shield");
                mago.mago.spriteEscudo.setActive(true);
                mago.mago.spriteEscudo.setVisible(true);
                mago.mago.escudo = true;
                mago.mago.escudoTime = 300;
            }
            break;
        case "orbe3":
            mago.mago.updateCarga(true, 1);
            break;
        default:
            break;
    };
    var resetTile = searchTile((item.x - 32) / 64, (item.y - 48) / 64);
    resetTile.free();

    item.destroy();


}

//Se define lo que ocurre cuando un disparo impacta al mago
function makeDamage(mago, bullet) {
    datosEnv = {
        tipo: "Damage",
        color: player.color,
        bullet: bullet
    }
    doSend(JSON.stringify(datosEnv));
    if (!mago.mago.escudo) {
        mago.mago.updateVida(-1);
        scene.sound.play("hurt");
    } else {
        mago.mago.escudo = false;
        mago.mago.spriteEscudo.setActive(false)
        mago.mago.spriteEscudo.setVisible(false);
    }
    bullet.kill();
    if (mago.mago.vida === 0) {
        globalScore[mago.mago.getEnemy().colorN]++;
        mago.setActive(false);
        mago.setVisible(false);
        colision1.destroy();
        colision2.destroy();
        if (globalScore[0] != gameWin && globalScore[1] != gameWin) {
            setTimeout(sceneTransition, 1000, 'gameScene');
        }

        if (globalScore[0] === gameWin) {

            globalScore[0] = 0;
            globalScore[1] = 0;
            console.log("Rojo gana");
           /* var message = {
                text: "Ha ganado: Mago Rojo",
            }
            showMyMessage("Ha ganado: Mago Rojo");
            createMessage(message, function (messageWithId) {

            });
            */
           ganador  = "Ha ganado Jugador 1";

            
            setTimeout(sceneTransition, 2000, 'victoryScene');

        }

        if (globalScore[1] === gameWin) {
            console.log("Azul gana");

            globalScore[0] = 0;
            globalScore[1] = 0;
           /* var message = {
                text: "Ha ganado: Mago Azul",
            }
            showMyMessage("Ha ganado: Mago Azul");
            createMessage(message, function (messageWithId) {

            });
            */
           ganador  = "Ha ganado Jugador 2";
            
            

            setTimeout(sceneTransition, 2000, 'victoryScene');
        }
    }
}

function sceneTransition(param) {
    scene.scene.start(param);
}

function getMaps() {
    if (orden === 0) {
        doSend("RONDA");
    } else {
        doSend("MAPA");
    }
}

//Estos arrays referencian a las imágenes cargadas en el preload, de esta forma hay más facilidad a la hora
//de dibujar los objetos
//
//items contiene los strings que referencian la imagen para cada item, para usarla posteriormente
items[0] = 'orbe1'; //vida
items[1] = 'orbe2'; //escudo
items[2] = 'orbe3'; //daño

//tileStr contiene los strings que referencian la imagen para cada tile, para usarla posteriormente
tileStr[0] = 'ground';
tileStr[1] = 'wall';
tileStr[2] = 'baseroja';
tileStr[3] = 'baseazul';

//uiPos contiene la posición de la interfaz del jugador 1 y la del 2.
uiPos[0] = [0, 0];
uiPos[1] = [1280 - 128, 0];
uiPos[2] = [85, 16];
uiPos[3] = [1280 - 84, 16];
uiPos[4] = [1280 / 2 - 48, 0];

//=====GameScene=====
class GameScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
        scene = this;
    }
    preload() {
        this.load.image("fondo", "../resources/Images/sky1.png");
        this.load.image('wall', "resources/Images/barril2.png");
        this.load.image('ground', "resources/Images/tile2.png");
        this.load.image('orbe1', "resources/Images/orbe1.png");
        this.load.image('orbe2', "resources/Images/orbe2.png");
        this.load.image('orbe3', "resources/Images/orbe3.png");
        this.load.image('baseroja', "resources/Images/baseroja.png");
        this.load.image('baseazul', "resources/Images/baseazul.png");
        this.load.image('escudo', "resources/Images/escudo.png");
        this.load.image("player1", "resources/Images/player1.png");
        this.load.image("player2", "resources/Images/player2.png");
        this.load.image('bullet', "resources/Images/fireball.png");
        this.load.image('UIbase1', "resources/Images/interfazbase1.png");
        this.load.image('UIbase2', "resources/Images/interfazbase2.png");
        this.load.image('rojo0', "resources/Images/interfaz1.png");
        this.load.image('rojo1', "resources/Images/rojo1hp.png");
        this.load.image('rojo2', "resources/Images/rojo2hp.png");
        this.load.image('rojo3', "resources/Images/rojo3hp.png");
        this.load.image('azul0', "resources/Images/interfaz2.png");
        this.load.image('azul1', "resources/Images/azul1hp.png");
        this.load.image('azul2', "resources/Images/azul2hp.png");
        this.load.image('azul3', "resources/Images/azul3hp.png");
        this.load.image('orbeUI', "resources/Images/orbe-interfaz.png");
        this.load.image('orbeUI2', "resources/Images/orbe-interfaz2.png");
        this.load.image('puntosUI', "resources/Images/puntos interfaz.png");

        this.load.audio("click", "../resources/Sounds/click_interface.wav");
        this.load.audio("fireball", "../resources/Sounds/fireball.wav");
        this.load.audio("healing", "../resources/Sounds/healing.wav");
        this.load.audio("shield", "../resources/Sounds/shield.wav");
        this.load.audio("pickup", "../resources/Sounds/pickup.wav");
        this.load.audio("hurt", "../resources/Sounds/hurt.wav");

        this.load.spritesheet("azulLR", "resources/Images/mago-azul.png", {
            frameWidth: 60,
            frameHeight: 64
        });
        this.load.spritesheet("rojoLR", "resources/Images/mago-rojo.png", {
            frameWidth: 60,
            frameHeight: 64
        });
        this.load.spritesheet("azulUD", "resources/Images/mago-azulupdown.png", {
            frameWidth: 60,
            frameHeight: 64
        });
        this.load.spritesheet("rojoUD", "resources/Images/mago-rojoupdown.png", {
            frameWidth: 60,
            frameHeight: 64
        });
    }

    create() {
        this.physics.world.setFPS(30);
        loadMessages(function (messages) {
            numMsgs = messages.length - 1;
        });


        //La variable orbes guarda un grupo con todos los objetos de los items, nos servirá mas adelante para las colisiones
        orbes = this.physics.add.group();

        //Para hacer la generación aleatoria de items, hemos usado un timer que genera cada cierto
        //tiempo un item a través de la función generar
        if (orden == 0) {
            var timedEvent = this.time.addEvent({
                delay: delaySpawn * 1000, // 1seg = 1000ms
                callback: generar,
                loop: true
            });
        }

        //La función generar es la que se encarga de seleccionar que item se va a dibujar y de dibujarlo
        function generar() {
            ratio = Math.random() + 0.2;
            if (ratio <= damage) {
                selected = 2; //50% item de daño
            } else if (ratio >= heal) {
                selected = 1; //30% item de escudo
            } else if (ratio > damage && ratio < heal) {
                selected = 0; //20% item de vida
            }
            //Para dibujar el item, seleccionamos un tile aleatoriamente hasta encontrar uno libre,
            //un tile libre es un tile transitable que no tiene items generados en él.
            if (!full) {
                do {
                    var randX = Math.floor(Math.random() * 20);
                    var randY = Math.floor(Math.random() * 11);
                    var checkTile = searchTile(randX, randY);
                } while (!full && checkTile.getOccup());

                //Estas dos funciones se aseguran de que no se llene la pantalla de items, la primera
                //marca el tile elegido como ocupado y la segunda mira si hay más de 15 items ocupados,
                //i lo hay, la variable full pasa a ser true y no se generan más items hasta que no se
                //coja alguno. Posteriormente se lo pasamos por websocket para que se genere el item en
                //las dos partidas

                datosEnv = {
                    tipo: "Item",
                    x: randX,
                    y: randY,
                    itemType: selected
                }
                doSend(JSON.stringify(datosEnv));
            }
        }

        //Obtenido de https://labs.phaser.io/edit.html?src=src/input/gamepad/twin%20stick%20shooter.js
        //Creamos una clase Bullet usando Phaser.Class y en ella definimos los métodos que usamos para los disparos
        var Bullet = new Phaser.Class({
            Extends: Phaser.Physics.Arcade.Image,

            initialize: function Bullet(scene) {
                Phaser.Physics.Arcade.Image.call(this, scene, 0, 0, 'bullet');

                this.setBlendMode(1);
                this.setDepth(1);
                this.speed = BuVel;
                this.lifespan = 250000 / BuVel;

                this._temp = new Phaser.Math.Vector2();
            },

            fire: function (player) {
                this.lifespan = 1000;

                this.setActive(true);
                this.setVisible(true);
                this.setPosition(player.sprite.x, player.sprite.y);

                this.body.reset(player.sprite.x, player.sprite.y);

                this.body.setSize(15, 15, true);

                var angle = Phaser.Math.DegToRad(player.mAngle);
                this.angle = player.mAngle + 180;

                this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);

                this.body.velocity.x *= 2;
                this.body.velocity.y *= 2;
            },

            update: function (time, delta) {
                this.lifespan -= delta;

                if (this.lifespan <= 0) {
                    this.kill();
                }
            },

            kill: function () {
                this.destroy();
            }

        });

        //Los group bullets1 y bullets2, gestionan los disparos de cada jugador
        bullets1 = this.physics.add.group({
            classType: Bullet,
            maxSize: 1,
            runChildUpdate: true
        });

        bullets2 = this.physics.add.group({
            classType: Bullet,
            maxSize: 1,
            runChildUpdate: true
        });


        //Lector de archivos de configuracion de mapa y selección de mapa.        
        var arrayTile = leerConfig();
        occCount = 0;
        //Aquí generamos todos los tiles según el mapa cargado
        for (var i = 0; i < arrayTile.length; i++) {
            tiles[i] = new Tile(arrayTile[i]);
        }

        var wall = this.physics.add.staticGroup();

        //Procedemos a asignar a cada tile su posición y a dibujarlos
        for (var i = 0; i < 20 * 11; i++) {
            tiles[i].setPos(i % 20 * 64 + 32, 16 + Math.floor(i / 20) * 64 + 32);

            if (tiles[i].getType() === 1) {
                wall.create(tiles[i].getX(), tiles[i].getY(), tileStr[tiles[i].getType()]);
            } else {
                this.physics.add.sprite(tiles[i].getX(), tiles[i].getY(), tileStr[tiles[i].getType()]);
            }

            tiles[i].setPos(i % 20 * 64, 16 + Math.floor(i / 20) * 64);
        }

        //A continuación vamos a definir los jugadores, añadirles los sprites y todos los temas de las físicas y colisiones con los muros
        magoRojo = new Mage('rojo', 0, this.physics.add.sprite(64, 360, "player1"), 3, false, false, plVel, 0, this.physics.add.sprite(64, 360, "escudo"), this.physics.add.sprite(64, 360, "player1"));
        magoAzul = new Mage('azul', 1, this.physics.add.sprite(1216, 360, "player2"), 3, false, false, plVel, 180, this.physics.add.sprite(1216, 360, "escudo"), this.physics.add.sprite(1216, 360, "player2"));

        magoAzul.setEnemy(magoRojo);
        magoRojo.setEnemy(magoAzul);

        magoRojo.sprite.mago = magoRojo;
        magoAzul.sprite.mago = magoAzul;

        magoAzul.spriteEscudo.setActive(false);
        magoAzul.spriteEscudo.setVisible(false);
        magoRojo.spriteEscudo.setActive(false);
        magoRojo.spriteEscudo.setVisible(false);

        this.physics.add.collider(magoRojo.moveSprite, wall);
        this.physics.add.collider(magoAzul.moveSprite, wall);

        this.physics.world.bounds.top = 16;
        this.physics.world.bounds.bottom = 720;

        magoRojo.sprite.physicsBodyType = Phaser.Physics.ARCADE;
        magoRojo.moveSprite.body.setCollideWorldBounds(true);

        magoAzul.sprite.physicsBodyType = Phaser.Physics.ARCADE;
        magoAzul.moveSprite.body.setCollideWorldBounds(true);

        //Dibujo de la interfaz
        this.add.image(uiPos[0][0], uiPos[0][1], 'UIbase1').setOrigin(0, 0);
        this.add.image(uiPos[1][0], uiPos[1][1], 'UIbase2').setOrigin(0, 0);
        this.add.image(uiPos[0][0], uiPos[0][1], magoRojo.color + magoRojo.vida).setOrigin(0, 0);
        this.add.image(uiPos[1][0], uiPos[1][1], magoAzul.color + magoAzul.vida).setOrigin(0, 0);
        this.add.image(uiPos[4][0], uiPos[0][0], 'puntosUI').setOrigin(0, 0);
        cargaR = this.add.image(uiPos[2][0], uiPos[2][1], 'orbeUI');
        cargaA = this.add.image(uiPos[3][0], uiPos[3][1], 'orbeUI');

        this.add.text(uiPos[4][0] + 16, uiPos[0][1] + 5, globalScore[0].toString(), {
            fontSize: 18,
            color: "#F88",
            fontFamily: 'mifuente'
        });
        this.add.text(uiPos[4][0] + 60, uiPos[0][1] + 5, globalScore[1].toString(), {
            fontSize: 18,
            color: "#88F",
            fontFamily: 'mifuente'
        });

        cargaR.scale = 1.1;
        cargaA.scale = 1.1;
        cargaR.alpha = 0.4;
        cargaA.alpha = 0.4;

        fondo = this.add.image(0, 0, "fondo").setOrigin(0).setDepth(0);
        fondo.setVisible(false);

        volver = this.add.text(this.game.renderer.width * .36, this.game.renderer.height * 0.60, 'Volver', {
            fontSize: '60px',
            fill: '#000',
            align: "center",
            fontFamily: 'mifuente'
        }).setInteractive();

        volver.on('pointerover', () => {
            volver.setStyle({
                fill: '#ff0'
            });
        });

        volver.on('pointerout', () => {

            volver.setStyle({
                fill: '#000'
            });
        });
        // volver.disableInteractive();

        salirMenu = this.add.text(this.game.renderer.width * .20, this.game.renderer.height * 0.30, 'Salir al menu', {
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

        salirMenu.disableInteractive();
        salirMenu.setVisible(false);
        volver.disableInteractive();
        volver.setVisible(false);

        volver.on('pointerdown', () => {
            scene.sound.play("click");
            fondo.setVisible(false);
            salirMenu.disableInteractive();
            salirMenu.setVisible(false);
            volver.disableInteractive();
            volver.setVisible(false);


        });

        salirMenu.on('pointerdown', () => {

            disc = true;
            doSend("DISCONNECTED");
            scene.sound.play("click");
            setTimeout(sceneTransition, 100, 'menuScene');
           // location.reload(true);
        });

        //salirMenu.disableInteractive();
        //salirMenu.setVisible(false);


        //Después de definir los jugadores, pasamos a definir todas las animaciones de cada mago
        this.anims.create({
            key: "right_rojo",
            frames: this.anims.generateFrameNames("rojoLR", {
                start: 4,
                end: 7
            }),
            frameRate: framer,
            repeat: 0
        });

        this.anims.create({
            key: "left_rojo",
            frames: this.anims.generateFrameNames("rojoLR", {
                start: 0,
                end: 3
            }),
            frameRate: framer,
            repeat: 0
        });

        this.anims.create({
            key: "right_azul",
            frames: this.anims.generateFrameNames("azulLR", {
                start: 4,
                end: 7
            }),
            frameRate: framer,
            repeat: 0
        });

        this.anims.create({
            key: "left_azul",
            frames: this.anims.generateFrameNames("azulLR", {
                start: 0,
                end: 3
            }),
            frameRate: framer,
            repeat: 0
        });
        this.anims.create({
            key: "up_rojo",
            frames: this.anims.generateFrameNames("rojoUD", {
                start: 4,
                end: 7
            }),
            frameRate: framer,
            repeat: 0
        });

        this.anims.create({
            key: "down_rojo",
            frames: this.anims.generateFrameNames("rojoUD", {
                start: 0,
                end: 3
            }),
            frameRate: framer,
            repeat: 0
        });

        this.anims.create({
            key: "up_azul",
            frames: this.anims.generateFrameNames("azulUD", {
                start: 4,
                end: 7
            }),
            frameRate: framer,
            repeat: 0
        });

        this.anims.create({
            key: "down_azul",
            frames: this.anims.generateFrameNames("azulUD", {
                start: 0,
                end: 3
            }),
            frameRate: framer,
            repeat: 0
        });

        //Aquí añadimos todas las teclas del teclado que vamos a usar
        cursors = this.input.keyboard.addKeys('W,S,A,D,Q,E,ESC');

        //Esto define las colisiones de las balas con los muros
        this.physics.add.overlap(bullets1, wall, destroyBullet, null, this);
        this.physics.add.overlap(bullets2, wall, destroyBullet, null, this);

        //Esto define la colisión de los jugadores con los items
        this.physics.add.overlap(magoAzul.sprite, orbes, pickup, null, this);
        this.physics.add.overlap(magoRojo.sprite, orbes, pickup, null, this);

        if (orden === 0) {
            player.mago = magoRojo;
            player.color = "rojo";

            //Esto define las colisiones de los magos con las balas. La asignamos a variables para poder destruirlas
            //cuando muere un jugador
            colision1 = this.physics.add.overlap(magoAzul.sprite, bullets1, makeDamage, null, this);
            colision2 = this.physics.add.overlap(magoRojo.sprite, bullets2, makeDamage, null, this);
        } else {
            player.mago = magoAzul;
            player.color = "azul";

            //Esto define las colisiones de los magos con las balas. La asignamos a variables para poder destruirlas
            //cuando muere un jugador
            colision1 = this.physics.add.overlap(magoAzul.sprite, bullets2, makeDamage, null, this);
            colision2 = this.physics.add.overlap(magoRojo.sprite, bullets1, makeDamage, null, this);
        }
    }

    update() {
            chatRun()
        
        if (numMsgs >= 0) {
            loadMessages(function (messages) {
                for (var i = numMsgs + 1; i < messages.length; i++) {
                    showOtherMessage(messages[i]);
                }

            });

        }
        if ($("#value-input").is(":focus")) {
            cursors.enabled = false;
            noChating = false;
        } else {
            cursors.enabled = true;
            noChating = true;
        }

        cambio = false;

        if (noChating) {
            if (cursors.ESC.isDown) {
                //this.scene.pause();


                // websocket.close();
                fondo.setVisible(true);
                salirMenu.setInteractive();
                salirMenu.setVisible(true);
                volver.setInteractive();
                volver.setVisible(true);

                fondo.setDepth(10);
                salirMenu.setDepth(12);
                volver.setDepth(12);
            }
            //Definimos las teclas que usa el jugador 1 y sus efectos
            if (player.mago.vida > 0) {
                //Movimiento del jugador
                if (cursors.A.isDown) {
                    player.mago.mAngle = 180;
                    velocity[0] = -player.mago.velocidad;
                    velocity[1] = 0;
                    animation = 'left';
                    cambio = true;
                } else if (cursors.D.isDown) {
                    player.mago.mAngle = 0;
                    velocity[0] = player.mago.velocidad;
                    velocity[1] = 0;
                    animation = 'right';
                    cambio = true;
                } else if (cursors.W.isDown) {
                    player.mago.mAngle = 270;
                    velocity[0] = 0;
                    velocity[1] = -player.mago.velocidad;
                    animation = 'up';
                    cambio = true;
                } else if (cursors.S.isDown) {
                    player.mago.mAngle = 90;
                    velocity[0] = 0;
                    velocity[1] = player.mago.velocidad;
                    animation = 'down';
                    cambio = true;
                } else if (velocity[0] != 0 || velocity[1] != 0) {
                    animation = undefined;
                    velocity[0] = 0;
                    velocity[1] = 0;
                    cambio = true;
                }
                //Ataque
                if (cursors.Q.isDown && player.mago.ataque) {
                    datosEnv = {
                        tipo: "Shoot",
                        color: player.color
                    }
                    scene.sound.play("fireball");
                    doSend(JSON.stringify(datosEnv));
                }
                //Escudo
                if (player.mago.escudo) {
                    player.mago.spriteEscudo.x = player.mago.sprite.x;
                    player.mago.spriteEscudo.y = player.mago.sprite.y;
                    player.mago.escudoTime--;
                    if (player.mago.escudoTime <= 0) {
                        player.mago.escudo = false;
                        player.mago.spriteEscudo.setActive(false);
                        player.mago.spriteEscudo.setVisible(false);
                    }
                }

                if (player.mago.enemy.escudo) {
                    player.mago.enemy.spriteEscudo.x = player.mago.enemy.sprite.x;
                    player.mago.enemy.spriteEscudo.y = player.mago.enemy.sprite.y;
                    player.mago.enemy.escudoTime--;
                    if (player.mago.enemy.escudoTime <= 0) {
                        player.mago.enemy.escudo = false;
                        player.mago.enemy.spriteEscudo.setActive(false);
                        player.mago.enemy.spriteEscudo.setVisible(false);
                    }
                }
            }
            if (cambio) {
                player.mago.moveSprite.setVelocity(velocity[0], velocity[1]);
                datosEnv = {
                    tipo: "Mago",
                    x: player.mago.moveSprite.x,
                    y: player.mago.moveSprite.y,
                    color: player.color,
                    mAngle: player.mago.mAngle,
                    velocityX: velocity[0],
                    velocityY: velocity[1],
                    anim: animation
                }
                doSend(JSON.stringify(datosEnv));
            }
        }

    }

    updateUI(color, colorN, vida) {
        scene.add.image(uiPos[colorN][0], uiPos[colorN][1], color + vida).setOrigin(0, 0);
    }

    updateCarga(color, alpha) {
        if (color == 0) {
            cargaR.alpha = alpha;
        } else if (color == 1) {
            cargaA.alpha = alpha;
        }
    }
}