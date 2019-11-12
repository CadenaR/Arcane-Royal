/*function Mago(x,y,sprite){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.speedx = 0;
    this.speedy = 0;
}
*/
var cursors;
var player1;
var player2;
var bullets1;
var bullets2;
var p1Angle;
var lastFired1 = 0;
var lastFired2 = 0;
var tiles = [];
var tileStr = [];
var items = [];
var full = false;
var plVel = 200;
var framer = 14;
var magoAzul;
var magoRojo;

class Item {
    constructor(statBuff, duration, sprite) {
        this.stat = statBuff;
        this.duration = duration;
        this.sprite = sprite;
    }
}

class Mage {
    constructor(sprite, vida, escudo, ataque, velocidad, mAngle) {
        this.sprite = sprite;
        this.vida = vida;
        this.escudo = escudo;
        this.ataque = ataque;
        this.velocidad = velocidad;
        this.mAngle = mAngle;
    }
}

class Tile {
    constructor(type) {
        this.type = type;
        this.occup = false;
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
    getX2() {
        return this.x / 64;
    }
    getY2() {
        return (this.y - 8) / 64;
    }
}

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

function checkFull() {
    full = true;
    var n = 0;
    for (const t of tiles) {
        if (t.getOccup() == true) {
            n++;
        }
    }
    if (n < 67) {
        full = false;
    }
}

/*
El primer numero es para identificar cada item (en el array de más abajo coincide con la posición del array en el 
que se almacenan), los otros son atributos. El segundo numero es el numero de puntos que suben cierta estadística 
El tercer número es la duración del efecto,
si esta es -1, la duración es permanente. El último atributo referencia la imagen asociada a cada poción.
Todos estos datos están en el array items más abajo en el mismo
orden que aquí.*/

items[0] = new Item(20, -1, 'orbe1'); //vida
items[1] = new Item(10, 5, 'orbe2'); //escudo
items[2] = new Item(15, -1, 'orbe3'); //daño

//tileStr contiene los strings que referencian la imagen para cada tile, para usarla posteriormente

tileStr[0] = 'ground';
tileStr[1] = 'wall';
tileStr[2] = 'baseroja';
tileStr[3] = 'baseazul';
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

