'use strict';

const socketio = require('socket.io');
const http = require('http');
const server = http.createServer();
const io = socketio(server);
// const eventPool = require('./eventPool');

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    // Listen for pickup events
    socket.on('pickup', (payload) => {
        console.log(`Received pickup event from vendor: ${payload.orderId}`);
        socket.broadcast.emit('pickup', payload);
    });

    // Listen for in-transit events
    socket.on('in-transit', (payload) => {
        console.log(`Received in-transit event from driver: ${payload.orderId}`);
        io.to(payload.store).emit('in-transit', payload);
    });

    // Listen for delivered events
    socket.on('delivered', (payload) => {
        console.log(payload);
        console.log(`Received delivered event from driver: ${payload.orderId}`);
        io.to(payload.store).emit('delivered', payload);
    });

    // Join a room based on store name (vendor id)
    socket.on('join', (storeName) => {
        socket.join(storeName);
        console.log(`Socket ${socket.id} joined room: ${storeName}`);
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// eventPool.on('pickup', (payload) => logEvent('pickup', payload));
// eventPool.on('in-transit', (payload) => logEvent('in-transit', payload));
// eventPool.on('delivered', (payload) => logEvent('delivered', payload));

// function logEvent(event, payload) {
//     console.log(`EVENT: {
//         event: '${event}',
//         time: '${new Date().toISOString()}',
//         payload: ${JSON.stringify(payload, null, 2)}
//     }`);
// }