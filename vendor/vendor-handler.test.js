'use strict';

const eventPool = require('../eventPool');
const vendorHandler = require('./handler');

describe('Vendor Handler Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should emit a pickup event', (done) => {
    const storeName = '1-206-flowers';
    
    eventPool.on('pickup', (event) => {
      expect(event.type).toBe('pickup');
      expect(event.payload.store).toBe(storeName);
      done();
    });

    vendorHandler(storeName);
  });

  test('should log a thank you message when a package is delivered', (done) => {
    console.log = jest.fn();
    
    const storeName = '1-206-flowers';
    const customerName = 'Jamal Braun';
    const payload = {
      store: storeName,
      orderId: 'e3669048-7313-427b-b6cc-74010ca1f8f0',
      customer: customerName,
      address: 'Schmittfort, LA',
    };

    vendorHandler(storeName);

    eventPool.emit('delivered', { type: 'delivered', payload });

    setImmediate(() => {
      expect(console.log).toHaveBeenCalledWith(`VENDOR: Thank you for your order ${customerName}`);
      done();
    });
  });
});
