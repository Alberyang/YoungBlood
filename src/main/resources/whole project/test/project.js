	process.env.NODE_ENV = 'test';

	const server = require('../server.js');
	const request = require('supertest');
	const chai = require('chai');
	const expect = chai.expect;
	const assert = chai.assert;
	const should = chai.should();
	chai.use(require('chai-datetime'));
	chai.use(require('chai-things'));
	chai.use(require('chai-like'));


	describe('Projects', () => {
	var token = '';
	//var token2 = '';
	var id1 = '';
	var id2 = '';
	var id3 = '5ebf86bf6c65861464d67730';

	before(function (done) {
		/*
		request(server)
			.post('/api/user/sign-in')
			.send({
				user: {
					email: 'lucaaa@gmail.com',
					password: 'lucaaa',
				},
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err, res) {
				token2 = res.body.token2;
			});
		*/
		request(server)
			.post('/api/user/sign-in')
			.send({
				user: {
					email: 'admin@gmail.com',
					password: 'admin',
				},
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function (err, res) {
				token = res.body.token;
				done();
			});
	});

	it('Create One Project', async ()=>{
		let re = await request(server).
		post('/api/project/create/').
		set('Authorization', 'Bearer ' + token).
		send({
			name:'test_1'
		});
		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object');
		expect(re.body).to.deep.include({
				name: 'test_1',
				status: 'Inprogress',
				show_status: 'public',
				rating: 0,
				likedBy: []
			});
		expect(re.body).to.have.property('_id');
		id1 = re.body._id;
	});
	it('Create Another Project', async ()=>{
		let re = await request(server).
		post('/api/project/create/').
		set('Authorization', 'Bearer ' + token).
		send({
			name:'test_2',
			description: 'test_2_description',
			status: 'Completed',
			show_status: 'private'
		});

		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an('object');
		expect(re.body).to.deep.include({
			name: 'test_2',
			description: 'test_2_description',
			status: 'Completed',
			show_status: 'private',
			rating: 0,
			likedBy: []
		});
		expect(re.body).to.have.property('_id');
		id2 = re.body._id;
	});

	it('Get All Project', async ()=>{
		let re = await request(server).
		get('/api/project/').
		set('Authorization', 'Bearer ' + token);
		expect(re.statusCode).to.equal(200);
		
		expect(re.body).to.have.property('projects').to.be.an.an('array');
		const projects = re.body.projects.map((ele)=>({
			_id:ele._id,
			name: ele.name,
			contributors: ele.contributors,
			description: ele.description,
			status: ele.status,
			show_status: ele.show_status,
			process: ele.process,
			timeline: ele.timeline,
			rating: ele.rating,
			likedBy: ele.likedBy,
		}));
		//console.log(projects);
		expect(projects).to.deep.include.something.that.deep.include({
			_id: id1,
			name: 'test_1',
			contributors: ['admin'],
			description: '',
			status: 'Inprogress',
			show_status: 'public',
			process: [],
			timeline: [],
			rating: 0,
			likedBy: []
		});
		expect(projects).to.deep.include.something.that.deep.include({
			_id: id2,
			name: 'test_2',
			contributors: ['admin'],
			description: 'test_2_description',
			status: 'Completed',
			show_status: 'private',
			process: [],
			timeline: [],
			rating: 0,
			likedBy: []
		});
	});
	
	it('Get One Specific Project', async ()=>{
		let re =  await request(server).
		get('/api/project/'+id1).
		set('Authorization', 'Bearer ' + token);
		expect(re.statusCode).to.equal(200);
		
		expect(re.body).to.have.property('project').to.be.an.an('object').that.deep.include({
			_id: id1,
			name: 'test_1',
			contributors: ['admin'],
			skills: [],
			description: '',
			status: 'Inprogress',
			show_status: 'public',
			process: [],
			timeline: [],
			rating: 0,
			likedBy: []
		});
	});
	
	
	it('Get One Not Exist Project', async ()=>{
		let re = await request(server).
		get('/api/project/'+id3).
		set('Authorization', 'Bearer ' + token);
		expect(re.statusCode).to.equal(401);
	});

	it('Update One Project', async ()=>{
		let re = await request(server).
		post('/api/project/update/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			name:'test_1_new',
			description: 'test_1_description_new',
			status: 'Completed',
			show_status: 'private',
			skills: ['test_1','test_2']
		});

		expect(re.statusCode).to.equal(200);

		expect(re.body).to.be.an.an('object').that.have.property('result');
		expect(re.body.result).to.be.an('object');
		expect(re.body.result).to.be.like({
			_id: id1,
			name: 'test_1_new',
			skills: ['test_1','test_2'],
			contributors: ['admin'],
			description: 'test_1_description_new',
			status: 'Completed',
			show_status: 'private',
			process: [],
			timeline: [],
			rating: 0,
			likedBy: []
		}) 
	});
	
	it('Add a contributor', async ()=>{
		let re = await request(server).
		post('/api/project/add_people/'+id2).
		set('Authorization', 'Bearer ' + token).
		send({
			new_users: ['a','b','c']
		});
		expect(re.statusCode).to.equal(200);
		
		expect(re.body).to.be.an.an('object');
		expect(re.body).to.have.property('contributors').that.include.members(['a','b','c','admin']);
		
	});

	it('Delete contributors', async ()=>{
		let re = await request(server).
		post('/api/project/remove_people/'+id2).
		set('Authorization', 'Bearer ' + token).
		send({
			old_users: ['a','b','admin','d']
		});
		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object');
		expect(re.body).to.have.property('contributors').that.include('c');
		expect(re.body.contributors.length).equal(1);
	});

	it('Add One Process', async () =>{
		let re = await request(server).
		post('/api/project/process/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			'process':{
				processNum:1,
				description: 'test_process_description',
				status: true,
				nodes: []
			}
		});

		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object');
		expect(re.body).to.have.property('process');
		expect(re.body.process).to.be.an.an('array');
		expect(re.body.process[0]).to.deep.equal({
				processNum:1,
				description: 'test_process_description',
				status: true,
				nodes: []
			});

	});

	it('Add One Process smaller Process Num', async () =>{
		let re = await request(server).
		post('/api/project/process/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			'process':{
				processNum:1,
				description: 'test_process_description_new',
				status: false,
				nodes: []
			}
		});

		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object');
		expect(re.body).to.have.property('process');
		expect(re.body.process).to.be.an.an('array');
		expect(re.body.process[0]).to.deep.equal({
				processNum:1,
				description: 'test_process_description_new',
				status: false,
				nodes: []
			});
		expect(re.body.process[1]).to.deep.equal({
				processNum:2,
				description: 'test_process_description',
				status: true,
				nodes: []
			});
	});

	it('Update One Process', async () =>{
		let re = await request(server).
		post('/api/project/process/update/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			processNum:1,
			description:"test_process_description_updated",
			status: false
		});
		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object');
		expect(re.body).to.have.property('process');
		expect(re.body.process).to.be.an.an('array');
		expect(re.body.process[0]).to.deep.equal({
				processNum:1,
				description: 'test_process_description_updated',
				status: false,
				nodes: []
			});


	});

	it('Create one node', async() =>{
		let re = await request(server).
		post('/api/project/process/node/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			processNum: 1,
			description: "test_node_description",

		});

		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object');
		expect(re.body.process).to.be.an.an('array');
		expect(re.body.process[0].nodes).to.be.an.an('array');
		expect(re.body.process[0].nodes[0]).to.deep.equal({
			description: 'test_node_description',
			state: false,
			index: 1
		});

	});

	it('Create Another node', async() =>{
		let re = await request(server).
		post('/api/project/process/node/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			processNum: 1,
			description: "test_node_description_another",

		});

		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object');
		expect(re.body.process).to.be.an.an('array');
		expect(re.body.process[0].nodes).to.be.an.an('array');
		expect(re.body.process[0].nodes[1]).to.deep.equal({
			description: 'test_node_description_another',
			state: false,
			index: 2
		});

	});

	it('Update One Node', async() =>{
		let re = await request(server).
		post('/api/project/process/node/update/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			processNum: 1,
			nodeIndex: 1,
			description: "test_node_description_update",

		});

		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object');
		expect(re.body.process).to.be.an.an('array');
		expect(re.body.process[0].nodes).to.be.an.an('array');
		expect(re.body.process[0].nodes[0]).to.deep.equal({
			description: 'test_node_description_update',
			state: false,
			index: 1
		});

	});

	it('Delete One Node', async() =>{
		let re = await request(server).
		post('/api/project/process/node/remove/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			processNum:1,
			nodeIndex:1,
		});
		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object');
		expect(re.body.process).to.be.an.an('array');
		expect(re.body.process[0].nodes).to.be.an.an('array');
		expect(re.body.process[0].nodes[0]).to.deep.equal({
			description: 'test_node_description_another',
			state: false,
			index: 1
		});

	});

	it('Finish One Node', async() =>{
		let re = await request(server).
		post('/api/project/process/node/finish/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			processNum:1,
			nodeIndex:1,
			state : true
		});
		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object');
		expect(re.body.process).to.be.an.an('array');
		expect(re.body.process[0].nodes).to.be.an.an('array');
		expect(re.body.process[0].nodes[0]).to.deep.equal({
			description: 'test_node_description_another',
			state: true,
			index: 1
		});
	});

	it('Delete One Process', async() =>{
		let re = await request(server).
		post('/api/project/process/remove/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
				processNum:1,
			});

		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object');
		expect(re.body.process).to.be.an.an('array');
		expect(re.body.process[0]).to.be.an.an('object');
		expect(re.body.process[0]).to.deep.equal({
				processNum:1,
				description: 'test_process_description',
				status: true,
				nodes: []
			});
	});

	it('Check if its in lastest update', async ()=>{
		let re1 = await request(server).
		post('/api/project/conditional').
		set('Authorization', 'Bearer ' + token).
		send({
			name: 'test_1_new',
		});

		let re2 = await request(server).
		post('/api/project/conditional').
		set('Authorization', 'Bearer ' + token).
		send({
			sortBy: 'ascending',
		});

		expect(re1.statusCode).to.equal(200);
		expect(re1.body).to.be.an.an('object').that.have.property('result');
		expect(re1.body.result.length).equal(1);
		expect(re1.body.result[0]).to.have.property('_id').equal(id1);
		
		expect(re2.statusCode).to.equal(200);
		expect(re2.body).to.be.an.an('object').that.have.property('result');
		expect(re2.body.result.length).equal(2);
		expect(re2.body.result[1]).to.have.property('_id').equal(id2);
		expect(re2.body.result[0]).to.have.property('_id').equal(id1);
		
	});

	it('Anoymous like one project', async()=>{
		let re = await request(server).
		post('/api/project/like/anoymous/'+id1);
		let pro = await request(server).
		get('/api/project/'+id1).
		set('Authorization', 'Bearer ' + token);
		/*
		let manual = await request(server).
		get('/api/project/').
		set('Authorization', 'Bearer ' + token);
		console.log(manual.body.liked);
		*/
		expect(pro.body).to.have.property('project').to.be.an.an('object').that.deep.include({
			_id: id1,
			rating: 1
		});

	});

