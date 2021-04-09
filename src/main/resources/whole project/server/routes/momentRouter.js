const mongoose = require('mongoose');
const momentRouter = require('express').Router();
const auth = require('./authRouter');
const momentController = require('../controllers/momentController');
const imageController = require('../controllers/imageController');

const Moment = mongoose.model('Moment');
const Image = mongoose.model('Image');
const User = mongoose.model('User');
const {upload} = imageController;

// upload a single photo to the database :/upload
momentRouter.post(
  '/upload/:moment_id',
  imageController.upload.array('files', 9),
  auth.optional,
  (req, res) => {
    User.findById(req.payload.id).then(function (user) {
      let imageUrlList = [];
	  console.log(req.files);
      req.files.map((file) => {
        imageUrlList.push(file.filename);
      });
      Moment.findByIdAndUpdate(req.params.moment_id, {images: imageUrlList}).then((moment) => {
		return res.json({state: "success"});  
	  });
    });
  }
);

// get all contents of an user :/
momentRouter.get('/', auth.optional, (req, res) => {
  momentController.getMoment(req, res);
});

// post a moment
momentRouter.post('/content', auth.optional, (req, res) => {
  momentController.createMoment(req, res);
});

// post a comment
momentRouter.post('/comment/:moment_id', auth.optional, (req, res) => {
  momentController.createComment(req, res);
});

// like a comment
momentRouter.post('/like/:moment_id', auth.optional, (req, res) => {
  momentController.like(req, res);
});

// delete a momment
momentRouter.delete('/:moment_id', auth.optional, (req, res) => {
  momentController.deleteOneMoment(req, res);
});

// delete a comment
momentRouter.delete('/comment/:moment_id/:comment_id', auth.optional, (req, res) => {
  momentController.deleteOneComment(req, res);
});


module.exports = momentRouter;
