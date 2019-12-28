function onOpen(evt)
{
  console.log("hola");
}

function onClose(evt)
{
  //writeToScreen("DISCONNECTED");
}

function onMessage(evt)
{
  //writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
  websocket.close();
}

function onError(evt)
{
  //writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message)
{
  //writeToScreen("SENT: " + message);
  websocket.send(message);
}