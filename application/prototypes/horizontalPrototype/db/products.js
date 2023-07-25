var db = require('../conf/database');
const Product = {}

Product.getProductById = (productId) => {
    let query = `SELECT * FROM product WHERE id=?`;
    return db.execute(query, [productId])
    .then (([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err))
};

module.exports = Product;