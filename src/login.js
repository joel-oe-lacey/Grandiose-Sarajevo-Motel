import $ from 'jquery';
const hotelData = {};

const validateLogin = (e) => {
  e.preventDefault()
  const username = $('.login-username').val();
  const password = $('.login-password').val();

  if (username && password === 'overlook2019') {
    console.log('passed')
  } else {
    console.log('Please enter value');
  }
}

$('.login-submit').on('click', validateLogin);

const linkUser = (username) => {
  const userID = username.match(/\d+/)[0];

  //has to trigger another function within the fetch 
}

const loadDashboard = () => {
  //push to a small repo 
}

const retrieveUserData = () => {
  let urls = {
    userData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users',
    roomData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms',
    bookingData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings',
  }

  const dataFetches = Object.keys(urls).map(url => fetch(urls[url]));
  Promise.all(dataFetches)
    .then(responses => responses.map(response => response.json()))
    .then(resolved => {
      resolved.forEach(dataSet => {
        dataSet.then(data => {
          hotelData[Object.keys(data)[0]] = data[Object.keys(data)[0]]
        })
      })
      console.log(hotelData)
    })
    .catch(err => console.log(err))
}