'use strict';

const io = require('socket.io-client');
const Chance = require('chance');
const chance = new Chance();
const { handlePickup, handleDelivery } = require('./handler.js');

const URL = process.env.HUB;

console.log('Connecting to:', URL);
const socket = io.connect(URL);

// Subscribe to the right events and handle them with the right handlers
socket.on('pickup', handlePickup);
socket.on('delivered', handleDelivery);

makeFakeOrders();

function makeFakeOrders() {
    const fake = new Chance();

    setInterval(() => {
        let order = {
            orderID: fake.guid(),
            status: 'ready',
            store: fake.company(),
            customer: fake.name(),
            address: fake.address(),
            amount: fake.dollar()
        };
        console.log('VENDOR: New Order', order.orderID);
        socket.emit('ready-for-pickup', order);
    }, 1000);
}