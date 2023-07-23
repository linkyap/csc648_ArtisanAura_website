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
          "Registration Failed: Email already exists",
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

  if (!email || !password) {
    return res.redirect('/login');
  } else {
    var [rows, fields] = await db.execute(
      `select id,name,password,email from account where email=?;`,
      [email]
    );
    var account = rows[0];
    if (!account) {
      req.flash("error", `Log in failed: Invalid email/password`);
      return req.session.save(function (err) {
        res.redirect('/login');
      });

    } else {

      var passwordsMatch = await bcrypt.compare(password, account.password);
      if (passwordsMatch) {
        req.session.account = {
          id: account.id,
          email: account.email,
          name: account.name
        };
        req.flash("success", `You are now logged in!`);
        return req.session.save(function (err) {
          res.redirect('/');
        });
      } else {
        req.flash("error", `Log in failed: Invalid username/password`);
        return req.session.save(function (err) {
          res.redirect('/login');
        });
      }
    }
  }
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