
var tiles = [];
var tileStr = [];
var items = [];
var full = false;

class Item {
    constructor (statBuff, duration, sprite){
        this.stat = statBuff;
        this.duration = duration;
        this.sprite = sprite;
    }
}

class Tile {
    constructor (type){
        this.type=type;
        this.occup=false;
        if (type!=0){
            this.occup=true;
        }
        this.x=-1;
        this.y=-1;        
    }

    free (){
        this.occup=false;
        full=false;
    }
    fill (){
        this.occup=true;
    }
    getType(){
        return this.type;
    }
    getOccup(){
        return this.occup;
    }
    setPos(x, y){
        this.x=x;
        this.y=y;
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    getX2(){
        return this.x/64;
    }    
    getY2(){
        return (this.y-8)/64;
    }
}

function oppX (n){
    var x=n;
    var y=0;
    while (x>19){
        x-=20;
        y++;
    }

    return 19-x+y*20;
}

function searchTile (x, y){
    for (const t of tiles){
        if (t.getX2()==x&&t.getY2()==y){
            return t;
        }
    }
}

function checkFull(){
    full=true;
    var n = 0;
    for (const t of tiles){
        if (t.getOccup()==true){
            n++;
        }
    }
    if(n < 67){
        full=false;
    }
}

/*

El primer numero es para identificar cada item (en el array de más abajo coincide con la posición del array en el 
que se almacenan), los otros son atributos. El segundo numero es el numero de puntos que suben cierta estadística 
El tercer número es la duración del efecto,
si esta es -1, la duración es permanente. El último atributo referencia la imagen asociada a cada poción.
Todos estos datos están en el array items más abajo en el mismo
orden que aquí.*/

items[0] = new Item (20, -1, 'orbe1'); //vida
items[1]  = new Item (10, 5, 'orbe2'); //escudo
items[2]  = new Item (15, -1, 'orbe3'); //daño

//tileStr contiene los strings que referencian la imagen para cada tile, para usarla posteriormente
tileStr[0]='ground';
tileStr[1]='wall';
tileStr[2]='baseroja';
tileStr[3]='baseazul';

var wall = 'https://i.ibb.co/v18VJCm/barril2.png';
var ground ='https://i.ibb.co/cJF4nnc/tile2.png';
var baseazul = 'https://i.ibb.co/px6mdsF/baseazul.png';
var baseroja = 'https://i.ibb.co/Srq3Vqc/baseroja.png';
var orbe1 = 'https://i.ibb.co/4mHFYFJ/orbe1.png';
var orbe2 = 'https://i.ibb.co/RDLvB5P/orbe2.png';
var orbe3 = 'https://i.ibb.co/WPQKMjJ/orbe3.png';

var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('wall',wall);
    this.load.image('ground', ground);
    this.load.image('orbe1', orbe1);
    this.load.image('orbe2', orbe2);
    this.load.image('orbe3', orbe3);
    this.load.image('baseroja', baseroja);
    this.load.image('baseazul', baseazul);
}

function create ()
{    
    for (i=0;i<20*11;i++){
        tiles[i]=new Tile(0);        
    }
    
    //Como el mapa es simetrico en dos ejes, solo hemos tomado las posiciones de los tiles del primer cuarto del mapa
    wallTilesQ1 = [42,43,63,46,66,86,106,9,29,49,109];

    //El siguiente bucle define los tiles que son del tipo 1, es decir, los que no se pueden atravesar
    for (const coord of wallTilesQ1) {
        tiles[coord]=new Tile(1);
        tiles[219-coord]=new Tile(1);
        tiles[oppX(coord)]=new Tile(1);
        tiles[219-oppX(coord)]=new Tile(1);
    }
    
    for(i=80;i<121;i+=20){
        
        tiles[i]=new Tile(2);
        tiles[i+1]=new Tile(2);
        tiles[219-i]=new Tile(3);
        tiles[218-i]=new Tile(3);
    }
    //Procedemos a asignar a cada tile su posición y a dibujarlos
    for (i=0;i<20*11;i++){
        tiles[i].setPos(i%20*64,8+Math.floor(i/20)*64)
        this.add.image(tiles[i].getX(),tiles[i].getY(),tileStr[tiles[i].getType()]).setOrigin(0, 0);       
    }
}

function update ()
{
    //La variable check es la que define si se va a pintar un item o no, si cambiamos el segundo numero que la multiplica,
    //cambiamos la probabilidad de que se dibuje un item, si es 1000 hay una milesima de posibilidades cada vez que se ejecuta update
    //el rango 200 - 300 creo que está bien, más arriba de eso parece que no sale nunca y más abajo sale demasiado
    var check = Math.random()*3*280;

    //Si la variable check cumple la condición y el escenario no está lleno, pasamos a dibujar el item en una localización aleatoria
    //sin ocupar casillas que ya están ocupadas o que no son transitables
    if (check<3&&!full){
        cond = true;

        do{
            var randX = Math.floor(Math.random()*20);
            var randY = Math.floor(Math.random()*11);
            checkTile = searchTile(randX, randY);
        }while (!full&&checkTile.getOccup());

        checkTile.fill();
        checkFull();
        this.add.image(randX*64+32, randY*64+40, items[Math.floor(check)].sprite);
    }   
}



