class Booking {
  constructor(booking) {
    //dont use object.assign? bad code practice?
    this.id = booking.id;
    this.userID = booking.userID;
    this.date = booking.date;
    this.roomNumber = booking.roomNumber;
    this.roomServiceCharges = booking.roomServiceCharges;
  }
}

export default Booking;