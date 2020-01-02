const {Client} = require('@crussell52/socket-ipc');

const client = new Client({socketFile: '\\\\.\\pipe\\testpipe'});
client.on('connectError', () => console.log('no server'));
client.on('connect', () => console.log('connected to server'));
client.on('disconnect', () => console.log('disconnected from server'));
client.on('reconnect', () => console.log('reconnected to server'));
client.on('message', (message, topic) => console.log(`Heard: [${topic}]`, message));
client.connect();


function shutdown(reason) {
  // Stop all processing and let node naturally exit.
  console.log('shutting down: ', reason);
  client.close();
}

process.on('SIGTERM', () => shutdown('sigterm'));
process.on('SIGINT', () => shutdown('sigint'));
