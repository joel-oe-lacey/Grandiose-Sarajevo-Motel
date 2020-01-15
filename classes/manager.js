import User from './user.js';

class Manager extends User {
  constructor(userData) {
    super(userData)
  }

  calcPercRoomsBooked(hotel, date) {
    const availCount = hotel.findAvailableRooms(date).length;
    const roomCount = hotel.rooms.length;
    return (roomCount - availCount) / roomCount;
  }

  calcTodaysRev(hotel, date) {
    const todaysRes = hotel.findReservationsByDate(date);
    return this.calculateRewardsTotal(todaysRes, hotel);
  }

  setManagerPrivilege(user) {
    this.id = user.id;
    this.name = user.name;
  }
}

export default Manager;