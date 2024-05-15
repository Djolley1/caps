'use strict';

require('dotenv').config();
const io = require('socket.io-client');

const URL = process.env.HUB;

console.log('Connecting to:', URL);
const socket = io.connect(URL);

// Function to handle pickup event from the hub
const handlePickup = (payload) => {
    setTimeout(() => {
        console.log('DRIVER: Picked Up', payload.orderID);
        socket.emit('package-in-transit', payload);
    }, 1000);

    setTimeout(() => {
        console.log('DRIVER: Delivered', payload.orderID);
        socket.emit('package-delivered', payload);
        socket.emit('driver-ready');
    }, 4000);
};

// Let the hub know that the driver is ready to pick up orders
socket.emit('driver-ready');

// Listen for pickup event from the hub
socket.on('pickup', handlePickup);