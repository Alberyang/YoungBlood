const mongoose = require('mongoose');
const passport = require('passport');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const path = require('path');
const User = mongoose.model('User');
const Moments = mongoose.model('Moment');
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
    Moments.find({user: user._id}).then(function (moments) {
      userMoments = moments.map((moment) => {
        return {
          user: userName,
          contents: moment.contents,
          created_time: moment.createdAt,
          comments: moment.comments,
          images: moment.images,
          like: moment.like,
        };
      });
      return res.json({moments: userMoments});
    });
  });
};

module.exports = {
  getMoment,
};
