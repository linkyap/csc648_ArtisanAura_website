const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const db = require('../conf/database');
//in search route hence / refers to index of this router which is search
router.get('/', 
  [check('q').not().isEmpty().withMessage('Search term is required').isLength({ max: 60 }).withMessage('Search term must be less than 60 characters'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const searchTerm = req.query.q; // Get the search query from the request

    try {
      if (searchTerm) {
        const [results, fields] = await db.execute(
          "SELECT * FROM product WHERE title LIKE ? OR type LIKE ? OR material LIKE ? OR description LIKE ?", 
          [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        );//changed it so it is less vulnerable to sql injection^^^^^^

        if (results.length > 0) {
          // If items are found, render the searchresults template with the results
          res.render('searchresults', { results: results, searchTerm: searchTerm });
        } else {
           // If no items are found, render the searchresults template with a "Item not found!" message
          res.render('searchresults', { notFound: true });
        }
      } else {
        // If the search term is empty, render the searchresults template with an empty results array
        res.render('searchresults', { results: [] });
      }
    } catch (err) {
      console.error('Error executing search query:', err);
      res.status(500).send('Internal Server Error');
    }
  }
);

module.exports = router;