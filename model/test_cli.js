const socket = require('net');
const client = socket.connect({ path: '/tmp/out' }, () => {;
  console.log('connected to server!');
});
client.on('data', (data) => {
  console.log(data.toString());
});
client.on('end', () => {
  console.log('disconnected from server');
});
