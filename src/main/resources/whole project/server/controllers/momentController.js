const mongoose = require('mongoose');
const passport = require('passport');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const path = require('path');
const User = mongoose.model('User');
const Moment = mongoose.model('Moment');
const Image = mongoose.model('Image');

// file transfer database
const conn = mongoose.createConnection(process.env.DATABASE);
let gfs;
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// connect to storage
const storage = new GridFsStorage({
  url: process.env.DATABASE,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({storage});

// Get currently logged in user
const getMoment = (req, res) => {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401).send('The user does not exist.');
    }
    let userName = user.username;
    Moment.find({user: user._id}).then(function (moments) {
	  let momentsList = [];
	  for(let i = 0; i < moments.length; i++){
		  momentsList.push({
		  moment_id:moments[moments.length - i - 1]._id,
		  user_id:user._id,
          user: userName,
          contents: moments[moments.length - i - 1].contents,
          comments: moments[moments.length - i - 1].comments,
          images: moments[moments.length - i - 1].images,
          like: moments[moments.length - i - 1].like,
		  time: moments[moments.length - i - 1].createdAt 
		  });
	  }
	
      return res.json({moments: momentsList});
    });
  });
};

const createMoment = (req, res)=>{
	User.findById(req.payload.id).then(function (user) {
		if (!user) {
		  return res.sendStatus(401).send('The user does not exist.');
		}
		let moment = new Moment(req.body);
		moment.username = user.username;
		moment.user = user;
		moment.like = [];
		moment.comments = [];
		moment.images = [];
		moment.save().then((moment) => {
			return res.json({moment_id: moment._id});
		});
	});
};

const createComment = (req, res)=>{
	User.findById(req.payload.id).then(function (user) {
		if (!user) {
		  return res.sendStatus(401).send('The user does not exist.');
		}
		let userName = user.username;
		Moment.findOne({_id: req.params.moment_id}).then(function (moment) {
			let comments = moment.comments;
			const buf = crypto.randomBytes(16);
			const newId = buf.toString('hex');

			let newComment = {
				_id: newId, 
				user: user._id,
				username: user.username,
				contents: req.body.contents,
			}
			comments.push(newComment); 
			Moment.findByIdAndUpdate(req.params.moment_id, {comments: comments}).then((moment) => {
				return res.json({state: "success"}); 
			});
	  });
	});
};

const like = (req, res)=>{
	User.findById(req.payload.id).then(function (user) {
		if (!user) {
		  return res.sendStatus(401).send('The user does not exist.');
		}
		Moment.findOne({_id: req.params.moment_id}).then(function (moment) {
			let likeState = moment.like;
			let index = likeState.indexOf(user._id);
			if(req.body.operation === "dislike" && index !== -1){
				likeState.splice(index, 1);
			}else if(req.body.operation === "like" && index === -1){
				likeState.push(user._id);
			}
			Moment.findByIdAndUpdate(req.params.moment_id, {like: likeState}).then((moment) => {
				return res.json({state: "success"}); 
			});
	  });
	});
};

// delete a specific moment 
const deleteOneMoment = (req, res) => {
	User.findById(req.payload.id).then(function (user) {
		if (!user) {
		  return res.sendStatus(401).send('The user does not exist.');
		}
		Moment.findOne({_id: req.params.moment_id}).then(function (moment) {
			let images_name = moment.images;
			images_name.map((filename) => {
				gfs.remove({filename: filename}, function(err){
				  if (err) return false;
				  return true;          
				})
			})
			Moment.remove({_id: req.params.moment_id}).then((moment) => {
				return res.json({state: "success"});
			})
		})
	})
}

// delete a specific comment
const deleteOneComment = (req, res) => {
	User.findById(req.payload.id).then(function (user) {
		if (!user) {
		  return res.sendStatus(401).send('The user does not exist.');
		}
		Moment.findOne({_id: req.params.moment_id}).then(function (moment) {
			let comments = moment.comments;
			let newComments = comments.filter((item) => {
				return item._id !== req.params.comment_id;
			})
			Moment.findByIdAndUpdate(req.params.moment_id, {comments: newComments}).then((moment) => {
				return res.json({state: "success"}); 
			});
		});
	})
}

module.exports = {
  getMoment,
  createMoment,
  createComment,
  deleteOneMoment,
  deleteOneComment,
  like
};
