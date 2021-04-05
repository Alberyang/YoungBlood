const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const Pdf = require('../models/pdfModel');

const User = mongoose.model('User');

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

// get one Pdf by file name
const getOnePdf = (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No PDF file exists',
      });
    }

    // Check if pdf
    if (file.contentType === 'application/pdf') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not a PDF',
      });
    }
  });
};

const getAllPdf = (req, res) => {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401).send('The user does not exist.');
    }
    const result = [];
    Pdf.find({user: user._id}).then((pdfs) => {
      for (ele of pdfs) {
        result.push({
          _id: ele.fileId,
          originalname: ele.originalName,
          getFileLink: '/api/pdf/' + ele.filename,
          deleteFileLink: '/pdf/' + ele.fileId,
          updateFileLink: '/pdf/title/' + ele.fileId,
          date : ele.date,
          title: ele.title,
          isResume: ele.isResume,
        });
      }
      return res.json({pdfs: result});
    });
  });
};

const deletePdf = (req, res) => {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401).send('The user does not exist.');
    }

    Pdf.deleteOne({user: user._id, fileId: req.params.id}, (err) => {
      if (err) {
        return res.status(404).json({err: 'Relation does not exist'});
      }
      gfs.remove({_id: req.params.id, root: 'uploads'}, (err, gridsStore) => {
        if (err) {
          return res.status(404).json({err});
        }
      });
      return res.send(`Deleted${req.params.id}`);
    });
  });
};

const updateTitle = (req, res) =>{
  User.findById(req.payload.id).then(async function (user){
    if (!user) {
      return res.sendStatus(401).send('The user does not exist.');
    }
    console.log(req.body);
    const result = await Pdf.findOneAndUpdate({user: user._id, fileId: req.params.id},{'title': req.body.title});
    return res.send(result);
  });
}
module.exports = {
  upload,
  getOnePdf,
  getAllPdf,
  deletePdf,
  updateTitle,
  gfs,
};
