var config = {
    width: 1280,
    height: 720,
    backgroundColor: 0x000000,
   // scale : {
    //    mode : Phaser.Scale.RESIZE,
     //   autoCenter : Phaser.Scale.CENTER_BOTH
   //_ },
    physics: {
        default: 'arcade',
        arcade: {
          gravity: false
        }
    },
    scene: [LoadScene,GameScene,MenuScene]
}

var game = new Phaser.Game(config);