/*
	it('Login like one project', async()=>{
		let re = await request(server).
		post('/api/project/like/'+id1).
		set('Authorization', 'Bearer ' + token2);
		let pro = await request(server).
		get('/api/project/'+id1).
		set('Authorization', 'Bearer ' + token);

		expect(pro.body).to.have.property('project').to.be.an.an('object').that.deep.include({
			_id: id1,
			rating: 2
		});
		expect(pro.body.project.likedBy).to.be.an.an('array');
		expect(pro.body.project.likedBy[1].toString()).to.equal("5f74578323c0fa5f248995fc");

	});
*/
	it('Create Timeline', async()=>{
		await request(server).
		post('/api/project/timeline/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			description: 'test_time_description1',
			time: {
				year: 2000,
				month: 1,
				day: 1,
				hr: 0,
				min: 0,
				sec: 0,
				minsec: 0,

			}
		});

		let re = await request(server).
		post('/api/project/timeline/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			description: 'test_time_description2',
			time: {
				year: 1981,
				month: 11,
				day: 12,
				hr: 0,
				min: 0,
				sec: 0,
				minsec: 0,

			}
		});
		expect(re.statusCode).to.equal(200);
		expect(re.body.timeline).to.be.an.an('array');
		assert.equalDate(new Date(re.body.timeline[0].time),new Date(1981,11,12,0,0,0,0));
		assert.equalDate(new Date(re.body.timeline[1].time),new Date(2000,1,1,0,0,0,0));
	});

	it('Update Timeline -- description', async ()=>{
		let re = await request(server).
		post('/api/project/timeline/update/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			description: 'test_time_description2_new',
			index: 1,
		});

		expect(re.statusCode).to.equal(200);
		expect(re.body.timeline).to.be.an.an('array');
		assert.equalDate(new Date(re.body.timeline[0].time),new Date(1981,11,12,0,0,0,0));
		expect(re.body.timeline[0].description).equal('test_time_description2_new');
	});
	
	it('Update Timeline -- description', async ()=>{
		let re = await request(server).
		post('/api/project/timeline/update/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			time: {
				year: 2981,
				month: 11,
				day: 12,
				hr: 0,
				min: 0,
				sec: 0,
				minsec: 0,

			},
			index: 1,
		});

		expect(re.statusCode).to.equal(200);
		expect(re.body.timeline).to.be.an.an('array');
		assert.equalDate(new Date(re.body.timeline[1].time),new Date(2981,11,12,0,0,0,0));
		expect(re.body.timeline[1].description).equal('test_time_description2_new');
	});

	it('Delete Timeline', async ()=>{
		let re = await request(server).
		post('/api/project/timeline/remove/'+id1).
		set('Authorization', 'Bearer ' + token).
		send({
			index: 2,
		});

		expect(re.statusCode).to.equal(200);
		expect(re.body.timeline).to.be.an.an('array');
		expect(re.body.timeline.length).equal(1);
		expect(re.body.timeline[0].description).equal('test_time_description1');
	});

	
	it('Delete one Project', async ()=>{
		let re = await request(server).
		delete('/api/project/'+id1).
		set('Authorization', 'Bearer ' + token);
		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object').that.have.property('deleteId').equal(id1);
	});
	it('Delete Another Project', async ()=>{
		let re = await request(server).
		delete('/api/project/'+id2).
		set('Authorization', 'Bearer ' + token);
		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object').that.have.property('deleteId').equal(id2);
	});

	it('Make Sure its clean', async ()=>{
		let re = await request(server).
		get('/api/project/').
		set('Authorization', 'Bearer ' + token);
		expect(re.body).to.be.an.an('object').that.have.property('projects');
		expect(re.body.projects).to.be.an.an('array');
		expect(re.body.projects.length).equal(0);
	});


});