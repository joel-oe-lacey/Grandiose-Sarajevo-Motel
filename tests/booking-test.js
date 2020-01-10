import chai from 'chai';
const expect = chai.expect;
import Booking from '../booking.js';

describe('Booking', function () {
  let booking;

  beforeEach(() => {
    booking = new Booking();
  });

  it('should be a function', () => {
    expect(Booking).to.be.a('function');
  });
})