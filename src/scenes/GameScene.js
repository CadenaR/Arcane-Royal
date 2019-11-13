//=====Variables globales=====
//Variables de los jugadores
var magoAzul;
var magoRojo;

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

//Referencias colisiones de los jugadores con las balas
var colision1;
var colision2;

//Variables de items
var items = [];
var orbes;
var escudo;
var escudoTime;
var cursors;

//=====Clases=====
class Mage {
    constructor(sprite, vida, escudo, ataque, velocidad, mAngle, spriteEscudo) {
        this.sprite = sprite;
        this.vida = vida;
        this.escudo = escudo;
        this.ataque = ataque;
        this.velocidad = velocidad;
        this.mAngle = mAngle;
        this.spriteEscudo = spriteEscudo;
    }
}

class Tile {
    constructor(type) {
        this.type = type;
        this.occup = false;
        //Solo queremos generar items en los tiles del tipo 0 así que marcamos los demás como ocupados
        if (type != 0) {
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
        return (this.y - 8) / 64;
    }
}

//=====Funciones=====
//Esta función se usa para calcular en que parte del mapa está el tile opuesto simetricamente en el eje x
//al tile en n
function oppX(n) {
    var x = n;
    var y = 0;
    while (x > 19) {
        x -= 20;
        y++;
    }
    return 19 - x + y * 20;
}

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
    if (n < 52+15) {
        full = false;
    }
}

function destroyBullet(bullet, wall) {
    bullet.destroy();
}

