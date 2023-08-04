var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const Product = require('../db/products');

// Shopping cart page
router.get('/cart-list', async (req, res, next) => {
    let sessionId = req.session.id;
    let results = await Product.getCart(sessionId);
    if (results && results.length > 0) {
        const cartList = await Promise.all(results.map(result => Product.getProductById(result.product_id)));
        console.log("cartlist[0][0].id : " + cartList[0][0].id);
        console.log("cartlist[0][1].id : " + cartList[0][1].id);
        console.log("cartlist[1][0].title : " + cartList[1][0].title);
        console.log("cartlist[1][1].id : " + cartList[1][1].id);
        console.log("cartlist[0][2].title : " + cartList[0][2].title)
        console.log("cartList[0].keys: " + Object.keys(cartList[0]));
        if (cartList.length > 0) {
            res.render('cart', { title: 'Shopping Cart', results: cartList});
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