'use strict';

const eventPool = require('../eventPool.js');

function driverHandler() {
    eventPool.on('pickup', (event) => {
        console.log(`DRIVER: picked up ${event.payload.orderID}`);
        eventPool.emit('in-transit', { type: 'in-transit', payload: event.payload });

        setTimeout(() => {
            console.log(`DRIVER: delivered ${event.payload.orderId}`);
            eventPool.emit('delivered', { type: 'delivered', payload: event.payload });
        }, 1000);
    });
}

module.exports = driverHandler;