        // Obtenido de https://labs.phaser.io/edit.html?src=src/input/gamepad/twin%20stick%20shooter.js
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
                this.setActive(false);
                this.setVisible(false);
                this.body.stop();
            }

        });

        for (var i = 0; i < 20 * 11; i++) {
            tiles[i] = new Tile(0);
        }

        bullets1 = this.physics.add.group({
            classType: Bullet,
            maxSize: 30,
            runChildUpdate: true
        });

        //Como el mapa es simetrico en dos ejes, solo hemos tomado las posiciones de los tiles del primer cuarto del mapa
        var wallTilesQ1 = [42, 43, 63, 46, 66, 86, 106, 9, 29, 49, 109];

        //El siguiente bucle define los tiles que son del tipo 1, es decir, los que no se pueden atravesar
        for (const coord of wallTilesQ1) {
            tiles[coord] = new Tile(1);
            tiles[219 - coord] = new Tile(1);
            tiles[oppX(coord)] = new Tile(1);
            tiles[219 - oppX(coord)] = new Tile(1);
        }

        for (var i = 80; i < 121; i += 20) {

            tiles[i] = new Tile(2);
            tiles[i + 1] = new Tile(2);
            tiles[219 - i] = new Tile(3);
            tiles[218 - i] = new Tile(3);
        }
        //Procedemos a asignar a cada tile su posición y a dibujarlos
        //var  group = this.add.group();
        // group.enableBody = true;

        var framer = 12;
        // group.enableBody = true;

        var array = [];
        var wall = this.physics.add.staticGroup();

        //this.physics.startSystem(Phaser.Physics.ARCADE);
        for (var i = 0; i < 20 * 11; i++) {
            tiles[i].setPos(i % 20 * 64 + 32, 8 + Math.floor(i / 20) * 64 + 32);

            //
            if (tiles[i].getType() === 1) {
                wall.create(tiles[i].getX(), tiles[i].getY(), tileStr[tiles[i].getType()]);
            }
            //array[i].body.inmovable = true;
            else {
                this.physics.add.sprite(tiles[i].getX(), tiles[i].getY(), tileStr[tiles[i].getType()]);
            }
            tiles[i].setPos(i % 20 * 64, 8 + Math.floor(i / 20) * 64)

        }


        var player1 = this.physics.add.sprite(64, 360, "player1");
        var player2 = this.physics.add.sprite(1216, 360, "player2");

        magoRojo = new Mage(player1, 3, false, false, plVel, 0);
        magoAzul = new Mage(player2, 3, false, false, plVel, 180);

        this.physics.add.collider(magoRojo.sprite, wall);
        this.physics.add.collider(magoAzul.sprite, wall);

        this.physics.world.bounds.top = 8;
        this.physics.world.bounds.bottom = 712;

        magoRojo.sprite.physicsBodyType = Phaser.Physics.ARCADE;
        magoRojo.sprite.body.setCollideWorldBounds(true);

        magoAzul.sprite.physicsBodyType = Phaser.Physics.ARCADE;
        magoAzul.sprite.body.setCollideWorldBounds(true);

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

        cursors = this.input.keyboard.addKeys('W,S,A,D,Q,E,I,J,K,L,U,O');

        this.physics.add.overlap(bullets1, wall, destroyBullet, null, this);

    }

    update(time) {

        //La variable check es la que define si se va a pintar un item o no, si cambiamos el segundo numero que la multiplica,
        //cambiamos la probabilidad de que se dibuje un item, si es 1000 hay una milesima de posibilidades cada vez que se ejecuta update
        //el rango 200 - 300 creo que está bien, más arriba de eso parece que no sale nunca y más abajo sale demasiado
        var check = Math.random() * 3 * 280;

        var ratio = Math.random();
        var selected;
        var damage = 0.5;
        var heal = 0.7;
        var shield = 1;

        //Si la variable check cumple la condición y el escenario no está lleno, pasamos a dibujar el item en una localización aleatoria
        //sin ocupar casillas que ya están ocupadas o que no son transitables
        if (check < 3&&!full){
            do{
                var randX = Math.floor(Math.random()*20);
                var randY = Math.floor(Math.random()*11);
                var checkTile = searchTile(randX, randY);
            }while (!full&&checkTile.getOccup());

            checkTile.fill();
            checkFull();

            if(ratio<=damage){
                selected = 2; //50% item de daño
            }else if (ratio>=heal){
                selected = 1; //30% item de escudo
            }else if (ratio>damage&&ratio<heal){
                selected = 0; //20% item de vida
            }

            this.add.sprite(randX*64+32, randY*64+40, items[selected].sprite);
        }   


        if (cursors.A.isDown) {
            magoRojo.mAngle = 180;
            magoRojo.sprite.setVelocityX(-magoRojo.velocidad);
            magoRojo.sprite.anims.play('left_red', true);
            magoRojo.sprite.setVelocityY(0);
        } else if (cursors.D.isDown) {
            magoRojo.mAngle = 0;
            magoRojo.sprite.setVelocityX(magoRojo.velocidad);
            magoRojo.sprite.setVelocityY(0);
            magoRojo.sprite.anims.play('right_red', true);
        } else if (cursors.W.isDown) {
            magoRojo.mAngle = 270;
            magoRojo.sprite.setVelocityY(-magoRojo.velocidad);
            magoRojo.sprite.setVelocityX(0);

            magoRojo.sprite.anims.play('up_red', true);


        } else if (cursors.S.isDown) {
            magoRojo.mAngle = 90;
            magoRojo.sprite.setVelocityY(magoRojo.velocidad);
            magoRojo.sprite.setVelocityX(0);

            magoRojo.sprite.anims.play('down_red', true);


        } else {
            magoRojo.sprite.body.velocity.x = 0;
            magoRojo.sprite.body.velocity.y = 0;
        }

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
            magoAzul.sprite.setVelocityX(0);

            magoAzul.sprite.anims.play('up_blue', true);

        } else if (cursors.K.isDown) {
            magoAzul.mAngle = 90;
            magoAzul.sprite.setVelocityY(magoAzul.velocidad);
            magoAzul.sprite.setVelocityX(0);

            magoAzul.sprite.anims.play('down_blue', true);

        } else {
            magoAzul.sprite.body.velocity.x = 0;
            magoAzul.sprite.body.velocity.y = 0;
        }

        // https://labs.phaser.io/edit.html?src=src/input/gamepad/twin%20stick%20shooter.js
        if (cursors.Q.isDown && time > lastFired1) {
            var bullet = bullets1.get();

            if (bullet) {
                bullet.fire(magoRojo);

                lastFired1 = time + 200;
            }
        }
        if (cursors.O.isDown && time > lastFired1) {
            var bullet = bullets1.get();

            if (bullet) {
                bullet.fire(magoAzul);

                lastFired1 = time + 200;
            }
        }
    }
}

function destroyBullet(bullet, wall) {
    bullet.kill();
}