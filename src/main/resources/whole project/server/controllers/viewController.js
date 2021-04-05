const mongoose = require('mongoose');
const User = mongoose.model('User');
const Image = mongoose.model('Image');
const Experience = require('../models/experienceModel');
const conn = mongoose.createConnection(process.env.DATABASE);
let gfs;
const Grid = require('gridfs-stream');
const Pdf = require('../models/pdfModel');
const Course = require('../models/courseModel');
const Project = require('../models/projectModel')
conn.once('open',() => {
  //Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
})


const getViewUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(function (user) {

      if (!user) {
        return res.sendStatus(401).send('The user does not exist.');
      }

      return res.json(user.toAuthJSON());
    })
    .catch(next);
};

const getViewImages = (req,res) => {
  User.findById(req.params.id).then(function(user){
    if (!user) {
      return res.sendStatus(401).send('The user does not exist.');
    }
    Image.find({user: user._id, type: {$exists: false}})
      .then(function (images) {
        image_ids=[];
        image_captions=[];
        for (image of images){
          image_ids.push(image['fileId']);
          image_captions.push(image['caption']);
        };
        gfs.files.find({_id: {$in: image_ids}}).toArray((err, files) => {
          if (!files || files.length === 0) {
            return res.json({
              files: [],
            });
          }
          files.map((file) => {
            if (
              file.contentType === 'image/jpeg' ||
              file.contentType === 'image/png'
            ) {
              file.isImage = true;
            } else {
              file.isImage = false;
            }
          });
          const imgObj = [];
          for (i= 0; i < files.length;i++){
            if (files[i].isImage){
              // eslint-disable-next-line no-undef
              files[i].caption = image_captions[i];
              imgObj.push(files[i]);
            }
          }
          return res.json({files: imgObj});
        });
      });
  });
};

const getViewDocuments = (req,res) => {
  User.findById(req.params.id).then(function (user) {
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

const getViewAvatar = (req,res) => {
  User.findById(req.params.id).then(function(user){
    if (!user){
      return res.sendStatus(401).send('The user does not exist.');
    }
    Image.find({user: user._id, type: 'avatar'}).distinct('fileId').then(function(image){
      gfs.files.find({_id: {$in: image}}).toArray((err,files)=>{
        if(!files || files.length ===0){
          return res.json({
            files: false
          });
        }else{
          files.map(file=>{
            if(file.contentType ==="image/jpeg" || file.contentType === 'image/png')
            {
              file.isImage = true;
            } else {
              file.isImage = false;
            }
          });
          var imgObj = [];
          for(file of files){
            if(file.isImage){
              imgObj.push(file);
            }
          }
          return res.json({'files':imgObj});
        }
      });
    });
  });
};

const getViewExperiences = (req,res) => {
  User.findById(req.params.id).then(async function(theuser){
    const experiences = await Experience.find({user:theuser._id});
    if(experiences){
      return res.send(experiences);
    }else{
      return res.send([]);
    }
  });
}

var _ = require('underscore');

const getViewCourses = (req,res) => {
  User.findById(req.params.id).then(async (user)=>{
    const course = await Course.find({user:user});
    //console.log(_.groupBy(course,"year"));
    return res.json({"course":_.groupBy(course,"year")});
  })
}

const getViewProjects = (req,res) => {
  User.findById(req.params.id).then(async function (user) {
    var project = await Project.find({show_status:"public"});
    var isLiked = false;
    var result = [];
    var liked = [];
    for(ele of project){
      if(ele.user.toString() !== req.params.id.toString()){
        if(ele.likedBy){
          for(elem of ele.likedBy){
            if(elem.toString() === req.params.id.toString()){
              liked.push(ele);
              isLiked = true;
              break;
            }
          }
        }
        if(isLiked){
        }
        else{
          result.push(ele);
          isLiked = false;
        }

      }
    }
    const projects = await Project.find({user:user._id});
    if(projects){
      return res.json({"projects":projects,"result":result,"liked":liked});
    }else{
      return res.json({'projects':[],"result":result,"liked":liked});
    }
  });
}

const getViewProjectCondition = (req,res) => {
  User.findById(req.params.id).then(async function(user){
    var sql = {}
    sql.user = user;
    if(req.body.name){
      sql.name = req.body.name;
    }
    if(req.body.status){
      sql.status = req.body.status;
    }
    if(req.body.show_status){
      sql.show_status = req.body.show_status;
    }
    var projects = await Project.find(sql);
    if(req.body.sortBy){
      if(req.body.sortBy === "ascending"){
        projects.sort((a,b)=>b.updatedAt - a.updatedAt);
      }else{
        projects.sort((a,b)=>a.updatedAt - b.updatedAt);
      }
    }
    //console.log(projects);
    return res.json({"result":projects});
  });
}

const getViewProject = (req,res) => {
  User.findById(req.params.id).then(async function(user){
    const project = await Project.findOne({user:user._id,_id:req.params.project_id});
    if(project){
      return res.json({"project":project});
    }else{
      return res.status(401).send('No such project');
    }
  })
}
module.exports = {
  getViewUser,
  getViewImages,
  getViewDocuments,
  getViewAvatar,
  getViewExperiences,
  getViewCourses,
  getViewProjects,
  getViewProjectCondition,
  getViewProject
};