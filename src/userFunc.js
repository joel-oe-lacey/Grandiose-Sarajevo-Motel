import $ from 'jquery';
import User from '../classes/user.js';
import Hotel from '../classes/hotel.js';
import Booking from '../classes/booking.js';

const validateLogin = (e) => {
  e.preventDefault()
  const username = $('.login-username').val();
  const password = $('.login-password').val();

  generateUserPage();
  displayBookings();
  // if (username && password === 'overlook2019') {
  //   generateUserPage();
  //   // unpackData(username);
  // } else {
  //   console.log('Please enter value');
  // }
}

$('.login-submit').on('click', validateLogin);

const linkUser = (username, userData) => {
  const userID = username.match(/\d+/)[0];
  const userInfo = userData.find(user => user.id === userID);
  return new User(userInfo);
}

const loadDashboard = (user, hotel) => {
    console.log(user)
    console.log(hotel)
}

const unpackData = (username) => {
  const data = retrieveUserData();
  console.log(data)
  const bookings = bookingData.map(booking => new Booking(booking));
  const hotel = new Hotel('Grandiose Sarajevo Motel', roomData, bookings);
  loadDashboard(user, hotel)
}

const retrieveUserData = async() => {
  let urls = {
    userData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users',
    roomData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms',
    bookingData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings',
  }
  const dataFetches = Object.keys(urls).map(url => fetch(urls[url]));

  //await the result of promise all 
  const data = await Promise.all(dataFetches)
    .then(responses => responses.map(response => response.json()))
    // .then(resolved => {
    //   resolved.forEach(dataSet => {
    //     dataSet.then(data => {
    //       hotelData.push(Object.entries(data))
    //     })
    //   })
    .catch(err => console.log(err))
    //throw exception on catch, offer alert on UI to refresh, dont proceed until loaded 

  return data;
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
        <p class="dashboard-hold">Under Construction</p>
      </section>
    </section>`);
}

const displayBookings = () => {
  $('.dashboard').html(`<p class="dashboard-hold">test</p>`);
}