import chai from 'chai';
const expect = chai.expect;
import Room from '../room.js';

describe('Room', function () {
  let room;

  beforeEach(() => {
    room = new Room();
  });

  it('should be a function', () => {
    expect(Room).to.be.a('function');
  });
})