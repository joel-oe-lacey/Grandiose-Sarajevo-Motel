import chai from 'chai';
const expect = chai.expect;
import Manager from '../classes/manager.js';
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
let mngData = { id: 51, name: 'mr.manager' };

describe('Manager', function () {
  let manager, hotel;

  beforeEach(() => {
    hotel = new Hotel('Grandiose Sarajevo Motel', roomData, bookingData);
    manager = new Manager(mngData);
  });

  it('should be a function', () => {
    expect(Manager).to.be.a('function');
  });

  it('should have an ID', () => {
    expect(manager.id).to.equal(51);
  });

  it('should have a name', () => {
    expect(manager.name).to.equal('mr.manager');
  });

  it('should be able to calculate percentage of rooms booked', () => {
    expect(manager.calcPercRoomsBooked(hotel, '2020/01/24')).to.deep.equal(.25);
  });

  it('should be able to calculate revenue for today', () => {
    expect(manager.calcTodaysRev(hotel, '2020/01/10')).to.deep.equal(850);
  });
})