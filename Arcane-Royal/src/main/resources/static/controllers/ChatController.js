//Carga de mensajes desde servidor
function loadMessages(callback) {
    $.ajax({
        url: '/messages'
    }).done(function (message) {
        callback(message);
    })
}

//Crear mensaje en el servidor
function createMessage(message, callback) {
    $.ajax({
        method: "POST",
        url: '/messages',
        data: JSON.stringify(message),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (message) {
        callback(message);
    })
}

function createConnection(connection, callback) {
    $.ajax({
        url: "/connections",
        method: "POST",
        processData: false,
        data: JSON.stringify(connection),
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (response) {
        callback(response);
    });

}

function updateConnection(connection) {
    $.ajax({
        method: 'PUT',
        url: '/connections/' + connection.id,
        data: JSON.stringify(connection),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (connection) {
        console.log("Updated item: " + JSON.stringify(connection))
    })
}

//Mostrar mensaje en el chat
function showOtherMessage(message) {
    if (message.text == "conectado") {
        showConnectMessage(message)
    } else if (message.text == "desconectado") {
        showDisconnectMessage(message)
    } else {
        numMsgs++;
        $('#myMessages').append(
            '<div class="message-other"><span>' + message.text +
            '</span> </div>')
    }

}

function showMyMessage(message) {
    numMsgs++;
    $('#myMessages').append(
        '<div class="message-mine"><span>' + message +
        '</span> </div>')
}

function showConnectMessage(message) {
    numMsgs++;
    $('#myMessages').append(
        '<div class="message-connection"><span>' + message.ip + ' ' + message.text +
        '</span> </div>')
}

function showDisconnectMessage(message) {
    numMsgs++;
    $('#myMessages').append(
        '<div class="message-disconnection"><span>' + message.ip + ' ' + message.text +
        '</span> </div>')
}