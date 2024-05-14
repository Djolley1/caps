'use strict';

// const driverHandler = require('./handler');
// require('./')
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');

socket.on('pickup', (payload) => {
    console.log(`DRIVER: picked up ${payload.orderId}`);
    setTimeout(() => {
        console.log(`DRIVER: delivered ${payload.orderId}`);
        socket.emit('delivered', payload);
    }, 1000);
});


// module.exports = driverHandler;