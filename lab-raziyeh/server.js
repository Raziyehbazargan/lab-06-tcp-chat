'use strict';

//node modules
const net = require('net');
const EE = require('events');

// npm modules
// app modules
const Client = require('./model/client.js');

// env vars
const PORT = process.env.PORT || 3000;

// module constats
const pool = [];
const server = net.createServer();
const ee = new EE();

//EventEmitters
ee.on('\\nick', function(client, string1){
  client.nickname = string1.trim();
});

ee.on('\\all', function(client, string){
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: ` + string);
  });
});

ee.on('\\dm', function(client, string){
  
});

ee.on('default', function(client, string){
  client.socket.write('not a command');
});

/// module logic
server.on('connection', function(socket){
  var client = new Client(socket);
  pool.push(client);
  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();

    if (command.startsWith('\\')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());

  });
});


server.listen(PORT, function(){
  console.log('server running on port', PORT);
});