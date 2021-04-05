const mongoose = require('mongoose');
const User = mongoose.model('User');
const Project = require('../models/projectModel');

const createProject = (req, res) =>{
	if(req.body.name){
		User.findById(req.payload.id).then(async function (user) {
	        const project = new Project(req.body);
	        if(!req.body.description){
	        	project.description = '';
	        }
	        project.user = user;
	        project.contributors = [user.username];
	        project.skills = [];
	        project.process = [];
	        /*
	        project.timeline = [{
	        	"date": new Date(),
	        	"description": "Project created"
	        }];
	        */
	        project.timeline = [];
	        project.rating = 0;
	        project.likedBy = [];
	        await project.save();
	        return res.json(project);
	      });
	}else{
		return res.send("Project Name not Provided.");
	}
};

const getAllProject = (req, res) =>{
	User.findById(req.payload.id).then(async function (user) {
		/*var project = await Project.find({show_status:"public"});
		var isLiked = false;
		var result = [];
		var liked = [];
		for(ele of project){
			if(ele.user.toString() != req.payload.id.toString()){
				if(ele.likedBy){
					for(elem of ele.likedBy){
						if(elem.toString() == req.payload.id.toString()){
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
		}*/
        const projects = await Project.find({user:user._id});
        /*
        if(projects){
        	return res.json({"projects":projects,"result":result,"liked":liked});
    	}else{
    		return res.json({'projects':[],"result":result,"liked":liked});
    	}*/
    	return res.json({"projects":projects});
    });
};

const getOneProject = (req,res) =>{
	User.findById(req.payload.id).then(async function(user){
		const project = await Project.findOne({user:user._id,_id:req.params.id});
		if(project){
			return res.json({"project":project});
		}else{
			return res.status(401).send('No such project');
		}
	})
};
const deleteOneProject = (req, res)=>{
	User.findById(req.payload.id).then(async function (user){
		const deleteProject = await Project.deleteOne({user:user._id,_id:req.params.idd},(err)=>{
			if(err){
                return res.status(501).json({err:'Failed when delete project'});
            }else{
				//console.log(req.params.idd);
                return res.json({"deleteId":req.params.idd});
            }
		});
		
	});
};
const updateStatus = (req, res)=>{
	try{
	User.findById(req.payload.id).then(async function (user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		if (typeof req.body.name !== 'undefined') {
        	project.name = req.body.name;
      	}
      	if(typeof req.body.skills !== 'undefined'){
      		project.skills = req.body.skills;
      	}
      	if(typeof req.body.description !== 'undefined'){
      		project.description = req.body.description;
      	}
      	if(typeof req.body.status !== 'undefined'){
      		project.status = req.body.status;
      	}
      	if(typeof req.body.show_status !== 'undefined'){
      		project.show_status = req.body.show_status;
      	}

		//var project = await Project.findOne({user:user._id,_id:req.params.id});
		/*
		if(project.status == "Completed"){
			project.timeline.push({
				"date": new Date(),
				"description": "Project completed."
			});
		}else if(project.status = "Cancel"){
			project.timeline.push({
				"date" : new Date(),
				"description": "Project canceled."
			});
		}else{
			project.timeline.push({
				"date" : new Date(),
				"description": "Project updated."
			});
		}*/
		project.save();
		return res.json({"result":project});
	});
	}catch(err){
		console.log(err);
	}
};
const addContributor = (req, res)=>{
	User.findById(req.payload.id).then(async function (user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		if(!project){
			return res.sendStatus(401).send('No such project');
		}
		for(ele of req.body.new_users){
			if(!project.contributors.includes(ele)){
				project.contributors.push(ele);
			}
		}
		project.save();
		return res.json(project);
	});
};
const removeContributor = (req, res)=>{
	User.findById(req.payload.id).then(async function (user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		for(ele of req.body.old_users){
			
			if(project.contributors.includes(ele)){
				project.contributors.splice(project.contributors.indexOf(ele),1);
			}
		}
		project.save();
		return res.json(project);
	});
};
const addOneStep = (req, res)=>{
	User.findById(req.payload.id).then(async function (user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		const newProcess = {
			"processNum":parseInt(req.body.process.processNum),
			"description": req.body.process.description,
			"status": req.body.process.status,
			"nodes": []
		};
		if(newProcess.processNum > (project.process.length + 1)){
			newProcess.processNum = project.process.length + 1;
		}
		if(newProcess.processNum == (project.process.length + 1)){
			project.process.push(newProcess);
			/*
			project.timeline.push({
				"date":new Date(),
				"description":"Process " + newProcess.processNum + " created."
			});
			*/
			project.save();
			return res.json(project);
		}else{
			for(ele of project.process){
				if(ele.processNum >= newProcess.processNum){
					ele.processNum = ele.processNum + 1;
				}
			}
			project.process.push(newProcess);
			project.process.sort((a,b)=> a.processNum - b.processNum);
			/*
			project.timeline.push({
				"date":new Date(),
				"description":"Process " + newProcess.processNum + " inserted."
			})
			*/
			project.save();
			return res.json(project);


		}
	})
};

