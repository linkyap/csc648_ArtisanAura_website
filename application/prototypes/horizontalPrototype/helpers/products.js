const {getProductById} = require('../db/products');

const getProduct = async (req, res, next) => {
    try{
        let productId = req.params.id;
        let results = await getProductById(productId);
        if(results && results.length){
            res.currentProduct = results[0];
            next();
        }
        else{
            req.flash("error", "Product not found");
            res.redirect('/');
        }
    }
    catch (error){
        next(error);
    }
}

module.exports = getProduct;