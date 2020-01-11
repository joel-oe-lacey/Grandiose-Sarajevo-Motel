import chai from 'chai';
const expect = chai.expect;
import User from '../classes/user.js';
import Hotel from '../classes/hotel.js';
import Booking from '../classes/booking.js';
let roomData = [{
  number: 1,
  roomType: "residential suite",
  bidet: true,
  bedSize: "queen",
  numBeds: 1,
  costPerNight: 358.4
},
{
  number: 2,
  roomType: "suite",
  bidet: false,
  bedSize: "full",
  numBeds: 2,
  costPerNight: 477.38
},
{
  number: 3,
  roomType: "single room",
  bidet: false,
  bedSize: "king",
  numBeds: 1,
  costPerNight: 491.14
}];
let bookingData = [{
  id: "5fwrgu4i7k55hl6sz",
  userID: 1,
  date: "2020/02/04",
  roomNumber: 1,
  roomServiceCharges: []
},
{
  id: "5fwrgu4i7k55hl6t5",
  userID: 43,
  date: "2020/01/24",
  roomNumber: 2,
  roomServiceCharges: []
},
{
  id: "5fwrgu4i7k55hl6t6",
  userID: 1,
  date: "2020/01/10",
  roomNumber: 3,
  roomServiceCharges: []
}]

describe('User', function () {
  let user, bookings, hotel;

  beforeEach(() => {
    user = new User({
      id: 1,
      name: "Leatha Ullrich"
    });
    bookings = bookingData.map(booking => new Booking(booking));
    hotel = new Hotel('Grandiose Sarajevo Motel', roomData, bookings);
  });

  it('should be a function', () => {
    expect(User).to.be.a('function');
  });

  it('should have an ID', () => {
    expect(user.id).to.equal(1);
  });  

  it('should have a name', () => {
    expect(user.name).to.equal('Leatha Ullrich');
  });
  
  it('should find all user reservations', () => {
    expect(user.findReservations(hotel)).to.deep.equal([{
      id: "5fwrgu4i7k55hl6sz",
      userID: 1,
      date: "2020/02/04",
      roomNumber: 1,
      roomServiceCharges: []
    },
    {
      id: "5fwrgu4i7k55hl6t6",
      userID: 1,
      date: "2020/01/10",
      roomNumber: 3,
      roomServiceCharges: []
    }]);
  });

})