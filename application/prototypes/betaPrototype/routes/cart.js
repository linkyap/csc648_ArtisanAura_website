var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const Product = require('../db/products');

// Get product details
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
                let qty = item.quantity;
                subtotal += (Number(price) * Number(qty));
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

router.post('/checkout/:subtotal/:tax/:shipping/:total', (req, res, next) => {
    try {
        let { subtotal, tax, shipping, total } = req.params;
        if(subtotal === undefined) {
            req.flash('error', "Cart is empty");
            req.session.save(err => {
                res.redirect('back');
            });
        }
        else {
            res.render('checkout', {
                title: 'Checkout',
                subtotal: subtotal,
                tax: tax,
                shipping: shipping,
                total: total
            });
        }
    }
    catch (error) {
        next(error);
    }
    
});
router.post('/review/:subtotal/:tax/:shipping/:total', (req, res, next) => {
    let { subtotal, tax, shipping, total } = req.params;
    res.render('reviewOrder', {
        title: 'Review Order',
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        total: total
    });
});
// router.post('/place-order/:subtotal/:tax/:shipping/:total', (req, res, next) => {
//     let { subtotal, tax, shipping, total } = req.params;
//     res.render('reviewOrder', {
//         title: 'Review Order',
//         subtotal: subtotal,
//         tax: tax,
//         shipping: shipping,
//         total: total
//     });
// });
// Adds product to cart
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
// Increments quantity inside cart and adjusts price accordingly
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
// Decrements quantity inside cart and adjusts price accordingly
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
// Removes item from cart
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