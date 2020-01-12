class Hotel {
  constructor(name, rooms, bookings) {
    this.name = name;
    this.rooms = rooms;
    this.bookings = bookings;    
  }

  findReservationsByDate(date) {
    return this.bookings.filter(booking => booking.date === date);
  }
}

export default Hotel;