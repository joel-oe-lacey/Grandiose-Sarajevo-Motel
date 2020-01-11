class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
  }

  findReservations(hotel) {
    return hotel.bookings.filter(booking => booking.userID === this.id);
  }

  
}

export default User;