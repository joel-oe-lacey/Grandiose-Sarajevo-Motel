import chai from 'chai';
const expect = chai.expect;
import Hotel from '../hotel.js';

describe('Hotel', function () {
    let hotel;

    beforeEach(() => {
        hotel = new Hotel();
    });

    it('should be a function', () => {
        expect(Hotel).to.be.a('function');
    });
})