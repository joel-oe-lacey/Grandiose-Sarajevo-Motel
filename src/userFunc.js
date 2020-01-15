import $ from 'jquery';
import User from '../classes/user.js';
import Manager from '../classes/manager.js';
import Hotel from '../classes/hotel.js';
import Booking from '../classes/booking.js';
let user, bookings, hotel;

const validateLogin = (e) => {
  e.preventDefault()
  const username = $('.login-username').val();
  const password = $('.login-password').val();

  if (username && password === 'overlook2019') {
    checkUserType(username);
    fetchCurrDate();
  } else {
    console.log('Please enter value');
  }
};

const checkUserType = (username) => {
  if (username === 'manager') {
    retrieveUserData(username, 'manager')
  } else {
    retrieveUserData(username, 'user')
  }
}

$('.login-submit').on('click', validateLogin);

const linkUser = (username, userType, userData) => {
  if (userType === 'user') {
    const userID = username.match(/\d+/)[0];
    const userInfo = userData.find(user => user.id === parseInt(userID));
    return new User(userInfo);
  } else {
    return new Manager({id: 51, name: 'mr.manager'});
  }
};

const unpackData = (username, userType, data) => {
  const userInst = linkUser(username, userType, data[0].users);
  const bookingInst = data[2].bookings.map(booking => new Booking(booking));
  const hotelInst = new Hotel('Grandiose Sarajevo Motel', data[1].rooms, bookingInst, data[0].users);

  bookings = bookingInst;
  hotel = hotelInst;
  user = userInst;

  if (userType === 'manager') {
    generateManagerPage();
    displayManagerResv();
  } else {
    generateUserPage();
    // selectedBtnStyle('nav-booking');
    displayUserResv();
  }
};

const retrieveUserData = (username, userType) => {
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
      unpackData(username, userType, data);
    })
};

//refactor to single function?
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
};

const generateManagerPage = () => {
  $('body').html(`<section class="main">
    <nav class="nav">
      <img class="nav-logo" src="./images/hotel-logo.svg" alt="A hotel on top of a mountain with a train ascending to it">
        <button class="nav-avail nav-btn">Available Rooms</button>
        <button class="nav-operations nav-btn">Operations</button>
        <button class="nav-manage nav-btn">Manage Bookings</button>
        </nav>
      <section class="dash">
      <section class= 'dash-card-list' ></section>
      </section>
    </section>`);
};

const displayUserResv = () => {
  generateUserPage()
  const userResInst = user.findPersonalReservations(hotel);
  createUserRes(userResInst);
};

const displayManagerResv = () => {
  const currDate = fetchCurrDate();
  const allRes = hotel.findReservationsByDate(currDate);
  generateManagerPage();
  createUserRes(allRes);
}

const fetchCurrDate = (type) => {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); 
  const yyyy = today.getFullYear();
  if (type) {
    today = yyyy + '-' + mm + '-' + dd;
  } else {
    today = yyyy + '/' + mm + '/' + dd;
  }
  return today;
}

const createResCard = (resDate, roomNum, roomType) => {
  $('.dash-card-list').append(`<section class='dash-card'>
    <img class="dash-img" src="./images/room-logo.svg" alt="Front facing view of an opulent hotel">
    <p class="dash-p-resDate">${resDate}</p>
    <p class="dash-p-roomNum">Room Number: ${roomNum}</p>
    <p class="dash-p-roomType">${roomType}</p>
    </section>`);
};

const createUserRes = (bookings) => {
  bookings.forEach(booking => createResCard(booking.date, booking.roomNumber, 'test'))
};

$(document).on('click', '.nav-reservation', displayUserResv);
$(document).on('click', '.nav-avail', displayManagerResv);

const fetchUserStats = () => {
  const userRes = user.findPersonalReservations(hotel);
  const rewardsTot = user.calculateRewardsTotal(userRes, hotel);
  displayUserStats(rewardsTot, user.name);
};

const displayUserStats = (rewardsStat, user) => {
  //need to build out more with more info, styling dependent on time
  $('.dash').html(`
    <section class="dash-rewards">
        <h3 class="rewards-h3">Total Spent: ${rewardsStat}</h3>
    </section>
    <section class="dash-userInfo">
        <h3 class='userInfo-h3'>${user}</h3>
    </section>`);
};

