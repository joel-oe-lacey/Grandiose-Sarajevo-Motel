import $ from 'jquery';
import User from '../classes/user.js';
import Manager from '../classes/manager.js';
import Hotel from '../classes/hotel.js';
let user, hotel;

const validateLogin = (e) => {
  e.preventDefault()
  const username = $('.login-username').val();
  const password = $('.login-password').val();

  if ((username.includes('customer') || username.includes('manager')) && password === 'overlook2019') {
    checkUserType(username);
    fetchCurrDate();
  } else {
    $('.login-alerts').text('Please enter a valid username & password');
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
    const userInfo = userData.find(user => user.id === Number(userID));
    return new User(userInfo);
  } else {
    return new Manager({id: 51, name: 'mr.manager'});
  }
};

const unpackData = (username, userType, data) => {
  const userInst = linkUser(username, userType, data[0].users);
  const hotelInst = new Hotel('Grandiose Sarajevo Motel', data[1].rooms, data[2].bookings, data[0].users);

  hotel = hotelInst;
  user = userInst;

  if (userType === 'manager') {
    generateManagerPage();
    displayManagerResv();
  } else {
    generateUserPage();
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
      <section class='dash-results' ></section>
      </section>
    </section>`);
};

const displayUserResv = () => {
  generateUserPage()
  const userResInst = user.findPersonalReservations(hotel);
  createUserRes(userResInst);
};

//refactor to display rooms instead of reservations 
//need to call different generation function 
const displayManagerResv = () => {
  const currDate = fetchCurrDate();
  const availRooms = hotel.findAvailableRooms(currDate);
  updateRoomDisplay(availRooms, 'manager');
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

const createResCard = (resDate, roomNum) => {
  $('.dash-card-list').append(`<section class='dash-card'>
    <img class="dash-img" src="./images/room-logo.svg" alt="Front facing view of an opulent hotel">
    <p class="dash-p-resDate">${resDate}</p>
    <p class="dash-p-roomNum">Room Number: ${roomNum}</p>
    <p></p>
    <p></p>
    </section>
    </section>`);
};

const createMngResCard = (resDate, roomNum, id) => {
  $('.dash-card-list').append(`<section class='dash-card'>
    <img class="dash-img" src="./images/room-logo.svg" alt="Front facing view of an opulent hotel">
    <p class="dash-p-resDate">${resDate}</p>
    <p class="dash-p-roomNum">Room Number: ${roomNum}</p>
    <button class="dash-button-delete" id="${id}">Delete</button>
    </section>
    </section>`);
};

const createUserRes = (bookings) => {
  bookings.forEach(booking => createResCard(booking.date, booking.roomNumber))
};

const createManagerRes = (bookings) => { 
  const today = new Date(fetchCurrDate());
  bookings.forEach(booking => {
    const bookingDate = new Date(booking.date)
    if (today > bookingDate) {
      createResCard(booking.date, booking.roomNumber)
    } else {
      createMngResCard(booking.date, booking.roomNumber, booking.id)
    }
  })
};

$(document).on('click', '.nav-reservation', displayUserResv);
$(document).on('click', '.nav-avail', displayManagerResv);

const fetchUserStats = () => {
  const userRes = user.findPersonalReservations(hotel);
  const rewardsTot = user.calculateRewardsTotal(userRes, hotel);
  displayUserStats(rewardsTot, user.name);
};

const displayUserStats = (rewardsStat, user) => {
  $('.dash').html(`
    <section class="dash-stats">
        <h3 class='userInfo-h3'>Hello ${user}.</h3>
        <h3>Thank you for staying with us, your business is valued.</h3>
        <h3 class="rewards-h3">Total Rewards: $${rewardsStat}</h3>
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
    <section class="dash-stats">
        <h3>The ${hotel.name}</h3>
        <h3 class="rewards-h3">Total Revenue: $${totalRev}</h3>
        <h3 class='userInfo-h3'>Percent of Rooms Booked: % ${pctBooked * 100}</h3>
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
    <h3 class="form-userspent">Please select a user.</h3>
    <button class="form-book hidden">Make a Reservation</button>
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
  updateRoomDisplay(filteredRooms, 'user');
}

const updateMngPage = () => {
  $('.dash-card-list').html('');
  $('.form-book').removeClass('hidden')
  const inputUser = $('.form-input-user').val();
  const chosenUser = hotel.findGuest(inputUser);
  user.setManagerPrivilege(chosenUser);
  const userRes = user.findPersonalReservations(hotel);
  const userSpent = user.calculateRewardsTotal(userRes, hotel);
  $('.form-userspent').text(`Total Spent: ${userSpent}`);
  createManagerRes(userRes);
}

$(document).on('click', '.nav-booking', generateBookingPage);
$(document).on('click', '.nav-manage', generateUserMngPage);
$(document).on('input', '.form-input-user', updateMngPage);

const findRoomsByDate = () => {
  const date = $('.dash-input-date').val().replace('-', '/').replace('-', '/');
  const today = fetchCurrDate();
  if (date) {
    return hotel.findAvailableRooms(date);
  } else {
    return hotel.findAvailableRooms(today);    
  }
}

const displayAvailRooms = () => {
  const availRooms = findRoomsByDate();
  updateRoomDisplay(availRooms, 'user');
}

const updateRoomDisplay = (rooms, userType) => {
  $('.dash-results').html('');
  if (rooms.length) {
    rooms.forEach(room => createRoomCard(room.number, room.roomType, room.bedSize, room.numBeds, room.costPerNight, userType))
  } else {
    $('.dash-results').append('<h2>Our sincerest apologies, it seems there are no rooms available for the date you’ve selected. I’d give you my room if I had one, but I don’t, since sleeping would be a moment spent not helping our most valued patrons. Please do consider choosing another date to stay with us and I will personally order you a cake from Mendl’s to show my gratitude.</h2>');
  }
}

const createRoomCard = (roomNum, roomType, bedSize, numBeds, cost, userType) => {
  if (userType === 'user') {
  $('.dash-results').append(`<section class='room-card'>
    <img class="dash-img" src="./images/room-logo.svg" alt="Front facing view of an opulent hotel">
    <p class="dash-p-roomType">${roomType}</p>
    <p class="dash-p-bedSize">Bed Size: ${bedSize}</p>
    <p class="dash-p-numBeds">Number of Beds: ${numBeds}</p>
    <p class="dash-p-cost">Cost: $${cost}</p>
    <button class="dash-button-book" id="${roomNum}">Book</button>
    </section>`);
  } else {
    $('.dash-results').append(`<section class='room-card'>
    <img class="dash-img" src="./images/room-logo.svg" alt="Front facing view of an opulent hotel">
    <p class="dash-p-roomType">${roomType}</p>
    <p class="dash-p-bedSize">Bed Size: ${bedSize}</p>
    <p class="dash-p-numBeds">Number of Beds: ${numBeds}</p>
    <p class="dash-p-cost">Cost: $${cost}</p>
    </section>`);   
  }
};

$(document).on('change', '.dash-input-date', displayAvailRooms);
$(document).on('change', '.dash-select', filterUserResByType);

const bookingDisplay = (status) => {
  if (status === 'pending') {
    $('.dash').html(`
    <section class="dash-stats">
        <h3>Order Pending</h3>
        <h3>Please Wait</h3>
    </section>`);
  } else {
    $('.dash').html(`
    <section class="dash-stats">
        <h3>Thanks for booking! Here are your booking details</h3>
        <h3>Booking Date: ${status.date}</h3>
        <h3>Room Number: ${status.roomNumber}</h3>
        <h3>We look forward to your stay</h3>
    </section>`);
  }
};

const deleteDisplay = (status) => {
  $('.dash').html(`
    <section class="dash-stats">
        <h3>Everything is ${status.statusText}</h3>
        <h3>Order Cancellation Successful</h3>
    </section>`);
};

const createBooking = (id) => {
  const date = $('.dash-input-date').val().replace('-', '/').replace('-', '/');
  const bookingData = {
    'userID': user.id,
    date,
    'roomNumber': Number(id),
  };

  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData),
  })
    .then(response => response.json())
    .then(json => bookingDisplay(json))
    .catch(err => console.log(err));

  bookingDisplay('pending');
}

const deleteBooking = (id) => {
  let bookingDelete;
  if (typeof id === 'number') {
    bookingDelete = {
      'id': Number(id)
    }
  } else {
    bookingDelete = {
      'id': String(id)
    }
  }

  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingDelete),
  })
    .then(response => deleteDisplay(response))
    .catch(err => console.log(err));

  bookingDisplay('pending');
}

$(document).on('click', '.dash-button-book', function() {
  createBooking(this.id);
});
$(document).on('click', '.dash-button-delete', function () {
  deleteBooking(this.id);
});
$(document).on('click', '.form-book', generateBookingPage);