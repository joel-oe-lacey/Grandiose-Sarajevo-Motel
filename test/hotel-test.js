import chai from 'chai';
const expect = chai.expect;
import Hotel from '../classes/hotel.js';

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
},
{
  number: 4,
  roomType: "single room",
  bidet: false,
  bedSize: "queen",
  numBeds: 1,
  costPerNight: 429.44
}];
let bookingData = [{
  id: "5fwrgu4i7k55hl6sz",
  userID: 1,
  date: "2020/01/10",
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
},
{
  id: "5fwrgu4i7k55hl6t7",
  userID: 20,
  date: "2020/02/16",
  roomNumber: 7,
  roomServiceCharges: []
}]


describe('Hotel', function () {
  let hotel;

  beforeEach(() => {
    hotel = new Hotel('Grandiose Sarajevo Motel', roomData, bookingData);
  });

  it('should be a function', () => {
    expect(Hotel).to.be.a('function');
  });

  it('should have a name', () => {
    expect(hotel.name).to.equal('Grandiose Sarajevo Motel');
  });

  it('should store rooms', () => {
    expect(hotel.rooms).to.deep.equal(roomData);
  });

  it('should keep track of bookings', () => {
    expect(hotel.bookings).to.deep.equal(bookingData);
  });

  it('should be able to find reservations by date', () => {
    expect(hotel.findReservationsByDate("2020/01/10")).to.deep.equal([{
      id: "5fwrgu4i7k55hl6sz",
      userID: 1,
      date: "2020/01/10",
      roomNumber: 1,
      roomServiceCharges: []
    }, {
      id: "5fwrgu4i7k55hl6t6",
      userID: 1,
      date: "2020/01/10",
      roomNumber: 3,
      roomServiceCharges: []
    }]);
  });

  it('should be able to find available rooms by date', () => {
    expect(hotel.findAvailableRooms("2020/01/10")).to.deep.equal([{
      number: 2,
      roomType: "suite",
      bidet: false,
      bedSize: "full",
      numBeds: 2,
      costPerNight: 477.38
    },
    {
      number: 4,
      roomType: "single room",
      bidet: false,
      bedSize: "queen",
      numBeds: 1,
      costPerNight: 429.44
    }]);
  });

  it('should be able to filter rooms by type', () => {
    expect(hotel.filterRooms(roomData, "single room")).to.deep.equal([{
      number: 3,
      roomType: "single room",
      bidet: false,
      bedSize: "king",
      numBeds: 1,
      costPerNight: 491.14
    },
    {
      number: 4,
      roomType: "single room",
      bidet: false,
      bedSize: "queen",
      numBeds: 1,
      costPerNight: 429.44
    }]);
  });
})