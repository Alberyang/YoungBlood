const projectRouter = require('express').Router();
const mongoose = require('mongoose');
const auth = require('./authRouter');
const User = mongoose.model('User');
const Project = require('../models/projectModel');
const projectController = require('../controllers/projectController');

//const projectController = ...


//create a project: how?, what is the input?
projectRouter.post('/create', auth.optional, function (req,res) {
	projectController.createProject(req, res);
});

//get all projets
projectRouter.get('/',auth.optional, function (req,res){
	projectController.getAllProject(req, res);
});

//get one specific projects
projectRouter.get('/:id',auth.optional, function (req,res){
	projectController.getOneProject(req, res);
});

//delete one specific projects -> why idd??
projectRouter.delete('/:idd',auth.optional, function (req,res){
	projectController.deleteOneProject(req, res);
});

//update on status? with what is param?
projectRouter.post('/update/:id',auth.optional, function (req,res){
	projectController.updateStatus(req, res);
});

//"<YYYY-mm-dd>"

//update a contributor name????

//add a contributor
projectRouter.post('/add_people/:id',auth.optional, function (req,res){
	projectController.addContributor(req, res);
});

//remove a contributor
projectRouter.post('/remove_people/:id',auth.optional, function (req,res){
	projectController.removeContributor(req, res);
});

//add one step for process??
projectRouter.post('/process/:id',auth.optional, function (req,res){
	projectController.addOneStep(req, res);
});

//remove a step of process??
projectRouter.post('/process/remove/:id',auth.optional, function (req,res){
	projectController.removeOneStep(req, res);
});

//update a step of process???
projectRouter.post('/process/update/:id',auth.optional, function (req,res){
	projectController.updateOneStep(req, res);
});

//c nodes
projectRouter.post('/process/node/:id',auth.optional, function (req,res){
	projectController.createNode(req, res);
});
//r nodes
//already there in get project

//u nodes
projectRouter.post('/process/node/update/:id',auth.optional, function (req,res){
	projectController.updateNode(req, res);
});
//d nodes
projectRouter.post('/process/node/remove/:id',auth.optional, function (req,res){
	projectController.deleteNode(req, res);
});

//finish nodes
projectRouter.post('/process/node/finish/:id',auth.optional,function (req,res){
	projectController.finishNode(req, res);
})

//project name/ status search
projectRouter.post('/conditional',auth.optional, function (req,res){
	projectController.conditionalSearch(req, res);
});

projectRouter.post('/like/:id',auth.optional,async (req,res)=>{
	projectController.loginLike(req, res);
});

projectRouter.post('/dislike/:id',auth.optional,async (req,res)=>{
	projectController.loginDislike(req, res);
});

projectRouter.post('/like/anoymous/:id',async (req,res)=>{
	projectController.anoymousLike(req, res);
});
//sort by last update


//c timeline
projectRouter.post('/timeline/:id',auth.optional, (req,res)=>{
	projectController.createTimeLine(req, res);

});
//r timeline
//u timeline
projectRouter.post('/timeline/update/:id',auth.optional, (req,res)=>{
	projectController.updateTimeLine(req, res);
});
//d timeline
projectRouter.post('/timeline/remove/:id',auth.optional, (req,res)=>{
	projectController.deleteTimeLine(req, res);
});
module.exports = projectRouter;
