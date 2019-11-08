var config = {
    //type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


var img_background;
var image1;
var tween;
var iter = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('img_background', 'D://Desktop/programación/Redes ARCANE ROYAL/resources/Images/sky2.jpg');
    //this.load.image('image1', 'assets/sprites/mushroom2.png');
}

function create () // esto es una prueba
{
    img_background = this.add.tileSprite(1280/2, 720/2, 1200, 720, 'img_background');
    //image1 = this.add.tileSprite(400, 300, 250, 250, 'image1');

    tween = this.tweens.addCounter({
        from: 1,
        to: 2,
        duration: 5000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });
}

function update () //esto es una prueba
{
    img_background.tilePositionX = Math.cos(iter) * 1280;
    img_background.tilePositionY = Math.sin(iter) * 720;

    img_background.tileScaleX = tween.getValue();
    img_background.tileScaleY = tween.getValue();

    //image1.tilePositionX = Math.cos(-iter) * 400;
    //image1.tilePositionY = Math.sin(-iter) * 400;

    iter += 0.01;
}