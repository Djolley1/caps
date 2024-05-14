'use strict';

const eventPool = require('../eventPool');
const driverHandler = require('./handler');

describe('Driver Handler Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should log picked up and delivered messages', (done) => {
    jest.setTimeout(10000);

    console.log = jest.fn();
    
    const payload = {
      store: '1-206-flowers',
      orderId: 'e3669048-7313-427b-b6cc-74010ca1f8f0',
      customer: 'Jamal Braun',
      address: 'Schmittfort, LA',
    };

    driverHandler();

    eventPool.emit('pickup', { type: 'pickup', payload });

    setTimeout(() => {
        expect(console.log).toHaveBeenCalledWith('Payload received in pickup event:', payload);
      expect(console.log).toHaveBeenCalledWith(`DRIVER: picked up ${payload.orderId}`);
      expect(console.log).toHaveBeenCalledWith(`DRIVER: delivered ${payload.orderId}`);
      done();
    }, 1500);
  });

  test('should emit in-transit and delivered events', (done) => {
    jest.setTimeout(10000);
    
    const payload = {
      store: '1-206-flowers',
      orderId: 'e3669048-7313-427b-b6cc-74010ca1f8f0',
      customer: 'Jamal Braun',
      address: 'Schmittfort, LA',
    };

    driverHandler();

    eventPool.on('in-transit', (event) => {
      expect(event.type).toBe('in-transit');
      expect(event.payload).toEqual(payload);
    });

    eventPool.on('delivered', (event) => {
      expect(event.type).toBe('delivered');
      expect(event.payload).toEqual(payload);
      done();
    });

    eventPool.emit('pickup', { type: 'pickup', payload });
  });
});
