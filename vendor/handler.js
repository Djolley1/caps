'use strict';

require('dotenv').config();
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');

// Function to handle pickup event from the hub
const handlePickup = (payload) => {
    console.log(`VENDOR: Cool, ${payload.orderID} is on the way!`);
};

// Function to handle delivery event from the hub
const handleDelivery = (payload) => {
    console.log(`VENDOR: Thanks for delivering ${payload.orderID}`);
};

// Subscribe to pickup and delivery events from the hub
socket.on('pickup', handlePickup);
socket.on('delivered', handleDelivery);

module.exports = { handlePickup, handleDelivery };
