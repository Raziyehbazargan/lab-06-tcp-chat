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
ee.on('\\nick', function(client, string){
  client.nickname = string.trim();
});

ee.on('\\all', function(client, string){
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: ` + string);
  });
});

ee.on('\\dm', function(client, string){
  var nickname, message;
  nickname = string.toString().split(' ').shift().trim();
  message = string.toString().split(' ').slice(1).join('');
  pool.forEach(c => {
    if(c.nickname == nickname){
      client.socket.write('message sent to: ' + c.nickname);
      c.socket.write(message);
    }
  })
});

ee.on('default', function(client, string){
  client.socket.write('not a command', string);
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

  //whenever user close a tab socket in terminal in will be call.
  socket.on('close', function(){
    pool.forEach(c => {
      if(c.id === client.id){
        let index = pool.indexOf(c);
        pool.splice(index,1);
      }
    });
  });

  socket.on('erorr', function(data){
    console.error('There is an error', data);
  });
});


server.listen(PORT, function(){
  console.log('server running on port', PORT);
});