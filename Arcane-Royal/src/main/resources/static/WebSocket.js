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
  if (datosRecib.tipo == "Mago") {
    if(datosRecib.color===player.color){
      //enemCambio=false;
      //datosRecib.sprite.mago=player.mago;
      //player.mago.sprite=datosRecib.sprite;
      
      player.mago.mAngle=datosRecib.mAngle;
      player.mago.sprite.setVelocity(datosRecib.velocityX, datosRecib.velocityY);      
      //player.mago.sprite.setPosition(datosRecib.x,datosRecib.y);
      if(datosRecib.anim!=undefined){
        player.mago.sprite.anims.play(datosRecib.anim+'_'+datosRecib.color, true);
      }      
    }
    else {
      //enemCambio=true;
      //datosRecib.sprite.mago=player.mago.enemy;
      //player.mago.enemy.sprite=datosRecib.sprite;
      
      player.mago.enemy.mAngle=datosRecib.mAngle;
      //player.mago.enemy.sprite.setVelocity(datosRecib.velocityX, datosRecib.velocityY);    
      player.mago.enemy.sprite.setPosition(datosRecib.x,datosRecib.y);
      if(datosRecib.anim!=undefined){
        player.mago.enemy.sprite.anims.play(datosRecib.anim+'_'+datosRecib.color, true);
      }
    }  
  }     
  else if (datosRecib.tipo == "Bullet"){

  }
  else if (datosRecib.tipo == "Item"){
    checkTile = searchTile (datosRecib.x, datosRecib.y);
    checkTile.fill();
    checkFull();
    orbes.create(datosRecib.x * 64 + 32, datosRecib.y * 64 + 48, items[datosRecib.itemType]);
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
