import React, {Component, Fragment} from 'react';
import axios from '../../helpers/axiosConfig';



class Test extends Component{
	


	constructor(props) {
    	super(props);
    	this.onFormSubmit = this.onFormSubmit.bind(this);
    	this.getAllProject = this.getAllProject.bind(this);
    	this.componentDidMount = this.componentDidMount.bind(this);
    	this.getOneProject = this.getOneProject.bind(this);
    	this.deleteOneProject = this.deleteOneProject.bind(this);
    	this.onFormUpdate = this.onFormUpdate.bind(this);
    	this.onUserUpdate = this.onUserUpdate.bind(this);
    	this.onUserDelete = this.onUserDelete.bind(this);
    	this.onProcessCreate = this.onProcessCreate.bind(this);
    	this.onProcessDelete = this.onProcessDelete.bind(this);
    	this.onProcessUpdate = this.onProcessUpdate.bind(this);
    	this.onCreateNode = this.onCreateNode.bind(this);
    	this.onUpdateNode = this.onUpdateNode.bind(this);
    	this.onDeleteNode = this.onDeleteNode.bind(this);
    	this.onFinishNode = this.onFinishNode.bind(this);
    	this.conditionalSearch = this.conditionalSearch.bind(this);

		this.likeOtherProject = this.likeOtherProject.bind(this);
		this.createTimeLine = this.createTimeLine.bind(this);
  	}

	onFormSubmit(e){
		e.preventDefault();
		
		let formD = {
			"name":document.forms.namedItem("testCreate")["name"]["value"],
			"description":document.forms.namedItem("testCreate")["description"]["value"],
			"status":document.forms.namedItem("testCreate")["status"]["value"],
			"show_status":document.forms.namedItem("testCreate")["show_status"]["value"]
		}

		axios.post('/project/create', formD);
	}

	getOneProject(e){
		e.preventDefault();
		const urlGetOne = '/project/' + document.forms.namedItem("testOne")["id"]["value"];
		axios.get(urlGetOne).then((res)=>alert(JSON.stringify(res.data['project'])));
	}

	deleteOneProject(e){
		e.preventDefault();
		const urlDelete = '/project/' + document.forms.namedItem("deleteOne")["id"]["value"];
		axios.delete(urlDelete);
		alert("delete successful");
	}

	getAllProject(e){
		e.preventDefault();
		axios.get('/project/').then((res) => alert(JSON.stringify(res.data['projects'])));
	}

	onFormUpdate(e){
		e.preventDefault();
		let formD = {
			"status":document.forms.namedItem("testUpdate")["status"]["value"],
			"show_status":document.forms.namedItem("testUpdate")["show_status"]["value"]
		}
		if(document.forms.namedItem("testUpdate")["name"]["value"].trim() !== ""){
			//alert(document.forms.namedItem("testUpdate")["name"]["value"]);
			formD['name'] = document.forms.namedItem("testUpdate")["name"]["value"].trim();
		}
		if(document.forms.namedItem("testUpdate")["description"]["value"].trim() !== ""){
			formD['description'] = document.forms.namedItem("testUpdate")["description"]["value"].trim();
		}
		//alert(JSON.stringify(formD));
		const reqUrl = '/project/update/' + document.forms.namedItem("testUpdate")["id"]["value"];
		const result = axios.post(reqUrl,formD);
	}

	onUserUpdate(e){
		e.preventDefault();
		const names = document.forms.namedItem("userUpdate")["names"]["value"].split(',');
		const updateUrl = 'project/add_people/' + document.forms.namedItem("userUpdate")["id"]["value"];
		axios.post(updateUrl, {'new_users':names});
	}

	onUserDelete(e){
		e.preventDefault();
		const names = document.forms.namedItem("userDelete")["names"]["value"].split(',');
		const deleteUrl = 'project/remove_people/' + document.forms.namedItem("userDelete")["id"]["value"];
		axios.post(deleteUrl, {'old_users':names});
	}

