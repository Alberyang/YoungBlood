const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const conn = mongoose.createConnection(process.env.DATABASE);
let gfs;
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

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
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({storage});

// get all files
const getAllFile = (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      });
    }

    res.json(files);
  });
};

// get one specific file
const getOneFile = (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists',
      });
    }
    // File exists
    return res.json(file);
  });
};

// delete one file by file id
const deleteOneFile = (req, res) => {
  gfs.remove({_id: req.params.id, root: 'uploads'}, (err, gridsStore) => {
    if (err) {
      return res.status(404).json({err});
    }

    return res.send(`Deleted${req.params.id}`);
  });
};
module.exports = {
  getAllFile,
  getOneFile,
  deleteOneFile,
};
