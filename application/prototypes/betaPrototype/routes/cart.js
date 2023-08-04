var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const Product = require('../db/products');

async function getDetails(result) {
    let product = await Product.getProductById(result.product_id);
    return product[0];
}
// Shopping cart page
router.get('/cart-list', async (req, res, next) => {
    let sessionId = req.session.id;
    let results = await Product.getCart(sessionId);
    if (results && results.length > 0) {
        const cartList = await Promise.all(results.map(result => getDetails(result))); 
        if (cartList.length > 0) {
            let subtotal = 0;
            cartList.forEach(item => {
                let price = item.price;
                subtotal += price;
            });
            let tax = subtotal * .09;
            let shipping = 4.99;
            let total = subtotal + tax + shipping;
            res.render('cart', { 
                title: 'Shopping Cart', 
                results: cartList, 
                subtotal: subtotal.toFixed(2), 
                tax: tax.toFixed(2), 
                shipping: shipping.toFixed(2),
                total: total.toFixed(2)});
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