const removeOneStep = (req, res)=>{
	User.findById(req.payload.id).then(async function (user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		const processNum = parseInt(req.body.processNum);
		if(processNum <= project.process.length){
			project.process.splice((processNum-1),1);
			for(ele of project.process){
				if(ele.processNum > processNum){
					ele.processNum = ele.processNum -1;
				}
			}
			/*
			project.timeline.push({
				"date":new Date(),
				"description": "Process " + processNum + " removed."
			});
			*/
			project.save();
			return res.json(project);
		}
	})
};
const updateOneStep = (req, res)=>{
	User.findById(req.payload.id).then(async function (user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		const processNum = parseInt(req.body.processNum);
		var toComplete = false;
		if(processNum <= project.process.length){

			if(req.body.description){
				project.process.sort((a,b)=> a.processNum - b.processNum)[processNum-1]['description'] = req.body.description;
			}

			if(req.body.status){
				/*
				if(project.process.sort((a,b)=> a.processNum - b.processNum)[processNum-1].status == "incomplete" && req.body.status == "complete"){
					toComplete = true;
				}
				*/
				project.process.sort((a,b)=> a.processNum - b.processNum)[processNum-1].status = req.body.status;
			}
			/*
			if(toComplete){
				project.timeline.push({
					"date" : new Date(),
					"description": "Process " + processNum + " completed."
				});	
			}else{
				project.timeline.push({
					"date" : new Date(),
					"description": "Process " + processNum + " updated."
				});
			}*/
			project.save();
			return res.json(project);
		}
	});
};
const createNode = (req, res)=>{
	User.findById(req.payload.id).then(async function(user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		if(req.body.processNum && (req.body.processNum <= project.process.length)){
			
			project.process[req.body.processNum - 1].nodes.push({
				"description": req.body.description,
				"state": false,
				"index": project.process[req.body.processNum - 1].nodes.length + 1
			});
			project.markModified('process');
			project.save();
			return res.json(project);
		}else{
			console.log("Index invalid");
			return res.send("Invalid Index");
		}
	});
};
const updateNode = (req, res)=>{
	User.findById(req.payload.id).then(async function(user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		if(req.body.processNum && (req.body.processNum <= project.process.length)){
			if(req.body.description){
				project.process[req.body.processNum - 1].nodes.find(ele => ele.index == req.body.nodeIndex).description = req.body.description;	
			}
			project.markModified('process');
			project.save();
			return res.json(project);
		}else{
			console.log("Index invalid");
			return res.send("Invalid Index");
		}
	});
};

const deleteNode = (req, res)=>{
	User.findById(req.payload.id).then(async function(user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		if(req.body.processNum && (req.body.processNum <= project.process.length)){
			if(req.body.nodeIndex && req.body.nodeIndex <= project.process[req.body.processNum-1].nodes.length){
				for(index in project.process[req.body.processNum-1].nodes){
					if(project.process[req.body.processNum-1].nodes[index].index == req.body.nodeIndex){
						project.process[req.body.processNum-1].nodes.splice(index,1);
					}
					
				}
				for(index in project.process[req.body.processNum-1].nodes){
					if (project.process[req.body.processNum-1].nodes[index].index > req.body.nodeIndex){
						project.process[req.body.processNum-1].nodes[index].index = project.process[req.body.processNum-1].nodes[index].index -1;
					}
				}
				project.markModified('process');
				project.save();

				return res.json(project);
			}
		}
	});
};
const finishNode = (req, res)=>{
	User.findById(req.payload.id).then(async function(user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		if(req.body.processNum && (req.body.processNum <= project.process.length)){
			if(req.body.nodeIndex && req.body.nodeIndex <= project.process[req.body.processNum-1].nodes.length){
				for(index in project.process[req.body.processNum-1].nodes){
					if(project.process[req.body.processNum-1].nodes[index].index == req.body.nodeIndex){
						if(req.body.state == true){
							project.process[req.body.processNum-1].nodes[index].state = true;
						}else if(req.body.state ==false){
							project.process[req.body.processNum-1].nodes[index].state = false;
						}
					}
					
				}
				var allDone = true;
				for(index in project.process[req.body.processNum-1].nodes){
					if(!project.process[req.body.processNum-1].nodes[index].state){
						allDone = false;
						break;
					}
				}
				/*
				if(allDone){
					project.process[req.body.processNum-1].status = "complete";
					project.timeline.push({
					"date" : new Date(),
					"description": "Process " + req.body.processNum + " completed."
				});	
				}*/
				project.markModified('process');
				//project.markModified('timeline');
				project.save();
				return res.json(project);

			}
		}
	});
};

