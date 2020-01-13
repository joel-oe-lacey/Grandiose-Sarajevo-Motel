import $ from 'jquery';
import User from '../classes/user.js';
import Hotel from '../classes/hotel.js';
import Booking from '../classes/booking.js';
let user, bookings, hotel;

const validateLogin = (e) => {
  e.preventDefault()
  const username = $('.login-username').val();
  const password = $('.login-password').val();

  if (username && password === 'overlook2019') {
    retrieveUserData(username);
  } else {
    console.log('Please enter value');
  }
}

$('.login-submit').on('click', validateLogin);

const linkUser = (username, userData) => {
  const userID = username.match(/\d+/)[0];
  const userInfo = userData.find(user => user.id === parseInt(userID));
  return new User(userInfo);
}

const unpackData = (username, data) => {
  const userInst = linkUser(username, data[0].users);
  const bookingInst = data[2].bookings.map(booking => new Booking(booking));
  const hotelInst = new Hotel('Grandiose Sarajevo Motel', data[1].rooms, bookingInst);

  bookings = bookingInst;
  hotel = hotelInst;
  user = userInst;
  generateUserPage();
  // selectedBtnStyle('nav-booking');
  displayUserResv();
}

const retrieveUserData = (username) => {
  const urls = {
    userData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users',
    roomData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms',
    bookingData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings',
  };

  const dataFetches = Object.keys(urls).map(url => {
    return fetch(urls[url])
      .then(response => response.json())
  });
  
  Promise.all(dataFetches)
    .then(data => {
      unpackData(username, data);
    })
}

const generateUserPage = () => {
  $('body').html(`<section class="main">
    <nav class="nav">
      <img class="nav-logo" src="./images/hotel-logo.svg" alt="A hotel on top of a mountain with a train ascending to it">
        <button class="nav-reservation nav-btn">Your Bookings</button>
        <button class="nav-account nav-btn">Your Account</button>
        <button class="nav-booking nav-btn">Make A Reservation</button>
        </nav>
      <section class="dash">
      <section class= 'dash-card-list' ></section>
      </section>
    </section>`);
}

const displayUserResv = () => {
  generateUserPage()
  const userResInst = user.findPersonalReservations(hotel);
  createUserRes(userResInst);
}

const createResCard = (resDate, roomNum, roomType) => {
  $('.dash-card-list').append(`<section class='dash-card'>
    <img class="dash-img" src="./images/room-logo.svg" alt="Front facing view of an opulent hotel">
    <p class="dash-p-resDate">${resDate}</p>
    <p class="dash-p-roomNum">Room Number: ${roomNum}</p>
    <p class="dash-p-roomType">${roomType}</p>
    </section>`);
}

const createUserRes = (bookings) => {
  bookings.forEach(booking => createResCard(booking.date, booking.roomNumber, 'test'))
}

$(document).on('click', '.nav-reservation', displayUserResv);

const displayUserStats = () => {
  //need to build out more with more info, styling dependent on time
  $('.dash').html(`<section class="dash">
    <section class="dash-rewards">
        <h3 class="rewards-h3">75%</h3>
    </section>
    <section class="dash-userInfo">
        <h3 class='userInfo-h3'>Joel</h3>
    </section>
    </section>`);
}

$(document).on('click', '.nav-account', displayUserStats);

const generateBookingPage = () => {
  $('.dash').html(`<form class="dash-form">
    <label for="date">Select a date:</label>
    <input class="dash-input-date" name="date" type="date">
    <label for="roomType">Filter by type:</label>
    <select class="dash-select" name="roomType" id="">
        <option value="junior suite">Junior Suite</option>
        <option value="residential suite">Residential Suite</option>
        <option value="suite">Suite</option>
        <option value="single room">Single Room</option>
    </select>
  </form>
  <section class="dash-results">
  </section>`);  
}

$(document).on('click', '.nav-booking', generateBookingPage);

// const selectedBtnStyle = (btn) => {
//   //this function is to preserve the site button styling without removing focus styles on the page switching buttons 
//   $(`.${btn}`).css({
//     "background": "linear-gradient(rgba(0, 0, 0, .7), rgba(0, 0, 0, .7))", "border": "none"});
// }