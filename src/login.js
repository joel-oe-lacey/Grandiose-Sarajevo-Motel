import $ from 'jquery';
import User from '../classes/user.js';
import Hotel from '../classes/hotel.js';

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
  const userInfo = userData.find(user => user.id === userID);
  return new User(userInfo);
}

const loadDashboard = (username, data) => {
  //push to a small repo 
  const user = linkUser(username, data.users);
  const hotel = new Hotel('Grandiose Sarajevo Motel', data.rooms, data.bookings);

}

const retrieveUserData = (username) => {
  let urls = {
    userData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users',
    roomData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms',
    bookingData: 'https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings',
  }

  const hotelData = {};
  const dataFetches = Object.keys(urls).map(url => fetch(urls[url]));
  Promise.all(dataFetches)
    .then(responses => responses.map(response => response.json()))
    .then(resolved => {
      resolved.forEach(dataSet => {
        dataSet.then(data => {
          hotelData[Object.keys(data)[0]] = data[Object.keys(data)[0]]
        })
      })
      loadDashboard(username, hotelData)
    })
    .catch(err => console.log(err))
    //throw exception on catch, offer alert on UI to refresh, dont proceed until loaded 
}

