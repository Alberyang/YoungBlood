const mongoose = require('mongoose');
const imageRouter = require('express').Router();
const auth = require('./authRouter');
const imageController = require('../controllers/imageController');

const Image = mongoose.model('Image');
const User = mongoose.model('User');
const {upload} = imageController;

// : /image...

// upload a single photo to the database :/upload

imageRouter.post(
  '/upload/:caption',
  imageController.upload.single('file'),
  auth.optional,
  (req, res) => {
    User.findById(req.payload.id).then(function (user) {
      const image = new Image(req.body);
      image.filename = req.file.filename;
      image.originalName = req.file.originalname;
      image.caption = req.params.caption;
      image.user = user;
      image.fileId = req.file.id;
      image.save();
      return res.json(image);
    });
  }
);

// get all image of an user :/
imageRouter.get('/', auth.optional, (req, res) => {
  imageController.getAllImage(req, res);
});

// get one image by filename :/:filename
imageRouter.get('/:filename', auth.optional, (req, res) => {
  imageController.getOneImage(req, res);
});

// delete image by filename /: filename
imageRouter.delete('/:id', auth.optional, (req, res) => {
  imageController.deleteImage(req, res);
});
module.exports = imageRouter;
