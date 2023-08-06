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
  if (req.session.userId) {
    //logged in, continue 
    res.render('profile', {title:'Profile'});
    next();
  } else {
    // not logged in/timeout
    res.redirect('/login');
  }

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
// Order page
router.get('/order-status',function(req,res,next){
  res.render('orderStatus', { title:'Order Status'});
});

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
router.get('/Shop', async function(req, res, next){
  try {
      //for filtering
      let filterPrice = req.query.price;
      let filterType = req.query.type;
      let filterMaterial = req.query.material;
      let filterGemstone = req.query.gemstone;
      let sortPrice = req.query.sort_price;
      let min_price = req.query.min_price ? parseFloat(req.query.min_price) : null;
      let max_price = req.query.max_price ? parseFloat(req.query.max_price) : null;

        // all product data
      let query = "SELECT * FROM product";
      let queryParams = [];
            // conditions for each filter
      if (filterPrice || filterType || filterMaterial || filterGemstone) {
          query += " WHERE ";
          let conditions = [];

          if(filterPrice) {
              conditions.push("price <= ?");
              queryParams.push(parseFloat(filterPrice));
          }
          if(filterType) {
              conditions.push("type = ?");
              queryParams.push(filterType);
          }
          if(filterMaterial) {
              conditions.push("material LIKE ?");
              queryParams.push('%' + filterMaterial + '%');
          }
          if(filterGemstone) {
            conditions.push("gemstone LIKE ?");
            queryParams.push('%' + filterGemstone + '%');
          }

          if (min_price !== null && max_price !== null) {
            conditions.push("price >= ? AND price <= ?");
            queryParams.push(min_price, max_price);
        } else if (min_price !== null) {
            conditions.push("price >= ?");
            queryParams.push(min_price);
        } else if (max_price !== null) {
            conditions.push("price <= ?");
            queryParams.push(max_price);
        }

            //joins multiple conditions
          query += conditions.join(' AND ');
      }
        //edge, if price sort by it
      if(sortPrice) {
          query += ` ORDER BY price ${sortPrice}`;
      }
        //query occurs
      const [products, fields] = await db.execute(query, queryParams);

      if (products.length === 0) {
        return res.render('Shop', { error: 'No products available', products: [] });
      }//self explanatory ^^^
  
      return res.render('Shop', { products: products });

  } catch (err) {
      console.error(err);
      return res.status(500).send({ error: 'Server error' });
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

// Newsletter sign up
const {checkEmail, registerValidator} = require('../helpers/regValidation');

router.post('/Newsletter', async function(req,res,next){
  var newsletter_Id = req.params.id;
  var email = req.body.email;
  console.log(`newsletter_Id: ${newsletter_Id}, email: ${email}`);

  try {

    if(!checkEmail(email)){
      req.flash('error','Invaild email, Please give a vaild email address.');
      return req.session.save(function (error) {
        if(error) next(error);
        return res.redirect('/');
      });
    }

    const [existemail] = await db.execute(
      'SELECT * FROM newsletter WHERE email = ?',
      [email]
    );

    if (existemail.length > 0) {
      req.flash('error', 'This email is already subscribed to the newsletter.');
      return req.session.save(function (error) {
        if (error) next(error);
        return res.redirect(`/`);
      });
    }

    var [input, _] = await db.execute(
      "INSERT INTO newsletter (email) VALUES (?)",
      [email]
    );
    if (input && input.affectedRows) {
      req.flash("success", "Youve been added to the mailing list");
      return req.session.save(function (error) {
        if (error) next(error);
        return res.redirect(`/`);
      });
    } else {
      next(new Error("error occurred"));
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;