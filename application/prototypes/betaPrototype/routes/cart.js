var express = require('express');
const { validationResult } = require('express-validator');
var router = express.Router();
var db = require('../conf/database');
const Product = require('../db/products');
const Cart = require('../helpers/cartHelpers');
const {ckreview} = require('../helpers/ckval')


// Shopping cart page
router.get('/cart-list', async (req, res, next) => {
    let sessionId = req.session.id;
    let results = await Product.getCart(sessionId);
    if (results && results.length > 0) {
        let cartList = await Cart.getCartList(results);
        if (cartList.length > 0) {
            let costs = Cart.getTotals(cartList);
            res.render('cart', { 
                title: 'Shopping Cart', 
                results: cartList, 
                cost: costs
            });
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


router.get('/checkout', async (req, res, next) => {
    try {
        let sessionId = req.session.id;
        let results = await Product.getCart(sessionId);
        if (results && results.length > 0) {
            let cartList = await Cart.getCartList(results);
            if (cartList.length > 0) {
                let costs = Cart.getTotals(cartList);
                res.render('checkout', {
                    title: 'Checkout',
                    cost: costs,
                });
            }
        }

    }
    catch (error) {
        next(error);
    }
});

router.post('/checkout', async (req, res, next) => {
    try {
        let sessionId = req.session.id;
        let results = await Product.getCart(sessionId);
        if (results && results.length > 0) {
            let cartList = await Cart.getCartList(results);
            if (cartList.length > 0) {
                let costs = Cart.getTotals(cartList);
                res.render('checkout', {
                    title: 'Checkout',
                    cost: costs,
                });
            }
        }
        else {
            req.flash('error', "Cart is empty");
            req.session.save(err => {
                res.redirect('back');
            });
        }
    }
    catch (error) {
        next(error);
    }
});



router.post('/review', ckreview, async (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(error => error.msg).join(' '));
        return req.session.save(err=>{
            res.redirect('back');
        })
    }

    let inputs = req.body;
    let sessionId = req.session.id;
    let results = await Product.getCart(sessionId);
    if (results && results.length > 0) {
        let cartList = await Cart.getCartList(results);
        if (cartList.length > 0) {
            let costs = Cart.getTotals(cartList);
            res.render('reviewOrder', {
                title: 'Review Order',
                results: cartList,
                cost: costs,
                info: inputs,
            });
        }
    }
    else {
        req.flash('error', "Cannot move on to review");
        req.session.save(err => {
            res.redirect('back');
        });
    }
});


router.post('/place-order', async (req, res, next) => {
    try{
    
    let sessionId = req.session.id;
    let orderId = await Product.placeOrder(sessionId);

    await Product.clearCart(sessionId);//new added to remove only cart session
                //in product.js at bottom of model
    req.session.save(err => {
        if (err) {
            return next(err);
        }


    res.render('orderConfirm', {
            title: 'Order Confirmation',
            id: orderId
    });
});
} catch (error) {
    next(error);
}
});




// Adds product to cart
router.post('/add-item/:id', async (req, res, next) => {
    try {
        const productId = req.params.id;
        const sessionId = req.session.id;

        //validation for quantity and producy
    //--------------------------------------------
        //chk stock quantiy
        const product = await Product.getProductById(productId);

        if(!product){
            req.flash('error', 'Product not found');
            return res.redirect('back');
        }

        if(product.quantity<=0){
            req.flash('error', 'Product is out of stock at the moment');
            return req.session.save(err=> {
                res.redirect('back');
            });
        }
    //--------------------------------------------


        const addedProductId = await Product.addToCart(productId, sessionId);
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