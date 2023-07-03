var express = require('express');
const path = require("path");
var router = express.Router();


// home page aka index
router.get('/', async function (req, res, next) {
  try {       //vvv
    res.render('index', { title:'Home page'});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});;

module.exports = router;
