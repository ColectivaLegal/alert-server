const express = require('express');
const router = express.Router();
const settings = require('../settings.js');
const User = require('../models/user.js').User;

function createUser() {
  let user = new User();
  return user.save();
}

function verifyUser(id, secret) {
    return User.findById(id).then((user) => { 
        return new Promise(function(resolve, reject) {
            let verifyResult = user.verify(secret);
            if (verifyResult) {resolve()}
            else { reject("Verification failed"); }
        });
    })
}

router.post('/auth-token', function(req, res, next) {
  let promise = createUser()
  
  promise.then((user) => {
    let result = {
      id : user._id,
      verification_secret: user.verification_secret
    }
    res.json(result);
  });

  promise.catch((err) => {
      next(err);
  })
});

router.put('/auth-token', function(req, res, next) {
  if (!req.body.id || !req.body.verification_secret) {
      res.sendStatus(400);
  }
  
  let promise = verifyUser(req.body.id, req.body.verification_secret);

  promise.then(() => {
      res.sendStatus(200);
  });

  promise.catch(() => {
      res.sendStatus(400);
  })
});

module.exports = router;
