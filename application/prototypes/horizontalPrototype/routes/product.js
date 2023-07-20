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
  keyFilename: 'googlestoragekey.json',
});

var uploader = multer();

router.post('/createProduct', uploader.single('uploadImage'), async (req, res, next) => {
  try {
    const { title, description, material, price } = req.body;

    // Save the image details in MySQL first to get the product ID
    const sql = `INSERT INTO product (title, material, description, price, image, thumbnail) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await db.execute(sql, [title, material, description, price, '', '']);
    
    // Get the product ID from the MySQL insert result
    // console.log('Result:', result);
    const productId = result[0].insertId;
    // console.log('ProductId:', productId);
    

    // Process the image using Sharp
    const sharpImage = sharp(req.file.buffer);
    const thumbnailBuffer = await sharpImage.resize(200).toBuffer();

    // Upload the original image to Google Cloud Storage set up
    const bucketName = 'artisan-aura-photo-bucket';
    const bucket = storage.bucket(bucketName);
    
    // //make image name crypto
    // const fileExt = req.file.mimetype.split('/')[1];
    // const randomName = crypto.randomBytes(22).toString('hex');
    // const gcsFileName = `product/${productId}/images/${randomName}.${fileExt}`;


     // Uploading the original image to Google Cloud Storage
    const gcsFileName = `product/${productId}/images/${req.file.originalname}`;
    await bucket.file(gcsFileName).save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    //make image public
    const file = bucket.file(gcsFileName);
    await file.makePublic();

    
    // Uploading the thumbnail image to Google Cloud Storage
    
    //// next line is for file name crypto
    // const fileAsThumbnail = `thumbnail-${randomName}.${fileExt}`;

    const fileAsThumbnail = `thumbnail-${req.file.originalname}`;
    const thumbnailFileName = `product/${productId}/thumbnails/${fileAsThumbnail}`;
    await bucket.file(thumbnailFileName).save(thumbnailBuffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    //make image public
    const thumbnailfile = bucket.file(thumbnailFileName);
    await thumbnailfile.makePublic();


    // Update the image details in MySQL with the correct image and thumbnail paths
    const updateSql = `UPDATE product SET image = ?, thumbnail = ? WHERE id = ?`;
    await db.execute(updateSql, [gcsFileName, thumbnailFileName, productId]);

    res.redirect('/');
  } catch (error) {
    // Handle any errors
    next(error);
  }
});
module.exports = router;