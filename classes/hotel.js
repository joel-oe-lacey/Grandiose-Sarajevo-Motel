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
    const reservations = this.findReservationsByDate(date).map(res => res.roomNumber);

    return this.rooms.filter(room => !reservations.includes(room.number))
  }

  calcPercRoomsBooked(date) {
    const availCount = this.findAvailableRooms(date).length;
    const roomCount = this.rooms.length;
    return (roomCount - availCount) / roomCount;
  }

  filterRooms(type) {
    return this.rooms.filter(room => room.roomType === type);
  }
}

export default Hotel;