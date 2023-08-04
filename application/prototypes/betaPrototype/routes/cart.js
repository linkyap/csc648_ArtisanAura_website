var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const Product = require('../db/products');

// Shopping cart page
router.get('/cart-list', async (req, res, next) => {
    let sessionId = req.session.id;
    let results = await Product.getCart(sessionId);
    if (results && results.length > 0) {
        // let cartList = [];
        // results.forEach(async result => {
        //     let productId = result.product_id;
        //     let product = await Product.getProductById(productId);
        //     cartList.push(product);
        // });
        let cartList = results.map(async result => await Product.getProductById(result.product_id));
        console.log("CartList : " + cartList);
        console.log("Cart length : " + cartList.length);
        if (cartList.length > 0) {
            res.render('cart', { title: 'Shopping Cart', results: cartList });
        }
        else {
            res.render('cart', { title: 'Shopping Cart' });
        }
    }
    else {
        res.render('cart', { title: 'Shopping Cart' });
    }
});

router.post('/add-custom-item', (req, res, next) => {
    req.flash('error', 'Failed to add to cart');
    req.session.save(err => {
        res.redirect('back');
    });
});

router.post('/checkout', (req, res, next) => {
    req.flash('error', 'Shopping cart is empty');
    req.session.save(err => {
        res.redirect('back');
    })
});

router.post('/add-item/:id', async (req, res, next) => {
    try {
        let productId = req.params.id;
        let sessionId = req.session.id;
        let addedProductId = await Product.addToCart(productId, sessionId);
        if (addedProductId > 0) {
            req.flash('success', "Added to cart");
            req.session.save(err => {
                res.redirect('back');
            });
        }
        else {
            req.flash("error", "Failed to add to cart");
            req.session.save(err => {
                res.redirect('back');
            });
        }
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;