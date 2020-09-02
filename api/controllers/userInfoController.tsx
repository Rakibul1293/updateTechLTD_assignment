const mongoose = require("mongoose");
const User = require("../models/userInfo.tsx");

// route GET /userInfo
// Display all userInfo
exports.userInfo_get_all = (req, res, next) => {
  User.find()
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

// route POST /userInfo
// Store userInfo
exports.userInfo_create = (req, res, next) => {
  console.log(req.file.filename);
  const userInfo = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    textField: req.body.TextField,
    image: req.file.filename,
    selectedVal: req.body.select.value
  });
  console.log(userInfo);
  console.log(mongoose.connection.readyState);

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
};

// route POST /userInfo/:id
// Update userInfo
exports.update_userInfo_create = (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  User.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

// route POST /upload
// Upload files
exports.upload = (req, res, next) => {
  console.log(req.file.filename);
  res.json({ file: req.file });
};

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
// desc Display Image
exports.get_single_img = (req, res, next) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
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