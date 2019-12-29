function onOpen(evt)
{
  console.log("CONNECTED");
  doSend("CONNECTION");
}

function onClose(evt)
{
  console.log("DISCONNECTED");
  doSend("DISCONNECTION");
}

function onMessage(evt)
{
  console.log(evt.data);
  console.log(orden);
  datosRecib=JSON.parse(evt.data);

  if(datosRecib.color===player.color){
    player.mago.sprite.setVelocityX(datosRecib.velocityX);
    player.mago.sprite.setVelocityY(datosRecib.velocityY);
    if(datosRecib.anim!=undefined){
      player.mago.sprite.anims.play(datosRecib.anim+'_'+datosRecib.color, true);
    }
  }else{
    player.mago.enemy.sprite.setVelocityX(datosRecib.velocityX);
    player.mago.enemy.sprite.setVelocityY(datosRecib.velocityY);
    if(datosRecib.anim!=undefined){
      player.mago.enemy.sprite.anims.play(datosRecib.anim+'_'+datosRecib.color, true);
    }
  }
  console.log("RECIBO")
  console.log(magoRojo.sprite.x+" "+magoRojo.sprite.y);
  console.log(magoAzul.sprite.x+" "+magoAzul.sprite.y);
}

function onMessageConnection(evt){
  var contador = evt.data;
  console.log(evt.data);
  if (evt.data!="1"){
    orden=1;
  }
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
