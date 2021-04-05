const mongoose = require('mongoose');

const Course = require('../models/courseModel');
const User = mongoose.model('User');
var _ = require('underscore');

const createCourse = (req, res)=>{
	User.findById(req.payload.id).then((user)=>{
		var course = new Course(req.body);
		course.user = user;
		course.save();
		return res.json(course);
	});
};

const updateCourse = (req, res)=>{
	User.findById(req.payload.id).then(async (user)=>{
		const result = await Course.findOneAndUpdate({_id:req.params.id, user: user},req.body);
		const newOne = await Course.findOne({_id:req.params.id, user: user});
		if(newOne){
			return res.json(newOne);
		}else{
			return res.status(401).send('No such course.');
		}
		
	});
}
const getOneCourse = (req, res)=>{
	User.findById(req.payload.id).then(async (user)=>{
		const course = await Course.findOne({_id:req.params.id, user: user});
		if(course){
			return res.json({"course":course});
		}else{
			return res.json({});
		}
	});
};

const getAllCourse = (req, res)=>{
	User.findById(req.payload.id).then(async (user)=>{
		const course = await Course.find({user:user});
		//console.log(_.groupBy(course,"year"));
		return res.json({"course":_.groupBy(course,"year")});
	})
};
const deleteCourse = (req, res)=>{
	User.findById(req.payload.id).then(async (user)=>{
		const result = await Course.findOneAndDelete({_id:req.params.id, user: user});
		return res.json({"deleteId":req.params.id});
	});
}
module.exports = {
	createCourse,
	updateCourse,
	getOneCourse,
	getAllCourse,
	deleteCourse,
}