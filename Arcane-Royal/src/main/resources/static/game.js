var config = {
    width: 1280,
    height: 720,
    backgroundColor: 0x000000,
    dom: {
        createContainer: true
    },
    audio: {
      disableWebAudio: true
    },
   // scale : {
    //    mode : Phaser.Scale.RESIZE,
     //   autoCenter : Phaser.Scale.CENTER_BOTH
   //_ },
    physics: {
        default: 'arcade',
        arcade: {
          gravity: false
        },
        //fps: 30
    },    
    scene: [LoadScene,GameScene,MenuScene,ControlScene,CreditScene,LoginScene]
}

var game = new Phaser.Game(config);