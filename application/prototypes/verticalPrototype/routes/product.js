var express = require('express');
var router = express.Router();
var multer = require('multer');
var sharp = require('sharp');
var crypto = require('crypto');
var db = require('../conf/database');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/images");
    },
    filename: function(req, file, cb) {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});

var uploader = multer({storage: storage});

router.post('/createProduct', uploader.single("uploadImage"), (req, res, next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let {title, type, material, description, price, size} = req.body;
    
    sharp(fileUploaded)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(async () => {
            // let image = fileUploaded;
            // let thumbnail = destinationOfThumbnail
            let sql = 
            `INSERT INTO product 
            (title, type, material, description, price, size, image, thumbnail, created_At) VALUE (?,?,?,?,?,?,?,?,now());`;
            return await db.execute(sql, [title, type, material, description, price, size, fileUploaded, destinationOfThumbnail]);
        })
});
module.exports = router;
