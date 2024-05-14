'use strict';

const eventPool = require('../eventPool.js');

function driverHandler(payload) {
    console.log('Payload received in pickup event:', payload);
    console.log(`DRIVER: picked up ${payload.orderId}`);
    eventPool.emit('in-transit', payload);

    setTimeout(() => {
        console.log(`DRIVER: delivered ${payload.orderId}`);
        eventPool.emit('delivered', { type: 'delivered', payload });
    }, 1000);
}

eventPool.on('pickup', driverHandler);

module.exports = { driverHandler };