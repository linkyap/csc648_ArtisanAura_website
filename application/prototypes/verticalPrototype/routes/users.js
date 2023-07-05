var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var db = require('../conf/database')


router.post('/sign-in', (req, res) => {
    
    const { username, password } = req.body;
  
    // Perform input validation
    if (!username || !password) {
      res.render('partials/sign-in', { error: 'Please provide both username and password' });
      return;
    }
      // Check if the username exists in the database
      const query = `SELECT * FROM user WHERE username = ?`;
      const values = [username];
  
      db.query(query, values, (error, results) => {
        if (error) {
          console.error('Error querying the database:', error);
          res.redirect('/sign-in');
          return;
        }
  
        if (results.length === 0) {
          // Username not found in the database
          res.redirect('/partials/sign-in');
          return;
        }
  
        const user = results[0];
  
        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            res.redirect('/partials/sign-in');
            return;
          }
  
          if (isMatch) {
            // Passwords match, user is authenticated
            req.session.username = username; // Save the username in the session
            req.session.email = user.email; // Save the email in the session
            res.redirect('/');
          } else {
            // Passwords do not match
            res.redirect('/partials/sign-in');
          }
        });
      });
  });

  module.exports = router;