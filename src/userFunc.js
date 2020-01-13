import $ from 'jquery';
import User from '../classes/user.js';
import Hotel from '../classes/hotel.js';
import Booking from '../classes/booking.js';

const validateLogin = (e) => {
  e.preventDefault()
  const username = $('.login-username').val();
  const password = $('.login-password').val();

  if (username && password === 'overlook2019') {
    retrieveUserData(username);
    generateUserPage();
    displayBookings();
  } else {
    console.log('Please enter value');
  }
}

$('.login-submit').on('click', validateLogin);

const linkUser = (username, userData) => {
  const userID = username.match(/\d+/)[0];
  const userInfo = userData.find(user => user.id === parseInt(userID));
  console.log('userFind', userInfo)
  return new User(userInfo);
}

const unpackData = (username, data) => {
  const user = linkUser(username, data[0].users);
  const bookings = data[2].bookings.map(booking => new Booking(booking));
  const hotel = new Hotel('Grandiose Sarajevo Motel', data[1].rooms, bookings);

  console.log('bookings', bookings)
  console.log('hotel', hotel)
  console.log('user', user)
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
      console.log('dataBefore', data)
      unpackData(username, data);
    })
}

const generateUserPage = () => {
  $('body').html(`<section class="main">
    <nav class="nav">
      <img class="nav-logo" src="./images/hotel-logo.svg" alt="A hotel on top of a mountain with a train ascending to it">
        <button class="nav-booking nav-btn">Your Bookings</button>
        <button class="nav-account nav-btn">Your Account</button>
        <button class="nav-reservation nav-btn">Make A Reservation</button>
        </nav>
      <section class="dashboard">
      
      </section>
    </section>`);
}

const displayBookings = () => {
  $('.dashboard').html(`<p class="dashboard-hold">test</p>`);
}