var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: [LoadScene, MenuScene]
}


var game = new Phaser.Game(config);