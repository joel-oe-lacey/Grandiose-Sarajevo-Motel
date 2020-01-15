class Hotel {
  constructor(name, rooms, bookings, allGuests) {
    this.name = name;
    this.rooms = rooms;
    this.bookings = bookings;
    this.guests = allGuests;   
  }

  findGuest(username) {
    return this.guests.find(guest => guest.name === username);
  }

  findReservationsByDate(date) {
    return this.bookings.filter(booking => booking.date === date);
  }

  findAvailableRooms(date) {
    const reservations = this.findReservationsByDate(date).map(res => res.roomNumber);
    return this.rooms.filter(room => !reservations.includes(room.number))
  }

  filterRooms(rooms, type) {
    return rooms.filter(room => room.roomType === type);
  }
}

export default Hotel;