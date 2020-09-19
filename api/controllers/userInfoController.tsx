const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
require('dotenv').config();

const UserInfo = require('../models/userInfo.tsx');

const uri = process.env.DB_PATH;

const mongoURI = uri;

// Create mongo connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// route GET /userInfo
// Display all userInfo
exports.userInfo_get_all = (req, res, next) => {
  UserInfo.find()
    .then(user => {
      console.log(user);
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    })
};





exports.userInfo_create = (req, res, next) => {
   const responses = (res, files, originalname, imgUrl) => {
	 req.body.imageUrl = imgUrl;
	 
	 const userInfo = new UserInfo({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		email: req.body.email,
		textField: req.body.TextField,
		image: req.body.imageUrl,
		selectedVal: req.body.select
	 });

	 userInfo.save()
		.then(result => {
		  console.log(result);
		  res.status(201).json({
			result: result,
			message: "User Info Created Successfully",
		  });
		})
		.catch(err => {
		  console.log(err);
		  res.status(500).json({
			error: err
		  });
	 });
   }
  
   get_img(res, req.files, req.files[0].filename, responses);
};

// route POST /userInfo/:id
// Update userInfo
exports.update_userInfo_create = (req, res, next) => {
  const id = req.params.id;
  
  const responses = (res, files, originalname, imgUrl) => {
	 req.body.imageUrl = imgUrl;
	 
	 UserInfo.update({ _id: id }, { $set: {
	   name: req.body.name,
       email: req.body.email,
       textField: req.body.TextField,
	   image: req.body.imageUrl,
       selectedVal: req.body.select
     } })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User Info updated"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  }
  
  get_img(res, req.files, req.files[0].filename, responses);
}

const get_img = (res, files, filename, callback) => {
  gfs.files.findOne({ filename: filename }, (err, file) => {
	//console.log(file);  
	  
    // Check if file
    if (!file || file.length === 0) {
      return 'No file exists';
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
	  
	  const bufs = [];
	  readstream.on('data', function (chunk) {
	    bufs.push(chunk);
	  });
	  readstream.on('end', function () {
	    const fbuf = Buffer.concat(bufs);
	    const base64 = fbuf.toString('base64');
		 
	    let finalFile = 'data:' + file.contentType + ';base64,' + base64;
		
		callback(res, files, filename, finalFile);
	  });
    } else {
		return 'Not an image';
    }
  });
}




// route POST /upload
// Upload files
exports.upload = (req, res, next) => {
  const responses = (res, files, originalname, finalFile) => {
	
	return res.json({ file: files, fileName: originalname, imgUrl: finalFile });
  }
  
  get_upload_img(req, res, responses);
};

// route POST /upload
// Upload files
exports.upload_img_database = (req, res, next) => {
  const responses = (res, files, originalname, finalFile) => {
	  //console.log({ file: files, fileName: originalname, imgUrl: finalFile });
	  return res.json({ file: files, fileName: originalname, imgUrl: finalFile });
  }
  
  get_upload_img(req, res, responses);
};

const get_upload_img = (req, res, callback) => {
  gfs.files.findOne({ filename: req.file.filename }, (err, file) => {
	  
    // Check if file
    if (!file || file.length === 0) {
      return 'No file exists';
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
	  
	  const bufs = [];
	  readstream.on('data', function (chunk) {
	    bufs.push(chunk);
	  });
	  readstream.on('end', function () {
	    const fbuf = Buffer.concat(bufs);
	    const base64 = fbuf.toString('base64');
		 
	    let finalFile = 'data:' + file.contentType + ';base64,' + base64;
		
		callback(res, req.file, req.file.originalname, finalFile);
	  });
    } else {
		return 'Not an image';
    }
  });
}





// route GET /files
// Display all files in JSON
exports.get_all_file = (req, res, next) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
};

// route GET /files/:filename
// Display single file object
exports.get_single_file = (req, res, next) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
};

// route GET /image/:filename
// desc Display Image From Database
exports.get_single_img = (req, res, next) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
	console.log(file);  
	  
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
	  
	  const bufs = [];
	  readstream.on('data', function (chunk) {
	    bufs.push(chunk);
	  });
	  readstream.on('end', function () {
	    const fbuf = Buffer.concat(bufs);
	    const base64 = fbuf.toString('base64');
	    //console.log(base64);
		 
	    let finalFile = 'data:' + file.contentType + ';base64,' + base64;          
	    res.json({title: 'Image File', message: 'Image loaded from MongoDB GridFS', imgurl: finalFile});
	  });
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
};

// route GET /image_on_browser/:filename
// desc Display Image On Browser
exports.get_single_img_on_browser = (req, res, next) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
};
