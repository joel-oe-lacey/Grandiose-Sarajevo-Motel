class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
  }

  findPersonalReservations(hotel) {
    return hotel.bookings.filter(booking => booking.userID === this.id);
  }

  calculateRewardsTotal(reservations, hotel) {
    return Math.round(reservations.reduce((acc, res) => {
      hotel.rooms.forEach(room => {
        if (room.number === res.roomNumber) {
          acc += room.costPerNight;
        }
      });
      return acc;
    }, 0));
  }
}

export default User;