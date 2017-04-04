const express = require('express');
const router = express.Router();
const request = require('request-promise-native');

const BASE_URI = 'https://ushahidi-platform-test2017a.herokuapp.com';

function createPost(token) {
  let options = {
    method: 'POST',
    uri: `${BASE_URI}/api/v3/posts`,
    body: {
      title: 'Let\'s see how this API works (6)',
      content: 'Foo bar',
      locale: 'en_US',
      form: '2',
      values: {
        location_default: [
          {
            lat: 47000.6062,
            lon: -122.3321
          }
        ]
      },
    },
    auth: {
      'bearer': token
    },
    json: true
  };

  return request(options);
}

function authenticate() {
  let options = {
    method: 'POST',
    uri: `${BASE_URI}/oauth/token`,
    body: {
      username: '######',
      password: '######',
      grant_type: 'password',
      client_id: 'ushahidiui',
      client_secret: '######',
      scope: 'posts media forms api'
    },
    json: true
  };

  return request(options);
}

router.post('/', function(req, res, next) {

  let promise = authenticate();

  promise = promise.then(function(auth) {
    return createPost(auth.access_token);
  });

  promise = promise.then(function(post) {
    res.send(post);
  });

  promise.catch(function(err) {
    next(err);
  });
});

module.exports = router;
