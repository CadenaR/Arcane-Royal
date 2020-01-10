function onOpen(evt) {
  console.log("CONNECTED");
  doSend("CONNECTION");
  
}

function onClose(evt) {
  console.log("DISCONNECTED");
  connected = false;
}

function onMessage(evt) {
  datosRecib = JSON.parse(evt.data);
  console.log(datosRecib);
  if (datosRecib.tipo === "Mago") {
    if (datosRecib.color === player.color) {
      pastPos = [datosRecib.x, datosRecib.y];
      player.mago.mAngle = datosRecib.mAngle;
      player.mago.sprite.setPosition(datosRecib.x, datosRecib.y);
      if (datosRecib.anim != undefined) {
        player.mago.sprite.anims.play(datosRecib.anim + '_' + datosRecib.color, true);
      }
    } else {
      player.mago.enemy.mAngle = datosRecib.mAngle;
      player.mago.enemy.sprite.setPosition(datosRecib.x, datosRecib.y);
      if (datosRecib.anim != undefined) {
        player.mago.enemy.sprite.anims.play(datosRecib.anim + '_' + datosRecib.color, true);
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
  }

  else if (datosRecib.tipo === "Item") {
    checkTile = searchTile(datosRecib.x, datosRecib.y);
    checkTile.fill();
    checkFull();
    orbes.create(datosRecib.x * 64 + 32, datosRecib.y * 64 + 48, items[datosRecib.itemType]);
  }
  
  else if (datosRecib.tipo === "Shoot") {
    if (player.mago.color == datosRecib.color) {
      var bullet = bullets1.get();
      if (bullet) {
        bullet.fire(player.mago);
        player.mago.updateCarga(false, 0.4);
      }
    } else {
      var bullet = bullets2.get();
      if (bullet) {
        bullet.fire(player.mago.enemy);
        player.mago.enemy.updateCarga(false, 0.4);
      }
    }
  }
  //Este else recibe el mapa
  else if (datosRecib.tipo === "Map") {
    mapselect = datosRecib.mapas;
    console.log(mapselect);
  }

  else if (datosRecib.tipo === "Jugar") {
    this.scene.stop("loginScene");   
    this.scene.start("gameScene");
  }

  else if (datosRecib.tipo === "PlayerDisconnected") {
    if (!disc){
        alert("Se ha desconectado un jugador. Se te redirigirá al menú.");
        this.scene.stop("loginScene");   
        this.scene.start("menuScene");
    }
  }
}


function onMessageConnection(evt) {
  var contador = parseInt(evt.data);
  if (contador % 2 != "1") {
    orden = 1;
  }
  websocket.onmessage = function (evt) {
    onMessage(evt)
  };  
  getMaps();
  console.log(orden);
}

function onError(evt) {
  alert('ERROR');
}

function doSend(message) {
  websocket.send(message);
}