	onProcessCreate(e){
		e.preventDefault();
		let formD = {
			"processNum": document.forms.namedItem("processCreate")["processNum"]["value"],
			"description": document.forms.namedItem("processCreate")["description"]["value"],
			"status" : document.forms.namedItem("processCreate")["status"]["value"]
		}
		const createUrl = 'project/process/' + document.forms.namedItem("processCreate")["id"]["value"];
		axios.post(createUrl,{'process':formD});
	}

	onProcessDelete(e){
		e.preventDefault();
		const deleteUrl = 'project/process/remove/' + document.forms.namedItem("processDelete")["id"]["value"];
		axios.post(deleteUrl, {'processNum': document.forms.namedItem("processDelete")["processNum"]["value"]});
	}

	onProcessUpdate(e){
		let formD = {
			"processNum" : document.forms.namedItem("processUpdate")["processNum"]["value"],
			"status" : document.forms.namedItem("processUpdate")["status"]["value"]
		}
		if(document.forms.namedItem("processUpdate")["description"]["value"].trim() !==""){
			formD['description'] = document.forms.namedItem("processUpdate")["description"]["value"].trim();
		}

		const updateUrl = 'project/process/update/' + document.forms.namedItem("processUpdate")["id"]["value"];
		axios.post(updateUrl, formD);
	}
	onCreateNode(e){
		e.preventDefault();
		let formD = {
			"processNum" : parseInt(document.forms.namedItem("createNode")["processNum"]["value"]),
			"name" : document.forms.namedItem("createNode")["name"]["value"],
			"description": document.forms.namedItem("createNode")["description"]["value"]
		};
		let url = '/project/process/node/' + document.forms.namedItem("createNode")["id"]["value"];
		axios.post(url,formD);
	}
	onUpdateNode(e){
		e.preventDefault();
		let formD = {
			"processNum" : parseInt(document.forms.namedItem("updateNode")["processNum"]["value"]),
			"nodeIndex" : parseInt(document.forms.namedItem("updateNode")["processNum"]["value"])
		}
		if(document.forms.namedItem("updateNode")["name"]["value"].trim() != ""){
			formD["name"] = document.forms.namedItem("updateNode")["name"]["value"];
		}
		if(document.forms.namedItem("updateNode")["description"]["value"] != ""){
			formD["description"] = document.forms.namedItem("updateNode")["description"]["value"];
		}
		let url = '/project/process/node/update/' + document.forms.namedItem("updateNode")["id"]["value"];
		axios.post(url,formD);
	}
	onDeleteNode(e){
		e.preventDefault();
		let formD = {
			"processNum" : parseInt(document.forms.namedItem("deleteNode")["processNum"]["value"]),
			"nodeIndex" : parseInt(document.forms.namedItem("deleteNode")["nodeIndex"]["value"])
		}
		let url = '/project/process/node/remove/' + document.forms.namedItem("deleteNode")["id"]["value"];
		axios.post(url,formD);
	}
	onFinishNode(e){
		e.preventDefault();
		let formD = {
			"processNum" : parseInt(document.forms.namedItem("finishNode")["processNum"]["value"]),
			"nodeIndex" : parseInt(document.forms.namedItem("finishNode")["nodeIndex"]["value"])
		}
		let url = '/project/process/node/finish/' + document.forms.namedItem("finishNode")["id"]["value"];
		axios.post(url,formD);
	}
	conditionalSearch(e){
		e.preventDefault();
		let formD = {
		}
		if(document.forms.namedItem("conditionalSearch")["byName"].checked){
			formD.name = document.forms.namedItem("conditionalSearch")["name"]["value"];
		}
		if(document.forms.namedItem("conditionalSearch")["byStatus"].checked){
			formD.status = document.forms.namedItem("conditionalSearch")["status"]["value"];
		}
		if(document.forms.namedItem("conditionalSearch")["sort"].checked){
			formD.sortBy = document.forms.namedItem("conditionalSearch")["sortMethod"]["value"];
		}
		let url = '/project/conditional/';
		axios.post(url,formD).then((res)=>{
			alert(JSON.stringify(res.data.result));
		});
	}
	likeOtherProject(e){
		e.preventDefault();
		let url = "/project/like/" + document.forms.namedItem("like")["id"]["value"];
		axios.post(url);
	}

