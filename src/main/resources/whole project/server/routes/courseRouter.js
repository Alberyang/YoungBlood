const courseRouter = require('express').Router();
const auth = require('./authRouter');
const mongoose = require('mongoose');

const Course = require('../models/courseModel');
const User = mongoose.model('User');
var _ = require('underscore');

const courseController = require('../controllers/courseController');
//1. create new course by given attribute
// 1) courseCode
// 2) courseName
// 3) description
// 4) state : default ongoing
// 5) related skills
// 6) grades: default Nah
// 7) external link to handbook
// 8) semenster/year             (year, enum(winter,summer,sem1,sem2))
// 9) core or not
// 10) xue fen 12.5 per level

courseRouter.post('/create/',auth.optional,(req,res)=>{
	courseController.createCourse(req, res);
});


//2. edit exist course by various
// if found -> edit
// else -> return no such course

courseRouter.post('/:id',auth.optional,(req,res)=>{
	courseController.updateCourse(req, res);
});
//3. get specific course by course id

courseRouter.get('/:id',auth.optional,(req,res)=>{
	courseController.getOneCourse(req, res);
});

//4., get all course classified by sem

courseRouter.get('/',auth.optional,(req,res)=>{
	courseController.getAllCourse(req, res);
});
//5. delete specific course

courseRouter.delete('/:id',auth.optional,(req,res)=>{
	courseController.deleteCourse(req, res);
})

module.exports = courseRouter;