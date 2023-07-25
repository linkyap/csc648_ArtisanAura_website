var express = require('express');
const path = require("path");
var router = express.Router();
var db = require('../conf/database');
// home page aka index
router.get('/', async function (req, res, next) {
  try {       //vvv
    res.render('index', { title:'Home', css:["newsletter.css","quiz.css"], js:["quiz.js"]});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// login page 
router.get('/login',function(req,res,next){
  res.render('login');
});

//profile page
router.get('/users/profile/:id', function(req, res, next){
  res.render('profile', {title:'Profile'});
});

// registration page 
router.get("/registration", function(req,res,next){
  res.render('registration');
});

// coming soon page 
router.get('/ComingSoon',function(req,res,next){
  res.render('ComingSoon', { title:'Coming Soon', css:["newsletter.css"]});
});

// add product page 
router.get('/addProduct', function(req,res,next){
  res.render('addProduct');
});

// Refund page
router.get('/req-refund',function(req,res,next){
  res.render('refundReq', { title:'Request Refund'});
});
// Refund page
router.get('/order-status',function(req,res,next){
  res.render('orderStatus', { title:'Order Status'});
});
// // single product page 
// router.get('/product/:id', function(req,res,next){
//   res.render('productPage');
// });

router.get('/cart', function (req,res,next){
  res.render('cart', {title: 'Shopping Cart'});
})
// privacy policy page 
router.get('/PrivacyPolicy',function(req,res,next){
  res.render('PrivacyPolicy', { title:'ArtisanAura Privacy Policy'});
});
 // single product page 
router.get('/productsingle', function(req,res,next){
  res.render('productsingle');
 });
// custom product page 
router.get('/customproduct', function(req,res,next){
  res.render('customproduct');
 });
// terms and conditions page
router.get('/termsConditions',function(req,res,next){
  res.render('termsConditions', { title:'ArtisanAura Terms and Conditions'});
});

// terms of service and privacy for user registration page
router.get('/termsService',function(req,res,next){
  res.render('termsService', { title:'Terms of Service and Privacy Policy'});
});

// about us page
router.get('/AboutUs', async function(req,res,next){
  try {
    var [products, fields] = await db.execute(
      `SELECT * FROM product ORDER BY id DESC;`
    );
    if (products.length === 0) {
      req.flash("error", `No products available`);
    }
    res.render('AboutUs', { title:'About ArtisanAura Jewelry',products: products, css:["newsletter.css","quiz.css","productspage.css"], js:["quiz.js"]});
  }catch (err) {
  console.error(err);
  res.status(500).send("Server error");
 }
});


// shop page
router.get('/Shop', async function(req,res,next){
    try {
      var [products, fields] = await db.execute(
        `SELECT * FROM product ORDER BY id DESC;`
      );
      if (products.length === 0) {
        req.flash("error", `No products available`);
      }
      res.render('Shop', { title:'Shop ArtisanAura Jewelry',products: products, css:["newsletter.css","quiz.css","productspage.css"], js:["quiz.js"]});
    }catch (err) {
    console.error(err);
    res.status(500).send("Server error");
   }
});


// Guides page
router.get('/Guides',function(req,res,next){
  res.render('Guides', { title:'Guides', css:["newsletter.css","quiz.css"], js:["quiz.js"]});
});
// Refund page
router.get('/Refund',function(req,res,next){
  res.render('Refund', { title:'Refund', css:["newsletter.css","quiz.css"], js:["quiz.js"]});
});

// Customer Service page
router.get('/CustomerSupport',function(req,res,next){
  res.render('CustomerSupport', { title:'Customer Support', css:["newsletter.css","quiz.css"], js:["quiz.js"]});
});

module.exports = router;
