'use strict';

const { driverHandler } = require('../driver');
const eventPool = require('../eventPool');

jest.mock('../eventPool', () => ({
    on: jest.fn(),
    emit: jest.fn()
}));

describe('Driver Handler', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        jest.useFakeTimers();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        jest.clearAllTimers();
    });

    test('should log the payload and emit in-transit event', () => {
        const payload = { orderId: '12345' };

        driverHandler(payload);

        expect(consoleSpy).toHaveBeenCalledWith('Payload received in pickup event:', payload);
        expect(consoleSpy).toHaveBeenCalledWith('DRIVER: picked up 12345');
        expect(eventPool.emit).toHaveBeenCalledWith('in-transit', payload);

        jest.runAllTimers();

        expect(consoleSpy).toHaveBeenCalledWith('DRIVER: delivered 12345');
        expect(eventPool.emit).toHaveBeenCalledWith('delivered', { type: 'delivered', payload });
    });
});