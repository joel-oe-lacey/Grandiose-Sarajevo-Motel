import $ from 'jquery';

//fetch user input
// let urls = {
//   userData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users',
//   roomData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms',
//   bookingData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings',
// }

const validateLogin = (e) => {
  e.preventDefault()
  const username = $('.login-username').val();
  const password = $('.login-password').val();

  if (username && password) {
    console.log('passed')
  } else {
    console.log('Please enter value');
  }
}

$('.login-submit').on('click', validateLogin);