'use strict';

require('dotenv').config();
const PORT = process.env.PORT || 3000;
// const socketio = require('socket.io')(PORT);
const Queue = require('./lib/queue.js');
// const http = require('http');
// const server = http.createServer();
const io = require('socket.io')(PORT);
const orders = new Queue();
console.log('Listening on port:', PORT);

// Object to store received messages
const receivedMessages = {};

io.on('connection', handleClientConnection);

function handleClientConnection(socket) {
  console.log('New Connection:', socket.id);

  socket.on('driver-ready', () => {
    let nextOrder = orders.dequeue();
    if (nextOrder) {
      console.log('HUB: Sending Order to Driver', nextOrder);
      console.log('Orders in the queue:', orders.length());
      console.log('---------------');
      socket.emit('pickup', nextOrder);
    } else {
      console.log('HUB: No Orders in Queue');
      console.log('---------------');
    }
  });

  socket.on('ready-for-pickup', (payload) => {
    payload.status = 'queued for pickup';
    orders.enqueue(payload);

    console.log('HUB: Order Queued for Pickup', payload);
    console.log('Orders in the queue:', orders.length());
    console.log('---------------');
  });

  socket.on('package-in-transit', (payload) => {
    payload.status = 'in transit';
    console.log('HUB: Package in Transit', payload);
    console.log('---------------');
    io.emit('in-transit', payload);
  });

  socket.on('package-delivered', (payload) => {
    payload.status = 'delivered';
    console.log('HUB: Package Delivered', payload);
    console.log('---------------');
    io.emit('delivered', payload);
  });

  // Handle received event
  socket.on('received', (payload) => {
    const { clientId, eventName, messageId } = payload;
    if (receivedMessages[clientId] && receivedMessages[clientId][eventName]) {
      const index = receivedMessages[clientId][eventName].indexOf(messageId);
      if (index !== -1) {
        receivedMessages[clientId][eventName].splice(index, 1);
      }
    }
  });

  // Handle getAll event
  socket.on('getAll', (payload) => {
    const { clientId, eventName } = payload;
    if (orders[clientId] && orders[clientId][eventName]) {
      orders[clientId][eventName].forEach(message => {
        socket.emit(eventName, message);
      });
      // Store message ids for the client
      receivedMessages[clientId] = receivedMessages[clientId] || {};
      receivedMessages[clientId][eventName] = orders[clientId][eventName].map(message => message.orderId);
    }
  });

  // Handle socket disconnection
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
}

// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });
