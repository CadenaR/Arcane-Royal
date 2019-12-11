//=====Variables globales=====
// Variables para API

var numMsgs;
var noChating = true;
var user = null;

//Variables de los jugadores
var magoAzul;
var magoRojo;

//Variables de conexión
var newCon = false;

//Variables globales de la escena
var scene;
var globalScore = [0, 0];
var gameWin = 5; // rondas de victoria

//Variables de la UI
var uiPos = [];
var cargaR;
var cargaA;

//Variables de los disparos
var bullets1;
var bullets2;

//Variables de la generación de items
var delaySpawn = 3; //En segundos
var ratio;
var damage = 0.75;
var heal = 0.85;
var shield = 1;
var selected;
var full = false;

//Variables que regulan la velocidad de los personajes
var plVel = 200;
var framer = 14;

//Variables empleadas al generar y procesar tiles
var tiles = [];
var tileStr = [];
var occCount;

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
    constructor(color, colorN, sprite, vida, escudo, ataque, velocidad, mAngle, spriteEscudo) {
        this.color = color;
        this.colorN = colorN;
        this.sprite = sprite;
        this.vida = vida;
        this.escudo = escudo;
        this.ataque = ataque;
        this.velocidad = velocidad;
        this.mAngle = mAngle;
        this.spriteEscudo = spriteEscudo;
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

    var mapselect = Math.floor(Math.random() * (archivosMapas.length - 1) + 1); //no va?
    var arrayData = new Array();
    var archivoTXT = new XMLHttpRequest();
    archivoTXT.open("GET", archivosMapas[mapselect], false);
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
    switch (item.texture.key) {
        case "orbe1":
            if (mago.mago.vida < 3) {
                mago.mago.updateVida(1);
            }
            break;
        case "orbe2":
            if (!mago.mago.escudo) {
                mago.mago.spriteEscudo.setActive(true);
                mago.mago.spriteEscudo.setVisible(true);
                mago.mago.escudo = true;
                escudoTime = 300;
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
    if (!mago.mago.escudo) {
        mago.mago.updateVida(-1);
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
        if(globalScore[0]!=gameWin||globalScore[1]!=gameWin){
            this.scene.start(
               'gameScene',
                 2000
            );
        }
        if(globalScore[0]===gameWin){
            
        globalScore[0]=0;
        globalScore[1]=0;
            console.log("rojo gana");
            var message = {
                text: "Ha ganado: Mago Rojo",
            }
            showMyMessage("Ha ganado: Mago Rojo");
            createMessage(message, function (messageWithId) {

        });

        this.scene.start(
            'menuScene',
            3000
        );
        }
        
        if(globalScore[1]===gameWin){
            console.log("azul gana");
            
            globalScore[0]=0;
            globalScore[1]=0;
            var message = {
                text: "Ha ganado: Mago Azul",
            }
            showMyMessage("Ha ganado: Mago Azul");
            createMessage(message, function (messageWithId) {

            });
            this.scene.start(
                'menuScene',
                 3000
            );
        }
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
class GameScene extends Phaser.Scene{
    constructor() {
        super("gameScene");
        scene = this;
    }
    preload() {
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


        loadMessages(function (messages) {
            numMsgs = messages.length - 1;

        });


        //La variable orbes guarda un grupo con todos los objetos de los items, nos servirá mas adelante para las colisiones
        orbes = this.physics.add.group();

        //Para hacer la generación aleatoria de items, hemos usado un timer que genera cada cierto
        //tiempo un item a través de la función generar
        var timedEvent = this.time.addEvent({
            delay: delaySpawn * 1000, // 1seg = 1000ms
            callback: generar,
            //args: [],
            loop: true
        });

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
                //coja alguno
                checkTile.fill();
                checkFull();

                orbes.create(randX * 64 + 32, randY * 64 + 48, items[selected]);
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
                this.speed = 400;
                this.lifespan = 1000;

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
        magoRojo = new Mage('rojo', 0, this.physics.add.sprite(64, 360, "player1"), 3, false, false, plVel, 0, this.physics.add.sprite(64, 360, "escudo"));
        magoAzul = new Mage('azul', 1, this.physics.add.sprite(1216, 360, "player2"), 3, false, false, plVel, 180, this.physics.add.sprite(1216, 360, "escudo"));

        magoAzul.setEnemy(magoRojo);
        magoRojo.setEnemy(magoAzul);

        magoRojo.sprite.mago = magoRojo;
        magoAzul.sprite.mago = magoAzul;

        magoAzul.spriteEscudo.setActive(false);
        magoAzul.spriteEscudo.setVisible(false);
        magoRojo.spriteEscudo.setActive(false);
        magoRojo.spriteEscudo.setVisible(false);

        this.physics.add.collider(magoRojo.sprite, wall);
        this.physics.add.collider(magoAzul.sprite, wall);

        this.physics.world.bounds.top = 16;
        this.physics.world.bounds.bottom = 720;

        magoRojo.sprite.physicsBodyType = Phaser.Physics.ARCADE;
        magoRojo.sprite.body.setCollideWorldBounds(true);

        magoAzul.sprite.physicsBodyType = Phaser.Physics.ARCADE;
        magoAzul.sprite.body.setCollideWorldBounds(true);

        //Dibujo de la interfaz
        this.add.image(uiPos[0][0], uiPos[0][1], 'UIbase1').setOrigin(0, 0);
        this.add.image(uiPos[1][0], uiPos[1][1], 'UIbase2').setOrigin(0, 0);
        this.add.image(uiPos[0][0], uiPos[0][1], magoRojo.color + magoRojo.vida).setOrigin(0, 0);
        this.add.image(uiPos[1][0], uiPos[1][1], magoAzul.color + magoAzul.vida).setOrigin(0, 0);
        this.add.image(uiPos[4][0], uiPos[0][0], 'puntosUI').setOrigin(0, 0);
        cargaR = this.add.image(uiPos[2][0], uiPos[2][1], 'orbeUI');
        cargaA = this.add.image(uiPos[3][0], uiPos[3][1], 'orbeUI');

        this.add.text(uiPos[4][0]+16,uiPos[0][1]+5,globalScore[0].toString(),{fontSize: 18,color:"#F88", fontFamily: 'mifuente'});
        this.add.text(uiPos[4][0]+60,uiPos[0][1]+5,globalScore[1].toString(),{fontSize: 18,color:"#88F", fontFamily: 'mifuente'});

        cargaR.scale = 1.1;
        cargaA.scale = 1.1;
        cargaR.alpha = 0.4;
        cargaA.alpha = 0.4;

        //Después de definir los jugadores, pasamos a definir todas las animaciones de cada mago
        this.anims.create({
            key: "right_red",
            frames: this.anims.generateFrameNames("rojoLR", {
                start: 4,
                end: 7
            }),
            frameRate: framer,
            repeat: 0
        });

        this.anims.create({
            key: "left_red",
            frames: this.anims.generateFrameNames("rojoLR", {
                start: 0,
                end: 3
            }),
            frameRate: framer,
            repeat: 0
        });

        this.anims.create({
            key: "right_blue",
            frames: this.anims.generateFrameNames("azulLR", {
                start: 4,
                end: 7
            }),
            frameRate: framer,
            repeat: 0
        });

        this.anims.create({
            key: "left_blue",
            frames: this.anims.generateFrameNames("azulLR", {
                start: 0,
                end: 3
            }),
            frameRate: framer,
            repeat: 0
        });
        this.anims.create({
            key: "up_red",
            frames: this.anims.generateFrameNames("rojoUD", {
                start: 4,
                end: 7
            }),
            frameRate: framer,
            repeat: 0
        });

        this.anims.create({
            key: "down_red",
            frames: this.anims.generateFrameNames("rojoUD", {
                start: 0,
                end: 3
            }),
            frameRate: framer,
            repeat: 0
        });

        this.anims.create({
            key: "up_blue",
            frames: this.anims.generateFrameNames("azulUD", {
                start: 4,
                end: 7
            }),
            frameRate: framer,
            repeat: 0
        });

        this.anims.create({
            key: "down_blue",
            frames: this.anims.generateFrameNames("azulUD", {
                start: 0,
                end: 3
            }),
            frameRate: framer,
            repeat: 0
        });

        //Aquí añadimos todas las teclas del teclado que vamos a usar
        cursors = this.input.keyboard.addKeys('W,S,A,D,Q,E,I,J,K,L,U,O');

        //Esto define las colisiones de las balas con los muros
        this.physics.add.overlap(bullets1, wall, destroyBullet, null, this);
        this.physics.add.overlap(bullets2, wall, destroyBullet, null, this);

        //Esto define las colisiones de los magos con las balas. La asignamos a variables para poder destruirlas
        //cuando muere un jugador
        colision1 = this.physics.add.overlap(magoAzul.sprite, bullets1, makeDamage, null, this);
        colision2 = this.physics.add.overlap(magoRojo.sprite, bullets2, makeDamage, null, this);

        //Esto define la colisión de los jugadores con los items
        this.physics.add.overlap(magoAzul.sprite, orbes, pickup, null, this);
        this.physics.add.overlap(magoRojo.sprite, orbes, pickup, null, this);
    }

    update() {
        if (numMsgs >= 0) {
            loadMessages(function (messages) {
                for (var i = numMsgs + 1; i < messages.length; i++) {
                    showOtherMessage(messages[i]);
                }

            });

        }
        if ($(".value-input").is(":focus")) {
            noChating = false;
        } else {
            noChating = true;
        }

        if (noChating) {
            //Definimos las teclas que usa el jugador 1 y sus efectos
            if (magoRojo.vida > 0) {
                //Movimiento del jugador
                if (cursors.A.isDown) {
                    magoRojo.mAngle = 180;
                    magoRojo.sprite.setVelocityX(-magoRojo.velocidad);
                    magoRojo.sprite.anims.play('left_red', true);
                    magoRojo.sprite.setVelocityY(0);
                } else if (cursors.D.isDown) {
                    magoRojo.mAngle = 0;
                    magoRojo.sprite.setVelocityX(magoRojo.velocidad);
                    magoRojo.sprite.anims.play('right_red', true);
                    magoRojo.sprite.setVelocityY(0);
                } else if (cursors.W.isDown) {
                    magoRojo.mAngle = 270;
                    magoRojo.sprite.setVelocityY(-magoRojo.velocidad);
                    magoRojo.sprite.anims.play('up_red', true);
                    magoRojo.sprite.setVelocityX(0);
                } else if (cursors.S.isDown) {
                    magoRojo.mAngle = 90;
                    magoRojo.sprite.setVelocityY(magoRojo.velocidad);
                    magoRojo.sprite.anims.play('down_red', true);
                    magoRojo.sprite.setVelocityX(0);
                } else {
                    magoRojo.sprite.body.velocity.x = 0;
                    magoRojo.sprite.body.velocity.y = 0;
                }
                //Ataque
                if (cursors.Q.isDown && magoRojo.ataque) {
                    var bullet = bullets1.get();
                    if (bullet) {
                        bullet.fire(magoRojo);
                        magoRojo.updateCarga(false, 0.4);
                    }
                }
                //Escudo
                if (magoRojo.escudo) {
                    magoRojo.spriteEscudo.x = magoRojo.sprite.x;
                    magoRojo.spriteEscudo.y = magoRojo.sprite.y;
                    escudoTime--;
                    if (escudoTime <= 0) {
                        magoRojo.escudo = false;
                        magoRojo.spriteEscudo.setActive(false)
                        magoRojo.spriteEscudo.setVisible(false);
                    }
                }
            }
            //Definimos las teclas que usa el jugador 2 y sus efectos
            if (magoAzul.vida > 0) {
                if (cursors.J.isDown) {
                    magoAzul.mAngle = 180;
                    magoAzul.sprite.setVelocityX(-magoAzul.velocidad);
                    magoAzul.sprite.anims.play('left_blue', true);
                    magoAzul.sprite.setVelocityY(0);
                } else if (cursors.L.isDown) {
                    magoAzul.mAngle = 0;
                    magoAzul.sprite.setVelocityX(magoAzul.velocidad);
                    magoAzul.sprite.anims.play('right_blue', true);
                    magoAzul.sprite.setVelocityY(0);
                } else if (cursors.I.isDown) {
                    magoAzul.mAngle = 270;
                    magoAzul.sprite.setVelocityY(-magoAzul.velocidad);
                    magoAzul.sprite.anims.play('up_blue', true);
                    magoAzul.sprite.setVelocityX(0);
                } else if (cursors.K.isDown) {
                    magoAzul.mAngle = 90;
                    magoAzul.sprite.setVelocityY(magoAzul.velocidad);
                    magoAzul.sprite.anims.play('down_blue', true);
                    magoAzul.sprite.setVelocityX(0);
                } else {
                    magoAzul.sprite.body.velocity.x = 0;
                    magoAzul.sprite.body.velocity.y = 0;
                }
                if (cursors.O.isDown && magoAzul.ataque) {
                    var bullet = bullets2.get();

                    if (bullet) {
                        bullet.fire(magoAzul);
                        magoAzul.updateCarga(false, 0.4);
                    }
                }
                if (magoAzul.escudo) {
                    magoAzul.spriteEscudo.x = magoAzul.sprite.x;
                    magoAzul.spriteEscudo.y = magoAzul.sprite.y;
                    escudoTime--;
                    if (escudoTime <= 0) {
                        magoAzul.escudo = false;
                        magoAzul.spriteEscudo.setActive(false)
                        magoAzul.spriteEscudo.setVisible(false);
                    }
                }
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