//Se define lo que ocurre al coger un objeto
function pickup(mago, item) {
    switch (item.texture.key) {
        case "orbe1":
            if (mago.mago.vida < 3) {
                mago.mago.vida++;
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
            mago.mago.ataque = true;
            break;
        default:
            break;
    };
    var resetTile = searchTile((item.x - 32) / 64, (item.y - 40) / 64);
    resetTile.free();

    item.destroy();


}

//Se define lo que ocurre cuando un disparo impacta al mago
function makeDamage(mago, bullet) {
    if (!mago.mago.escudo) {
        mago.mago.vida--;
    } else {
        mago.mago.escudo = false;
        mago.mago.spriteEscudo.setActive(false)
        mago.mago.spriteEscudo.setVisible(false);
    }
    bullet.kill();
    if (mago.mago.vida === 0) {
        mago.setActive(false);
        mago.setVisible(false);
        colision1.destroy();
        colision2.destroy();
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

//=====GameScene=====
class GameScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
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
            ratio = Math.random()+0.2;
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
                //si lo hay, la variable full pasa a ser true y no se generan más items hasta que no se
                //coja alguno
                checkTile.fill();
                checkFull();

                orbes.create(randX * 64 + 32, randY * 64 + 40, items[selected]);
            }
        }
        //Obtenido de https://labs.phaser.io/edit.html?src=src/input/gamepad/twin%20stick%20shooter.js
        //Creamos una clase Bullet usando Phaser.Class y en ella definimos los métodos que usamos para los disparos
        var Bullet = new Phaser.Class({
            Extends: Phaser.Physics.Arcade.Image,

            initialize:
                function Bullet(scene) {
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

        //Aquí generamos todos los tiles, los inicializamos a 0 que es el tipo de tile vacío
        for (var i = 0; i < 20 * 11; i++) {
            tiles[i] = new Tile(0);
        }

        //Como el mapa es simetrico en dos ejes, solo hemos tomado las posiciones de los tiles del primer cuarto
        //del mapa que son del tipo 1
        var wallTilesQ1 = [42, 43, 63, 46, 66, 86, 106, 9, 29, 49, 109];

        //El siguiente bucle define los tiles que son del tipo 1, es decir, los que no se pueden atravesar
        for (const coord of wallTilesQ1) {
            tiles[coord] = new Tile(1);
            tiles[219 - coord] = new Tile(1);
            tiles[oppX(coord)] = new Tile(1);
            tiles[219 - oppX(coord)] = new Tile(1);
        }

        //A continuación definimos los últimos tipo de tiles, los tiles 2 y 3 de las bases de los jugadores,
        //que al igual que el tipo 0, son transitables 
        for (var i = 80; i < 121; i += 20) {
            tiles[i] = new Tile(2);
            tiles[i + 1] = new Tile(2);
            tiles[219 - i] = new Tile(3);
            tiles[218 - i] = new Tile(3);
        }

        var wall = this.physics.add.staticGroup();
        //Procedemos a asignar a cada tile su posición y a dibujarlos
        for (var i = 0; i < 20 * 11; i++) {
            tiles[i].setPos(i % 20 * 64 + 32, 8 + Math.floor(i / 20) * 64 + 32);          
            if (tiles[i].getType() === 1) {
                wall.create(tiles[i].getX(), tiles[i].getY(), tileStr[tiles[i].getType()]);
            }
            else {
                this.physics.add.sprite(tiles[i].getX(), tiles[i].getY(), tileStr[tiles[i].getType()]);
            }
            tiles[i].setPos(i % 20 * 64, 8 + Math.floor(i / 20) * 64)

        }

        //A continuación vamos a definir los jugadores, añadirles los sprites y todos los temas de las físicas y colisiones con los muros
        magoRojo = new Mage(this.physics.add.sprite(64, 360, "player1"), 3, false, false, plVel, 0, this.physics.add.sprite(64, 360, "escudo"));
        magoAzul = new Mage(this.physics.add.sprite(1216, 360, "player2"), 3, false, false, plVel, 180, this.physics.add.sprite(1216, 360, "escudo"));

        magoRojo.sprite.mago = magoRojo;
        magoAzul.sprite.mago = magoAzul;

        magoAzul.spriteEscudo.setActive(false);
        magoAzul.spriteEscudo.setVisible(false);
        magoRojo.spriteEscudo.setActive(false);
        magoRojo.spriteEscudo.setVisible(false);

        this.physics.add.collider(magoRojo.sprite, wall);
        this.physics.add.collider(magoAzul.sprite, wall);

        this.physics.world.bounds.top = 8;
        this.physics.world.bounds.bottom = 712;

        magoRojo.sprite.physicsBodyType = Phaser.Physics.ARCADE;
        magoRojo.sprite.body.setCollideWorldBounds(true);

        magoAzul.sprite.physicsBodyType = Phaser.Physics.ARCADE;
        magoAzul.sprite.body.setCollideWorldBounds(true);
        
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
        //Definimos las teclas que usa el jugador 1 y sus efectos
        if (magoRojo.vida > 0) {
            //Movimiento del jugador
            if (cursors.A.isDown) {
                magoRojo.mAngle = 180;
                magoRojo.sprite.setVelocityX(-magoRojo.velocidad);
                magoRojo.sprite.anims.play('left_red', true);
                magoRojo.sprite.setVelocityY(0);
            }
            else if (cursors.D.isDown) {
                magoRojo.mAngle = 0;
                magoRojo.sprite.setVelocityX(magoRojo.velocidad);
                magoRojo.sprite.anims.play('right_red', true);
                magoRojo.sprite.setVelocityY(0);
            }
            else if (cursors.W.isDown) {
                magoRojo.mAngle = 270;
                magoRojo.sprite.setVelocityY(-magoRojo.velocidad);
                magoRojo.sprite.anims.play('up_red', true);
                magoRojo.sprite.setVelocityX(0);
            }
            else if (cursors.S.isDown) {
                magoRojo.mAngle = 90;
                magoRojo.sprite.setVelocityY(magoRojo.velocidad);
                magoRojo.sprite.anims.play('down_red', true);
                magoRojo.sprite.setVelocityX(0);
            }
            else {
                magoRojo.sprite.body.velocity.x = 0;
                magoRojo.sprite.body.velocity.y = 0;
            }
            //Ataque
            if (cursors.Q.isDown && magoRojo.ataque) {
                var bullet = bullets1.get();
                if (bullet) {
                    bullet.fire(magoRojo);
                    magoRojo.ataque = false;
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
            }
            else if (cursors.L.isDown) {
                magoAzul.mAngle = 0;
                magoAzul.sprite.setVelocityX(magoAzul.velocidad);
                magoAzul.sprite.anims.play('right_blue', true);
                magoAzul.sprite.setVelocityY(0);
            }
            else if (cursors.I.isDown) {
                magoAzul.mAngle = 270;
                magoAzul.sprite.setVelocityY(-magoAzul.velocidad);
                magoAzul.sprite.anims.play('up_blue', true);
                magoAzul.sprite.setVelocityX(0);
            }
            else if (cursors.K.isDown) {
                magoAzul.mAngle = 90;
                magoAzul.sprite.setVelocityY(magoAzul.velocidad);
                magoAzul.sprite.anims.play('down_blue', true);
                magoAzul.sprite.setVelocityX(0);
            }
            else {
                magoAzul.sprite.body.velocity.x = 0;
                magoAzul.sprite.body.velocity.y = 0;
            }
            if (cursors.O.isDown && magoAzul.ataque) {
                var bullet = bullets2.get();

                if (bullet) {
                    bullet.fire(magoAzul);
                    magoAzul.ataque = false;
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