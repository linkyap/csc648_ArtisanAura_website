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
        // Get product details 
        const cartList = await Promise.all(results.map(async result => {
            const product = await getDetails(result);
            return {
                ...product, 
                quantity: result.quantity
            };
        })); 
        if (cartList.length > 0) {
            let subtotal = 0;
            cartList.forEach(item => {
                // Calculates subtotal by getting sum of prices
                let price = item.price;
                subtotal += Number(price);
            });
            let tax = Number(subtotal * .09);
            let shipping = 4.99;
            let total = subtotal + tax + shipping;

            res.render('cart', { 
                title: 'Shopping Cart', 
                results: cartList, 
                subtotal: subtotal.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), 
                tax: tax.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}), 
                shipping: shipping.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}),
                total: total.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}
            );
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
router.post('/inc-qty/:id', async (req, res, next) => {
    try {
        let productId = req.params.id;
        let sessionId = req.session.id;
        let addedProductId = await Product.addToCart(productId, sessionId);
        if (addedProductId > 0) {
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
router.post('/dec-qty/:id', async (req, res, next) => {
    try {
        let productId = req.params.id;
        let sessionId = req.session.id;
        let removedProductId = await Product.removeOneFromCart(productId, sessionId);
        if (removedProductId > 0) {
            req.session.save(err => {
                res.redirect('back');
            });
        }
        else {
            req.flash("error", "Failed to decrease quantity of product");
            req.session.save(err => {
                res.redirect('back');
            });
        }
    }
    catch (error) {
        next(error);
    }
});
router.post('/remove/:id', async (req, res, next) => {
    try {
        let productId = req.params.id;
        let sessionId = req.session.id;
        let removedProductId = await Product.removeFromCart(productId, sessionId);
        if (removedProductId > 0) {
            req.session.save(err => {
                res.redirect('back');
            });
        }
        else {
            req.flash("error", "Failed to remove product from cart");
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