const fetchOpStats = () => {
  const currDate = fetchCurrDate();
  const pctBooked = user.calcPercRoomsBooked(hotel, currDate);
  const daysRev = user.calcTodaysRev(hotel, currDate);
  displayOpStats(pctBooked, daysRev)
}

const displayOpStats = (pctBooked, totalRev) => {
  $('.dash').html(`
    <section class="dash-rewards">
        <h3 class="rewards-h3">Total Revenue: $${totalRev}</h3>
    </section>
    <section class="dash-userInfo">
        <h3 class='userInfo-h3'>Percent of Rooms Booked: %${pctBooked * 100}</h3>
    </section>`);
}

$(document).on('click', '.nav-account', fetchUserStats);
$(document).on('click', '.nav-operations', fetchOpStats);

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
  const currDate = fetchCurrDate('input');
  $(".dash-input-date").attr("min", currDate)
};

const generateUserMngPage = () => {
  $('.dash').html(`
  <form class="dash-form">
    <datalist id="user-list">
    </datalist>
    <input class="form-input-user" name="userSrc" type="text" list="user-list">
    <h3 class="form-userspent">Spent:</h3>
    <button class="form-book">Book</button>
  </form>
  <section class="dash-card-list">
  </section>`);
  createUserList();
};

const createUserList = () => {
  hotel.guests.forEach(guest => {
    $('#user-list').append(`<option value="${guest.name}">`)
  })
}

const filterUserResByType = () => {
  const roomType = $('.dash-select').val();
  const availRooms = findRoomsByDate();
  const filteredRooms = hotel.filterRooms(availRooms, roomType)
  updateRoomDisplay(filteredRooms);
}

const updateMngPage = () => {
  $('.dash-card-list').html('');
  const inputUser = $('.form-input-user').val();
  const chosenUser = hotel.findGuest(inputUser);
  // $('.form-username').text(inputUser);
  user.setManagerPrivilege(chosenUser);
  const userRes = user.findPersonalReservations(hotel);
  const userSpent = user.calculateRewardsTotal(userRes, hotel);
  $('.form-userspent').text(`Total Spent: ${userSpent}`);
  createUserRes(userRes);
}

$(document).on('click', '.nav-booking', generateBookingPage);
$(document).on('click', '.nav-manage', generateUserMngPage);
$(document).on('input', '.form-input-user', updateMngPage);

const findRoomsByDate = () => {
  const date = $('.dash-input-date').val().replace('-', '/').replace('-', '/');
  return hotel.findAvailableRooms(date);
}

const displayAvailRooms = () => {
  const availRooms = findRoomsByDate();
  updateRoomDisplay(availRooms);
}

const updateRoomDisplay = (rooms) => {
  $('.dash-results').html('');
  if (rooms.length) {
    rooms.forEach(room => createRoomCard(room.roomType, room.bedSize, room.numBeds, room.costPerNight))
  } else {
    $('.dash-results').append('<h2>Our sincerest apologies, it seems there are no rooms available for the date you’ve selected. I’d give you my room if I had one, but I don’t, since sleeping would be a moment spent not helping our most valued patrons. Please do consider choosing another date to stay with us and I will personally order you a cake from Mendl’s to show my gratitude.</h2>');
  }
}

//swap room num for room type once done debugging
//currently not finding right avail rooms. 
const createRoomCard = (roomType, bedSize, numBeds, cost) => {
  $('.dash-results').append(`<section class='room-card'>
    <img class="dash-img" src="./images/room-logo.svg" alt="Front facing view of an opulent hotel">
    <p class="dash-p-roomType">${roomType}</p>
    <p class="dash-p-bedSize">Bed Size:${bedSize}</p>
    <p class="dash-p-numBeds">Number of Beds:${numBeds}</p>
    <p class="dash-p-cost">Cost:${cost}</p>
    <button class="dash-button-book">Book</
    </section>`);
};

$(document).on('change', '.dash-input-date', displayAvailRooms);
$(document).on('change', '.dash-select', filterUserResByType);

// const selectedBtnStyle = (btn) => {
//   //this function is to preserve the site button styling without removing focus styles on the page switching buttons 
//   $(`.${btn}`).css({
//     "background": "linear-gradient(rgba(0, 0, 0, .7), rgba(0, 0, 0, .7))", "border": "none"});
// }