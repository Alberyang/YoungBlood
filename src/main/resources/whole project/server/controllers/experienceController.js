const mongoose = require('mongoose');
const Experience = require('../models/experienceModel');
const User = mongoose.model('User');

const createExperience = (req, res)=>{
	User.findById(req.payload.id)
      .then(function (user) {
        
        const experience = new Experience();
        experience.start_date = new Date(req.body.start_date);
        experience.end_date = new Date(req.body.end_date);
        experience.user = user;
        experience.position = req.body.position;
        experience.company = req.body.company;
        experience.description = req.body.description;
        experience.state = req.body.state;
        experience.save();
        return res.json(experience);
      }).catch();
};

const completeExperience = (req, res)=>{
	Experience.findOne({_id: req.params.id}).then(function(experience){
		if(!experience){
			return res.status(401).send('The experience does not exist.');
		}
		experience.end_date = new Date();
		experience.state = "end";
		return experience.save().then(function () {
            return res.json(experience);
        });

	})
};
const getExperience = async (req, res) =>{
	User.findById(req.payload.id).then(async function(theuser){
		const experiences = await Experience.find({user:theuser._id});
		if(experiences){
			return res.send(experiences);
		}else{
			return res.send([]);
		}
	});
};

const updateExperience = (req, res) =>{
	User.findById(req.payload.id)
      .then(async function (user) {
        
        let experience = await Experience.findOne({_id:req.params.id})
        if(typeof req.body.start_date != 'undefined'){
        	experience.start_date = new Date(req.body.start_date);
        }
        if(typeof req.body.end_date != 'undefined'){
        	experience.end_date = new Date(req.body.start_date);
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
};

const deleteExperience = (req, res)=>{
	User.findById(req.payload.id).then(async function (user){
        let result = await Experience.deleteOne({user:req.payload.id, _id:req.params.id}, (err)=>{
            if(err){
                return res.status(404).json({err:'experience does not exist'});
            }else{
                return res.json({"deleteId":req.params.id});
            }
        });
    });
};
module.exports = {
	createExperience,
	completeExperience,
	getExperience,
	updateExperience,
	deleteExperience,
}