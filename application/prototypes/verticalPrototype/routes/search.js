const express = require('express');
const router = express.Router();
const db = require('../conf/database');

router.get('/search', async (req, res) => {
  const searchTerm = req.query.q; // Get the search query from the request

  try {
    if (searchTerm) {
      const [results, fields] = await db.execute(
        `SELECT * FROM product WHERE name LIKE '%${searchTerm}%' OR type LIKE '%${searchTerm}%' OR material LIKE '%${searchTerm}%' OR description LIKE '%${searchTerm}%'`
      );

      if (results.length > 0) {
        // If items are found, render the searchresults template with the results
        res.render('searchresults', { results });
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
});

module.exports = router;

