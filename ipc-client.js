const path = require('path');
const fs = require('fs');
const {Client} = require('@crussell52/socket-ipc');

let outputCount = 0;
let publicPath = '';

// const client = new Client({socketFile: '\\\\.\\pipe\\testpipe'});
const client = new Client({socketFile: '/tmp/pipe.sock'});
client.on('connectError', () => console.log('no server'));
client.on('connect', () => {
  console.log('connected to server');
  client.send('ping', {version: 1});
});
client.on('disconnect', () => console.log('disconnected from server'));
client.on('reconnect', () => console.log('reconnected to server'));
client.on('message', (message, topic) => handleMessage(message, topic));
client.connect();



function handleMessage(message, topic) {
  console.log(`Received: [${topic}] ==>`, message);
  switch (topic) {
    case 'pong':
      publicPath = message.publicPath;
      break;
    case 'experiment-status':
      const status = message.status;
      switch (status) {
        case 'setup':
          const id = message.id;
          outputCount = message.outputCount;
          client.send('multimedia', {id});
          break;
        case 'init':
          break;
        case 'start':
          break;
        case 'stop':
          break;
        case 'clear':
          break;
      }
      break;
    case 'multimedia':
      // TODO handle multimedia
      // message = {audio: {}, image: {}};
      //            audio: {} ==> key: číslo výstupu
      //                      ==> value: relativní cesta z veřejné složky serveru
      for (let i = 0; i < outputCount; i++) {
        if (message.audio[i]) {
          const audioPath = path.join(publicPath, message.audio[i]);
          if (!fs.existsSync(audioPath)) {
            console.log(`Nebyl nalezen zvuk pro index: ${i} na cestě: '${audioPath}'!`);
            client.send('error', `Zvukový soubor: '${message.audio[i]}' nebyl nalezen!`);
          } else {
            console.log(`Byl nalezen zvuk pro index: ${i} na cestě: '${audioPath}'.`);
          }
        }
        if (message.image[i]) {
          const imagePath = path.join(publicPath, message.image[i]);
          if (!fs.existsSync(imagePath)) {
            console.log(`Nebyl nalezen obrázek pro index: ${i} na cestě: '${imagePath}'.`);
            client.send('error', `Zvukový soubor: '${message.image[i]}' nebyl nalezen!`);
          } else {
            console.log(`Byl nalezen obrázek pro index: ${i} na cestě: '${imagePath}'.`);
          }
        }
      }
      break;
  }
}

function shutdown(reason) {
  // Stop all processing and let node naturally exit.
  console.log('shutting down: ', reason);
  client.close();
}

process.on('SIGTERM', () => shutdown('sigterm'));
process.on('SIGINT', () => shutdown('sigint'));
