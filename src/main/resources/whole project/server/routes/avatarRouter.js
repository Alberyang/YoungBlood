const mongoose = require('mongoose');
const avatarRouter = require('express').Router();
const auth = require('./authRouter');
const imageController = require('../controllers/imageController');

const Image = mongoose.model('Image');
const User = mongoose.model('User');
const upload = imageController.upload;
const conn = mongoose.createConnection(process.env.DATABASE);
const Grid = require('gridfs-stream');
let gfs;
conn.once('open',() => {
    //Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

// : /image...

// upload a single photo to the database :/upload


avatarRouter.post('/upload',imageController.upload.single('file'),auth.optional, (req,res) => {
    User.findById(req.payload.id)
        .then(function (user) {
            Image.find({user: user._id, type: 'avatar'}).distinct('fileId').then(function(image){
                Image.deleteOne({user: user._id, fileId: image}, (err)=> {
                    if(err){
                        return res.status(404).json({err:"Relation does not exist"});
                    }
                    gfs.remove({_id:image, root: 'uploads'}, (err, gridsStore) =>{
                        if(err){
                            return res.status(404).json({err:err});
                        }
                    });
                });
            })
            const image = new Image(req.body);
            image.filename = req.file.filename;
            image.originalName = req.file.originalname;
            image.user = user;
            image.fileId = req.file.id;
            image.type = 'avatar';
            image.save();
            return res.json(image);
        });
});

//get all image of an user :/
avatarRouter.get('/',auth.optional, (req,res)=>{
    imageController.getAvatar(req, res);
});




module.exports = avatarRouter;