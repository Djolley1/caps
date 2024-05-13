'use strict';

const eventPool = require('./eventPool');

eventPool.on('pickup', logEvent);
eventPool.on('in-transit', logEvent);
eventPool.on('delivered', logEvent);

function logEvent(event) {
    console.log(`EVENT: {
        event: '${event.type}',
        time: '${new Date().toISOString()}',
        payload: ${JSON.stringify(event.payload, null, 2)}
    }`);
}

module.exports = logEvent;