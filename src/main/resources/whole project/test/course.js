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


describe('Courses', () =>{
	var token = '';
	var id1 = '';
	var id2 = '';

	before(function (done){
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

	it('Create One Course', async ()=>{
		await request(server)
			.post('/api/course/create')
			.set('Authorization', 'Bearer ' + token)
			.send({
				code: 'COMP10001',
				name: 'Fundations of Computing',
				description: 'Python',
				state: 'Finished',
				related_skills: ['Python','Algorithm'],
				grades: 95,
				link: 'https://handbook.unimelb.edu.au/2020/subjects/comp10001',
				year: 2018,
				sem: 'Sem1',
				core: false,
				score: 1,
			})
			.expect(200)
			.then((r)=>{
				expect(r.body).to.be.an.an('object');
				expect(r.body).to.deep.include({
				code: 'COMP10001',
				name: 'Fundations of Computing',
				description: 'Python',
				state: 'Finished',
				related_skills: ['Python','Algorithm'],
				grades: 95,
				link: 'https://handbook.unimelb.edu.au/2020/subjects/comp10001',
				year: 2018,
				sem: 'Sem1',
				core: false,
				score: 1,
				});
				id1 = r.body._id;
			});
	});
	it('Create Another Course', async ()=>{
		await request(server)
			.post('/api/course/create')
			.set('Authorization', 'Bearer ' + token)
			.send({
				code: 'COMP10002',
				name: 'Fundations of Algorithm',
				description: 'C',
				state: 'Finished',
				related_skills: ['C','Algorithm'],
				grades: 92,
				link: 'https://handbook.unimelb.edu.au/2020/subjects/comp10002',
				year: 2018,
				sem: 'Sem2',
				core: false,
				score: 1,
			})
			.expect(200)
			.then((r)=>{
				expect(r.body).to.be.an.an('object');
				expect(r.body).to.deep.include({
				code: 'COMP10002',
				name: 'Fundations of Algorithm',
				description: 'C',
				state: 'Finished',
				related_skills: ['C','Algorithm'],
				grades: 92,
				link: 'https://handbook.unimelb.edu.au/2020/subjects/comp10002',
				year: 2018,
				sem: 'Sem2',
				core: false,
				score: 1,
				});
				id2 = r.body._id;
			});
	});

	it('Edit Course', async ()=>{
		let re = await request(server)
			.post('/api/course/'+id1)
			.set('Authorization', 'Bearer ' + token)
			.send({
				code: 'NURS90129',
				name: 'Nursing Science 1',
				description: 'Nursery',
				state: 'Ongoing',
				related_skills: ['describe in detail the normal structure and function of the cells, tissues and organs','Injection'],
				grades: 81,
				link: 'https://handbook.unimelb.edu.au/2020/subjects/nurs90129',
				year: 2020,
				sem: 'Sem1',
				core: false,
				score: 1,
			});
		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object');
		expect(re.body).to.deep.include({
				_id: id1,
				code: 'NURS90129',
				name: 'Nursing Science 1',
				description: 'Nursery',
				state: 'Ongoing',
				related_skills: ['describe in detail the normal structure and function of the cells, tissues and organs','Injection'],
				grades: 81,
				link: 'https://handbook.unimelb.edu.au/2020/subjects/nurs90129',
				year: 2020,
				sem: 'Sem1',
				core: false,
				score: 1,
			});
	});

	it('Get One Specific Course', async ()=>{
		let re = await request(server)
			.get('/api/course/'+id1)
			.set('Authorization', 'Bearer ' + token);
		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object').that.have.property('course');
		expect(re.body.course).to.deep.include({
				_id: id1,
				code: 'NURS90129',
				name: 'Nursing Science 1',
				description: 'Nursery',
				state: 'Ongoing',
				related_skills: ['describe in detail the normal structure and function of the cells, tissues and organs','Injection'],
				grades: 81,
				link: 'https://handbook.unimelb.edu.au/2020/subjects/nurs90129',
				year: 2020,
				sem: 'Sem1',
				core: false,
				score: 1,
			});
	});

	it('Get All Course', async ()=>{
		let re = await request(server)
			.get('/api/course')
			.set('Authorization', 'Bearer ' + token);
		expect(re.statusCode).to.equal(200);
		expect(re.body).to.be.an.an('object').that.have.property('course');
		expect(re.body.course).to.be.an.an('object').that.have.property(2018);
		expect(re.body.course).to.be.an.an('object').that.have.property(2020);
		expect(re.body.course[2018]).to.be.an.an('array');
		expect(re.body.course[2020]).to.be.an.an('array');
		expect(re.body.course[2018].length).to.equal(1);
		expect(re.body.course[2020].length).to.equal(1);
		expect(re.body.course[2018][0]).to.deep.include({
				_id: id2,
				code: 'COMP10002',
				name: 'Fundations of Algorithm',
				description: 'C',
				state: 'Finished',
				related_skills: ['C','Algorithm'],
				grades: 92,
				link: 'https://handbook.unimelb.edu.au/2020/subjects/comp10002',
				year: 2018,
				sem: 'Sem2',
				core: false,
				score: 1,
				});
		expect(re.body.course[2020][0]).to.deep.include({
				_id: id1,
				code: 'NURS90129',
				name: 'Nursing Science 1',
				description: 'Nursery',
				state: 'Ongoing',
				related_skills: ['describe in detail the normal structure and function of the cells, tissues and organs','Injection'],
				grades: 81,
				link: 'https://handbook.unimelb.edu.au/2020/subjects/nurs90129',
				year: 2020,
				sem: 'Sem1',
				core: false,
				score: 1,
			});
	});

	it('Delete Course', async ()=>{
		let re1 = await request(server)
			.delete('/api/course/'+id1)
			.set('Authorization', 'Bearer ' + token);
		let re2 = await request(server)
			.delete('/api/course/'+id2)
			.set('Authorization', 'Bearer ' + token);
		expect(re1.statusCode).to.equal(200);
		expect(re2.statusCode).to.equal(200);
		assert.deepEqual(re1.body,{"deleteId":id1});
		assert.deepEqual(re2.body,{"deleteId":id2});
	});

});