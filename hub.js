'use strict';

const eventPool = require('./eventPool');

eventPool.on('pickup', (payload) => logEvent('pickup', payload));
eventPool.on('in-transit', (payload) => logEvent('in-transit', payload));
eventPool.on('delivered', (payload) => logEvent('delivered', payload));

function logEvent(event, payload) {
    console.log(`EVENT: {
        event: '${event}',
        time: '${new Date().toISOString()}',
        payload: ${JSON.stringify(payload, null, 2)}
    }`);
}

module.exports = logEvent;