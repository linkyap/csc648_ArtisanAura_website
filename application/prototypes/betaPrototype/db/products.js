var db = require('../conf/database');
const Product = {}

Product.getProductById = (productId) => {
    let query = `SELECT * FROM product WHERE id=?`;
    return db.execute(query, [productId])
    .then (([results, fields]) => {
        return Promise.resolve(results[0]);
    })
    .catch((err) => Promise.reject(err));
};
Product.addToCart = (productId, sessionId) => {
    let query = `INSERT INTO cart (product_id, sessions_id) VALUES (?,?);`;
    return db.execute(query, [productId, sessionId])
    .then (([results, fields]) => {
        if(results && results.affectedRows) {
            return Promise.resolve(results.insertId);
        }
        else{
            return Promise.resolve(-1);
        }
    })
    .catch((err) => Promise.reject(err));
}
Product.getCart = (sessionId) => {
    let query = `SELECT * FROM cart WHERE sessions_id=?`;
    return db.execute(query, [sessionId])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};
module.exports = Product;