// var express = require('express');
// var router = express.Router();
// var multer = require('multer');
// var sharp = require('sharp');
// var crypto = require('crypto');
// var db = require('../conf/database');

// var storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, "public/images");
//     },
//     filename: function(req, file, cb) {
//         let fileExt = file.mimetype.split('/')[1];
//         let randomName = crypto.randomBytes(22).toString("hex");
//         cb(null, `${randomName}.${fileExt}`);
//     }
// });

// var uploader = multer({storage: storage});
// router.post('/createProduct', uploader.single("uploadImage"), async (req, res, next) => {
//     let fileUploaded = req.file.path;
//     let fileAsThumbnail = `thumbnail-${req.file.filename}`;
//     let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
//     let { title, description, material, price } = req.body;

//     sharp(fileUploaded)
//         .resize(200)
//         .toFile(destinationOfThumbnail)
//         .then(async () => {
//             let sql =
//                 `INSERT INTO product 
//             (title, material, description, price, image, thumbnail) VALUE (?,?,?,?,?,?);`;
//             await db.execute(sql, [title, material, description, price, fileUploaded, destinationOfThumbnail]);
//             res.redirect('/');
//         });
// });
// module.exports = router;

var express = require('express');
var router = express.Router();
var multer = require('multer');
var sharp = require('sharp');
var crypto = require('crypto');
var db = require('../conf/database');

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: 'csc-648-848-team-05',
    keyFilename: 'googlestoreagekey.json',

});

// var storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, "public/images");
//     },
//     filename: function(req, file, cb) {
//         let fileExt = file.mimetype.split('/')[1];
//         let randomName = crypto.randomBytes(22).toString("hex");
//         cb(null, `${randomName}.${fileExt}`);
//     }
// });

// var uploader = multer({storage: storage});
var uploader = multer();

router.post('/createProduct', uploader.single("uploadImage"), async (req, res, next) => {
    let fileUploaded = req.file.buffer;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    // let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let { title, description, material, price } = req.body;

    sharp(fileUploaded)
        .resize(200)
        // .toFile(destinationOfThumbnail)
        .toBuffer() 
        .then(async (thumbnailBuffer) => {
             // Upload the original image to Google Cloud Storage
            const bucketName = 'artifacts.csc-648-848-team-05.appspot.com'; // bucket name
            const bucket = storage.bucket(bucketName);
            const gcsFileName = `images/${crypto.randomBytes(22).toString("hex")}-${req.file.originalname}`;

            await bucket.file(gcsFileName).save(fileUploaded, {
                 metadata: {
                     contentType: req.file.mimetype,
                     },
            });
        

            // Upload the thumbnail image to Google Cloud Storage
            const gcsThumbnailFileName = `thumbnails/${fileAsThumbnail}`;
            await bucket.file(gcsThumbnailFileName).save(thumbnailBuffer, {
                metadata: {
                    contentType: req.file.mimetype,
                },
            });

            let sql =
                `INSERT INTO product 
            (title, material, description, price, image, thumbnail) VALUE (?,?,?,?,?,?);`;
            await db.execute(sql, [title, material, description, price, fileUploaded, destinationOfThumbnail]);
            res.redirect('/');
        });
});
module.exports = router;
