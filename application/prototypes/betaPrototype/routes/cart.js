var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const Product = require('../db/products');

// Shopping cart page
router.get('/cart-list', async (req, res, next) => {
    let sessionId = req.session.id;
    let results = await Product.getCart(sessionId);
    if (results && results.length > 0) {
        res.render('cart', { title: 'Shopping Cart', results: results});
    }
    else{
        res.render('cart', { title: 'Shopping Cart'});
    }
});

router.post('/add-custom-item', (req, res, next) => {
    req.flash('error', 'Failed to add to cart');
    req.session.save(err => {
        res.redirect('/customproduct');
    });
});

router.post('/checkout', (req, res, next) => {
    req.flash('error', 'Shopping cart is empty');
    req.session.save(err => {
        res.redirect('/cart');
    })
});

router.post('/add-item', async (req, res, next) => {
    try {
        console.log("TESTING");
        let productId = req.params.id;
        console.log("PRODUCT ID: " + productId);
        let sessionId = req.session.id;
        console.log("SESSION ID: " + sessionId);
        // let addedProductId = await Product.addToCart(productId, sessionId);
        // if (addedProductId > 0) {
        //     req.flash('success', "Added to cart");
        //     req.session.save(err => {
        //         res.redirect('/product/:id');
        //     });
        // }
        // else {
        //     req.flash("error", "Failed to add to cart");
        //     req.session.save(err => {
        //         res.redirect('/product/:id');
        //     });
        // }
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;