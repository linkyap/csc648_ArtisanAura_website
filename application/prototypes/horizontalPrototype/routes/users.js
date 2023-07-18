var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../conf/database')


router.post('/registration',
  async function (req, res, next) {
    var { name, email, password } = req.body;
    //check email unique

    try {


      var hashedPassword = await bcrypt.hash(password, 5);

      //insert
      var [resultObject, fields] = await db.execute(
        `INSERT INTO account
        (name,email,password)
        value
        (?,?,?);`,
        [name, email, hashedPassword]
      );

      //respond  
      if (resultObject && resultObject.affectedRows == 1) {
        req.flash("success", `${name}'s account has been created`);
        return req.session.save(function (err) {
          return res.redirect('/login');
        })
      } else {
        req.flash("error", `${name}'s account could not be created. 
      Please try again later`
        );
        return req.session.save(function (err) {
          return res.redirect("/registration");
        }

        )
      }

    } catch (error) {
      next(error);
    }
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