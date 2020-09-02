const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const UserInfoController = require('../controllers/userInfoController.tsx');

// Mongo URI
const mongoURI = 'mongodb+srv://dbUser:YN8cDaSJksn8nro6@tmcluster.wbdpu.mongodb.net/UpdateTechLtdAssignment?retryWrites=true&w=majority';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);
console.log(mongoose.connection.readyState);
mongoose.set('debug', true);

// Init gfs
let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});



// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

router.get("/userInfo", UserInfoController.userInfo_get_all);
router.post("/userInfo", upload.single('file'), UserInfoController.userInfo_create);
router.post("/userInfo/:id", upload.single('file'), UserInfoController.update_userInfo_create);
router.post("/upload", upload.single('file'), UserInfoController.upload);
router.get("/files", UserInfoController.get_all_file);
router.get("/files/:filename", UserInfoController.get_single_file);
router.get("/image/:filename", UserInfoController.get_single_img);

module.exports = router;