const conditionalSearch = (req, res)=>{
	User.findById(req.payload.id).then(async function(user){
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
			if(req.body.sortBy == "ascending"){
				projects.sort((a,b)=>b.updatedAt - a.updatedAt);
			}else{
				projects.sort((a,b)=>a.updatedAt - b.updatedAt);
			}
		}
		//console.log(projects);
		return res.json({"result":projects});
	});
};
const loginLike = async (req, res)=>{
		var project = await Project.findOne({_id:req.params.id});

		var user = await User.findById(req.payload.id);
		if(project && user){
			if(project.user.equals(user._id)){
				//console.log("Can't rate yourselfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
				//console.log("Can't rate yourself");
				return res.json({"state":false,"err":"Can not rate your self."});
			} else{
				project.rating = project.rating + 1;
				project.likedBy.push(req.payload.id);
				project.save();
			}
			return res.json({"state":true,"new_rate":project.rating});
		}
};

const loginDislike = async (req, res)=>{
		var project = await Project.findOne({_id:req.params.id});

		var user = await User.findById(req.payload.id);
		if(project && user){
			if(project.user.equals(user._id)){
				//console.log("Can't rate yourself");
				return res.json({"state":false,"err":"Can not rate your self."});
			} else{
				for(index in project.likedBy){
					console.log("herererererererer");
					console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
					console.log(project.likedBy[index]);
					
					if(project.likedBy[index] == user._id.toString()){
						project.likedBy.splice(index,1);
						project.rating = project.rating - 1;
						project.save();
						break;
					}
				}
			}
			return res.json({"state":true,"new_rate":project.rating});
		}
};
const anoymousLike = async (req, res)=>{
	var project = await Project.findOne({_id:req.params.id});
	if(project){
		project.rating = project.rating + 1;
		project.save();
		return res.json({"state":true,"new_rate":project.rating});
	}
};
const createTimeLine = (req, res)=>{
	User.findById(req.payload.id).then(async function(user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		if(!project){
			return res.status(400).send('No such Project');
		}else{
			if(typeof req.body.time == 'undefined' || typeof req.body.description == 'undefined'){
				return res.status(400).send('Insufficient Params');
			}else{
				project['timeline'].push({
					'time': new Date(req.body.time.year, req.body.time.month, req.body.time.day, 0, 0, 0,0),
					'description': req.body.description
				})
				//console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
				//console.log(project.timeline);
				project.timeline.sort((a,b)=> ((new Date(a.time)).getTime() - (new Date(b.time)).getTime()));
				let inde = 0;
				for(inde in project.timeline){
					project['timeline'][inde]['index'] = parseInt(inde) + 1;
				}
				project.save();
				return res.json(project);
			}
		}
	});
}
const updateTimeLine = (req, res)=>{
	User.findById(req.payload.id).then(async function(user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		if(!project){
			return res.status(400).send('No such Project');
		}else{
			if(req.body.description){
				project.timeline[req.body.index-1]['description'] = req.body.description;
			}
			if(req.body.time){
				//project.timeline[req.body.index-1]['time'] = new Date(req.body.time.year, req.body.time.month, req.body.time.day, req.body.time.hr, req.body.time.min, req.body.time.sec, req.body.time.minsec);
				project.timeline[req.body.index-1]['time'] = new Date(req.body.time.year, req.body.time.month, req.body.time.day, 0, 0, 0, 0);
			}
			project.timeline.sort((a,b)=> ((new Date(a.time)).getTime() - (new Date(b.time)).getTime()));
				let inde = 0;
				for(inde in project.timeline){
					project['timeline'][inde]['index'] = parseInt(inde) + 1;
				}
			project.save();
			return res.json(project);
		}
	});
};

const deleteTimeLine = (req, res)=>{
	User.findById(req.payload.id).then(async function(user){
		var project = await Project.findOne({user:user._id,_id:req.params.id});
		if(!project){
			return res.status(400).send('No such Project');
		}else{
			if(!req.body.index || req.body.index > project.timeline.length){
				return res.status(400).send('Bad Index');
			}
			project.timeline.splice(req.body.index-1,1);
			let inde = 0;
			for(inde in project.timeline){
				project['timeline'][inde]['index'] = parseInt(inde) + 1;
			}
			//console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
			//console.log(project.timeline);
			project.save();
			return res.json(project);
		}
	});
};

const getOthers = (req, res)=>{
	User.findById(req.payload.id).then(async function(user){
		var project = await Project.find({show_status:"public"});
		var result = [];
		for(ele of project){
			if(project.user.toString() != req.payload.id.toString()){
				result.push(ele);
			}
		}
		return res.json({"projects":result});
	});
}
module.exports = {
	createProject,
	getAllProject,
	getOneProject,
	deleteOneProject,
	updateStatus,
	addContributor,
	removeContributor,
	addOneStep,
	removeOneStep,
	updateOneStep,
	createNode,
	updateNode,
	deleteNode,
	finishNode,
	conditionalSearch,
	loginLike,
	loginDislike,
	anoymousLike,
	createTimeLine,
	updateTimeLine,
	deleteTimeLine,
}
