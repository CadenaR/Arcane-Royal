function onOpen(evt) {
  console.log("CONNECTED");
  doSend("CONNECTION");
}

function onClose(evt) {
  console.log("DISCONNECTED");
}

function onMessage(evt) {
  console.log(evt.data);
  console.log(orden);
  datosRecib = JSON.parse(evt.data);

  if (datosRecib.color === player.color) {
    //datosRecib.sprite.mago=player.mago;
    //player.mago.sprite=datosRecib.sprite;

    player.mago.mAngle = datosRecib.mAngle;
    player.mago.sprite.setVelocity(datosRecib.velocityX, datosRecib.velocityY);
    player.mago.sprite.setPosition(datosRecib.x, datosRecib.y);
    if (datosRecib.anim != undefined) {
      player.mago.sprite.anims.play(datosRecib.anim + '_' + datosRecib.color, true);
    }

  } else {
    //datosRecib.sprite.mago=player.mago.enemy;
    //player.mago.enemy.sprite=datosRecib.sprite;

    player.mago.enemy.mAngle = datosRecib.mAngle;
    player.mago.enemy.sprite.setVelocity(datosRecib.velocityX, datosRecib.velocityY);
    player.mago.enemy.sprite.setPosition(datosRecib.x, datosRecib.y);
    if (datosRecib.anim != undefined) {
      player.mago.enemy.sprite.anims.play(datosRecib.anim + '_' + datosRecib.color, true);
    }
  }
  console.log("RECIBO")
  console.log(magoRojo.sprite.x + " " + magoRojo.sprite.y);
  console.log(magoAzul.sprite.x + " " + magoAzul.sprite.y);

}


function onMessageConnection(evt) {
  var contador = evt.data;
  if (evt.data != "1") {
    orden = 1;
  }
  websocket.onmessage = function (evt) {
    onMessageMap(evt)
  };
  if (orden === 0) {
    doSend("RONDA");
  } else {
    doSend("MAPA");
  }
}

function onMessageMap(evt) {
  mapselect = parseInt(evt.data);
  console.log(mapselect);
  websocket.onmessage = function (evt) {
    onMessage(evt)
  };
}

function onError(evt) {
  alert('ERROR');
}

function doSend(message) {
  websocket.send(message);
}

function onMapCheck(evt) {

  mapselect = parseInt(evt.data);

  websocket.onmessage = function (evt) {
    onMessage(evt)
  };
};