	createTimeLine(e){
		e.preventDefault();
		const id = document.forms.namedItem("createTimeLine")["id"]["value"];
		const description = document.forms.namedItem("createTimeLine")["description"]["value"];
		const date = document.forms.namedItem("createTimeLine")["date"]["value"].split('-');
		const year = date[0];
		const month = date[1];
		const day = date[2];
		const time = document.forms.namedItem("createTimeLine")["time"]["value"].split(':');
		const hrs = time[0];
		const mins = time[1];

		const url = '/project/timeline/'+id;
		axios.post(url,{
			'description': description,
			'time': {
				'year':parseInt(year),
				'month':parseInt(month),
				'day':parseInt(day),
				'hr':parseInt(hrs),
				'min':parseInt(mins),
				'sec':0,
				'minsec':0
			}
		});
	}
	
	componentDidMount(){

	}
	render(){
		return(
			<div>
					Create project
					<form onSubmit = {this.onFormSubmit} name = "testCreate">
		        		<input type = "text" name = "name" placeholder= "projectName"/>
			          	<input type = "text" name = "description" placeholder= "projectDescription"/>
			          	<select name = "status">
			            <option value="Inprogress">Inprogress</option>
			            <option value="Completed">Completed</option>
			            <option value="Cancel">Cancel</option>
			          	</select>
			          	<select name = "show_status">
			            <option value="public">public</option>
			            <option value="private">private</option>
			          	</select>
		        		<input type = "submit" value = "test"/>
		        	</form>

		        	GetAllProject(need to wait for few secs)
		        	<button onClick = {this.getAllProject}>
		        	click me
        			</button>


        			<br/>
        			GetOneProject
        			<form onSubmit = {this.getOneProject} name = "testOne">
        				<input type="text" name = "id" placeholder="projectId"/>
        				<input type = "submit" value = "test"/>
        			</form>

        			Delelte a selected one
        			<form onSubmit = {this.deleteOneProject} name = "deleteOne">
        				<input type = "text" name = "id" placeholder="projectId"/>
        				<input type = "submit" value = "test"/>
        			</form>
        			<div id="deletePull">
        			</div>

        			Update one project
        			<form onSubmit = {this.onFormUpdate} name = "testUpdate">
		        		<input type = "text" name = "name" placeholder="projectname"/>
			          	<input type = "text" name = "description" placeholder="projectDescription"/>
			          	<select name = "status">
			            <option value="Inprogress">Inprogress</option>
			            <option value="Completed">Completed</option>
			            <option value="Cancel">Cancel</option>
			          	</select>
			          	<select name = "show_status">
			            <option value="public">public</option>
			            <option value="private">private</option>
			          	</select>
			          	<input type = "text" name = "id" placeholder= "projectId"/>
		        		<input type = "submit" value = "test"/>
		        	</form>

		        	UpdateUser
		        	<form onSubmit = {this.onUserUpdate} name = "userUpdate">
		        		<input type = "text" name = "id" placeholder="projectId"/>
		        		<input type = "text" name = "names" placeholder="username: luc_a,luc_b,luc_c..."/>
		        		<input type = "submit" value = "test"/>
		        	</form>

		        	DeleteUser
		        	<form onSubmit = {this.onUserDelete} name = "userDelete">
		        		<input type = "text" name = "id" placeholder="projectId"/>
		        		<input type = "text" name = "names" placeholder="username: luc_a,luc_b,luc_c..."/>
		        		<input type = "submit" value = "test"/>
		        	</form>

		        	CreateNewProcess
		        	<form onSubmit = {this.onProcessCreate} name = "processCreate">
		        		<input type = "text" name = "id" placeholder="projectId"/>
		        		<input type="number" min="1" step="1"name = "processNum" placeholder="processNum"/>
		        		<input type = "text" name = "description" name = "description" placeholder="processDescription"/>
		        		<select name = "status">
		        			<option value="incomplete">incomplete</option>
			            	<option value="complete">complete</option>
			            </select>
			          	<input type = "submit" value = "test"/>
		        	</form>

		        	DeleteOneProcess
		        	<form onSubmit = {this.onProcessDelete} name = "processDelete">
		        		<input type = "text" name = "id" placeholder="projectId"/>
		        		<input type = "number" min="1" step = "1" name = "processNum" placeholder="processNum"/>
		        		<input type = "submit" value = "test"/>
		        	</form>

		        	UpdateOneProcess
		        	<form onSubmit = {this.onProcessUpdate} name = "processUpdate">
		        		<input type = "text" name = "id" placeholder="projectId"/>
		        		<input type="number" min="1" step="1"name = "processNum" placeholder = "processNum"/>
		        		<input type = "text" name = "description" name = "description" placeholder="processDescription"/>
		        		<select name = "status">
		        			<option value="incomplete">incomplete</option>
			            	<option value="complete">complete</option>
			            </select>
			          	<input type = "submit" value = "test"/>

		        	</form>
		        	Create one Node
		        	<form onSubmit = {this.onCreateNode} name = "createNode">
		        		<input type = "text" name = "id" placeholder="projetId"/>
		        		<input type = "number" min= "1" step="1" name="processNum" placeholder="processNum"/>
		        		<input type = "text" name= "name" placeholder = "nodeName"/>
		        		<input type = "text" name = "description" placeholder="nodeDescription"/>
		        		<input type = "submit" value = "test"/>
		        	</form>

		        	Update one Node
		        	<form onSubmit = {this.onUpdateNode} name = "updateNode">
						<input type = "text" name = "id" placeholder="projetId"/>
		        		<input type = "number" min= "1" step="1" name="processNum" placeholder="processNum"/>
		        		<input type = "number" min= "1" step = "1" name = "nodeIndex" placeholder= "nodeIndex"/>
		        		<input type = "text" name= "name" placeholder = "nodeName"/>
		        		<input type = "text" name = "description" placeholder="nodeDescription"/>
		        		<input type = "submit" value = "test"/>
		        	</form>

		        	Delete one Node
		        	<form onSubmit = {this.onDeleteNode} name = "deleteNode">
		        		<input type ="text" name ="id" placeholder="projectId"/>
		        		<input type ="number" min ="1" step ="1" name ="processNum" placeholder="processNum"/>
		        		<input type ="number" min ="1" step ="1" name ="nodeIndex" placeholder="nodeIndex"/>
		        		<input type ="submit" value = "test"/>
		        	</form>

		        	Finish one Node
		        	<form onSubmit = {this.onFinishNode} name = "finishNode">
		        		<input type ="text" name ="id" placeholder="projectId"/>
		        		<input type ="number" min ="1" step ="1" name ="processNum" placeholder="processNum"/>
		        		<input type ="number" min ="1" step ="1" name ="nodeIndex" placeholder="nodeIndex"/>
		        		<input type ="submit" value = "test"/>
		        	</form>

		        	Conditional search
		        	<form onSubmit = {this.conditionalSearch} name = "conditionalSearch">
		        		Search By name?
		        		<input type ="checkbox" name = "byName"/>
						<input type = "text" name = "name" placeholder="nameOfProject"/>

						Search By Status?
						<input type = "checkbox" name = "byStatus"/>
						<select name = "status">
			            <option value="Inprogress">Inprogress</option>
			            <option value="Completed">Completed</option>
			            <option value="Cancel">Cancel</option>
			          	</select>

			          	In ascending/descending ?
			          	<input type="checkbox" name="sort"/>
			          	<select name="sortMethod">
			          		<option value="ascending"> ascending</option>
			          		<option value="descending"> descending</option>
			          	</select>
		        		<input type ="submit" value = "test"/>
		        	</form>

		        	Like one project
		        	<form onSubmit = {this.likeOtherProject} name = "like">
		        		<input type ="text" name = "id" placeholder = "projectId"/>
		        		<input type = "submit" value = "test"/>
		        	</form>

					Create Timeline
		        	<form onSubmit = {this.createTimeLine} name = "createTimeLine">
		        		<input type = "text" name = "id" placeholder = "projectId" required/>
		        		<input type = "text" name = "description" placeholder = "description"/>
		        		<input type = "date" name = "date" required/>
		        		<input type = "time" name = "time" required/>
		        		<input type = "submit" value = "test"/>
		        	</form>
			</div>

		);
	}
}

export default(Test);