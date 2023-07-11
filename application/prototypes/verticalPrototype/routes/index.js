var express = require('express');
const path = require("path");
var router = express.Router();


// home page aka index
router.get('/', async function (req, res, next) {
  try {       //vvv
    res.render('index', { title:'Home', css:["newsletter.css","quiz.css"], js:["quiz.js"]});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get('/login',function(req,res,next){
  res.render('login');
});
router.get("/registration", function(req,res,next){
  res.render('registration');
});
router.get('/ComingSoon',function(req,res,next){
  res.render('ComingSoon', { title:'Home', css:["newsletter.css"]});
});
router.get('/product',function(req,res,next){
  res.render('product');
});
router.get('/product/:id', function(req,res,next){
  res.render('ComingSoon');
})

let limitSql = await db.execute(`SELECT COUNT(*) FROM product`);
if(limitSql > 5){
    res.send({limitNotReached: false});
}
else{
  res.send({limitNotReached: true});
}


module.exports = router;
