const express = require('express');
const router = express.Router();
const request = require('request-promise-native');
const settings = require('../settings.js');

const BASE_URI = settings.ushahidi.uriBase;

function createPost(token) {
  let options = {
    method: 'POST',
    uri: `${BASE_URI}/api/v3/posts`,
    body: {
      title: 'Let\'s see how this API works (8)',
      content: 'Foo bar',
      locale: 'en_US',
      form: '2',
      values: {
        location_default: [
          {
            lat: 47.8062,
            lon: -121.3321
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
      username: settings.ushahidi.username,
      password: settings.ushahidi.password,
      grant_type: 'password',
      client_id: 'ushahidiui',
      client_secret: settings.ushahidi.secret,
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
