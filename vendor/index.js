'use strict';

// const vendorHandler = require('./handler');
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');
const Chance = require('chance');
const chance = new Chance();

const storeName = '1-206-Flowers';

socket.emit('join', storeName);

setInterval(() => {
    generateOrder(socket);
}, 5000);

socket.on('delivered', (payload) => {
    if (payload.store === storeName) {
        console.log(`VENDOR: Thank you for your order ${payload.customer}`);
    }
});

const generateOrder = (socket, payload = null) => {
    if (!payload) {
        payload = {
            store: storeName,
            orderId: chance.guid(),
            customer: chance.name(),
            address: `${chance.city()}, ${chance.state()}`
        }
    }
   console.log('order is ready for pickup');
   socket.emit('pickup', payload);     
    };

// Simulate a vendor triggering a pickup event
// vendorHandler('1-206-flowers');
module.exports = {generateOrder};