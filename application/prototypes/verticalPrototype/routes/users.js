var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../conf/database')


router.post('/registration',
  async function (req, res, next) {
    var { username, email, password } = req.body;
    //check username unique

    try {


      //check email unique


      var hashedPassword = await bcrypt.hash(password, 5);

      //insert
      var [resultObject, fields] = await db.execute(
        `INSERT INTO users
        (username,email,passwork)
        value
        (?,?,?);`,
        [username, email, hashedPassword]
      );

      //respond  
      if (resultObject && resultObject.affectedRows == 1) {
        req.flash("success", `${username}'s account has been created`);
        return req.session.save(function (err) {
          return res.redirect('/login');
        })
      } else {
        req.flash("error", `${username}'s account could not be created. 
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



// router.post('/login', async function (req, res, next) {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.redirect('/login');
//   } else {
//     var [rows, fields] = await db.execute(
//       `select id,username,password,email from users where username=?;`,
//       [username]
//     );
//     var user = rows[0];
//     if (!user) {
//       req.flash("error", `Log in failed: Invalid username/password`);
//       req.session.save(function (err) {
//         return res.redirect('/login');
//       })

//     } else {

//       var passwordsMatch = await bcrypt.compare(password, user.password);
//       if (passwordsMatch) {
//         req.session.user = {
//           userId: user.id,
//           email: user.email,
//           username: user.username
//         };
//         req.flash("success", `You are now logged in!`);
//         req.session.save(function (err) {
//           return res.redirect('/');
//         })
//       } else {
//         req.flash("error", `Log in failed: Invalid username/password`);
//         req.session.save(function (err) {
//           return res.redirect('/login');
//         })
//       }
//     }
//   }
// });

module.exports = router;