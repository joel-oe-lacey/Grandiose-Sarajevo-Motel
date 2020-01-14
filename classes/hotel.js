class Hotel {
  constructor(name, rooms, bookings) {
    this.name = name;
    this.rooms = rooms;
    this.bookings = bookings;    
  }

  findReservationsByDate(date) {
    return this.bookings.filter(booking => booking.date === date);
  }

  findAvailableRooms(date) {
    //add rooms filter to an available rooms array for later filtering 
    const reservations = this.findReservationsByDate(date).map(res => res.roomNumber);

    return this.rooms.filter(room => !reservations.includes(room.number))
  }

  filterRooms(type) {
    //filter on available rooms array then readd to dom based on that
    return this.rooms.filter(room => room.roomType === type);
  }
}

export default Hotel;