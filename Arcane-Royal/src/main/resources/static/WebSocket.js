function onOpen(evt)
{
  console.log("CONNECTED");
  doSend("CONNECTION");
}

function onClose(evt)
{  
  console.log("DISCONNECTED");
}

function onMessage(evt)
{
  datosRecib=JSON.parse(evt.data);
  if (datosRecib.tipo === "Mago") {
    if(datosRecib.color===player.color){
      player.mago.mAngle=datosRecib.mAngle;
      player.mago.sprite.setVelocity(datosRecib.velocityX, datosRecib.velocityY);      
      if(datosRecib.anim!=undefined){
        player.mago.sprite.anims.play(datosRecib.anim+'_'+datosRecib.color, true);
      }      
    }
    else {
      player.mago.enemy.mAngle=datosRecib.mAngle;     
      player.mago.enemy.sprite.setPosition(datosRecib.x,datosRecib.y);
      if(datosRecib.anim!=undefined){
        player.mago.enemy.sprite.anims.play(datosRecib.anim+'_'+datosRecib.color, true);
      }
    }  
  }
  else if (datosRecib.tipo === "Item"){
    checkTile = searchTile (datosRecib.x, datosRecib.y);
    checkTile.fill();
    checkFull();
    orbes.create(datosRecib.x * 64 + 32, datosRecib.y * 64 + 48, items[datosRecib.itemType]);
  }
   
  else if (datosRecib.tipo === "Shoot"){
    if (player.mago.color == datosRecib.color){
      var bullet = bullets1.get();
      if (bullet) {
          bullet.fire(player.mago);
          player.mago.updateCarga(false, 0.4);
      }
    } 
    else { 
      var bullet = bullets2.get();
      if (bullet) {
          bullet.fire(player.enemy.mago);
          player.enemy.mago.updateCarga(false, 0.4);
      }
    }
  }  
}


function onMessageConnection(evt){
  var contador = evt.data;
  if (evt.data!="1"){
    orden=1;
  }  
  websocket.onmessage = function(evt) { onMessageMap(evt) };
  if(orden===0){
    doSend("RONDA");   
  }else{
    doSend("MAPA");
  }
}

function onMessageMap(evt){
  mapselect = parseInt(evt.data);
  console.log(mapselect);
  websocket.onmessage = function(evt) { onMessage(evt) };
}

function onError(evt)
{  
  alert('ERROR');
}

function doSend(message)
{  
  websocket.send(message);
}
