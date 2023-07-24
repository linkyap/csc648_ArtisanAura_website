var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../conf/database');
const User = require('../db/users');
const UserError = require('../helpers/userError');
const registerValidator = require('../helpers/regValidation');

router.use('/registration', registerValidator);
router.post('/registration', (req, res, next) => {
  let { name, email, password } = req.body;
  User.emailExists(email)
    .then((emailDoesExist) => {
      if (emailDoesExist) {
        throw new UserError(
          "Email already exists",
          "/registration",
          200
        );
      }
      else {
        return User.create(name, email, password);
      }
    })
    .then((createUser) => {
      if (createUser) {
        throw new UserError(
          "User could not be created",
          "/registration",
          500
        );
      }
      else {
        req.flash('success', 'Account has been made!');
        req.session.save((err) => {
          res.redirect('/login');
        });
      }
    })
    .catch((err) => {
      if (err instanceof UserError) {
        req.flash('error', err.getMessage());
        res.status(err.getStatus());
        req.session.save((err) => {
          res.redirect('/registration');
        });
      }
      else {
        next(err);
      }
    })
});

router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;
  User.authenticate(email, password)
  .then((loggedUser) => {
    if(loggedUser.id > 0){
      req.session.account = {
        id: loggedUser.id,
        email: email,
        name: loggedUser.name
      };
      req.flash('success', 'You are now logged in!');
      req.session.save(err => {
        res.redirect('/');
      });
    }
    else{
      throw new UserError(
        "Invalid email and/or password", 
        "/login",
        200);
    }
  })
  .catch((err) => {
    if(err instanceof UserError) {
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      req.session.save(err => {
        res.redirect('/login');
      })
    }
    else{
      next(err);
    }
  })
});


router.post('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      next(error);
    }
    return res.redirect('/');
  })
});

module.exports = router;