const mongoose = require('mongoose');
const experienceRouter = require('express').Router();
const auth = require('./authRouter');

const Experience = require('../models/experienceModel');
const User = mongoose.model('User');

const experienceController = require('../controllers/experienceController');


experienceRouter.post('/create', auth.optional, (req,res)=>{
	experienceController.createExperience(req, res);
});


experienceRouter.get("/complete/:id",auth.optional, (req,res)=>{
	experienceController.completeExperience(req, res);
});

experienceRouter.get("/",auth.optional, async (req,res)=>{
	experienceController.getExperience(req, res);
});


experienceRouter.post('/update/:id', auth.optional, (req,res)=>{

	User.findById(req.payload.id)
      .then(async function (user) {
        
        let experience = await Experience.findOne({_id:req.params.id})
        if(typeof req.body.start_date != 'undefined'){
        	experience.start_date = new Date(req.body.start_date);
        }
        if(typeof req.body.end_date != 'undefined'){
        	experience.end_date = new Date(req.body.end_date);
        }
        if(typeof req.body.position != 'undefined'){
        	experience.position = req.body.position;
        }
        if(typeof req.body.company != 'undefined'){
        	experience.company = req.body.company;
    	}
    	if(typeof req.body.description != 'undefined'){
        	experience.description = req.body.description;
        }
        if(typeof req.body.state != 'undefined'){
          experience.state = req.body.state;
        }
        return experience.save().then(function () {
                return res.json(experience);
            });
      });

	experienceController.updateExperience(req, res);

});

experienceRouter.delete('/:id',auth.optional, (req,res)=>{
    experienceController.deleteExperience(req, res);
});

module.exports = experienceRouter;