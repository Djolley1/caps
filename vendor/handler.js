'use strict';

const Chance = require('chance');
const chance = new Chance();
const eventPool = require('../eventPool');

function generateOrder(storeName) {
    return {
        store: storeName,
        orderId: chance.guid(),
        customer: chance.name(),
        address: `${chance.city()}, ${chance.state()}`
    };

    }

    function vendorHandler(storeName) {
        const order = generateOrder(storeName);
        console.log(order);
        eventPool.emit('pickup', order);

        eventPool.on('delivered', (event) => {
            if(event.payload.store === storeName) {
                console.log(`VENDOR: Thank you for your order ${event.payload.customer}`)
            }
        });
    }

module.exports = {vendorHandler};