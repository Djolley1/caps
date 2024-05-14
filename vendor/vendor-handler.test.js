'use strict';

const { vendorHandler, generateOrder } = require('../vendor');
const eventPool = require('../eventPool');

jest.mock('../eventPool', () => ({
    on: jest.fn(),
    emit: jest.fn()
}));

describe('Vendor Handler', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test('should generate an order and emit pickup event', () => {
        const storeName = 'Test Store';
        const order = generateOrder(storeName);

        vendorHandler(storeName);

        expect(consoleSpy).toHaveBeenCalledWith(order);
        expect(eventPool.emit).toHaveBeenCalledWith('pickup', order);
    });

    test('should log thank you message when package is delivered', () => {
        const storeName = 'Test Store';
        const order = generateOrder(storeName);
        const deliveredEvent = { payload: order };

        vendorHandler(storeName);
        eventPool.on.mock.calls[0][1](deliveredEvent);

        expect(consoleSpy).toHaveBeenCalledWith(`VENDOR: Thank you for your order ${order.customer}`);
    });
});