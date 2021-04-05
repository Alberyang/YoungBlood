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

describe('Experience', ()=>{
	var token = '';
	var id1 = '';
	var id2 = '';
    const date = new Date();

    before(function (done) {
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

    it('CreateOneExperience', ()=>
    	request(server).
    		post('/api/experience/create').
    		set('Authorization', 'Bearer ' + token).
    		send({start_date: date,
    			end_date: new Date(2022, 11, 24, 10, 33, 30, 0),
    			position: 'test_position',
    			company: 'test_company',
    			description: 'test_description',
    			state: 'going',
    		}).
    		expect(200).
    		then((r)=>{
    			expect(r.body).to.be.an.an('object').that.has.property('_id');
    			expect(r.body).to.be.an.an('object').that.has.property('position').equal('test_position');
    			expect(r.body).to.be.an.an('object').that.has.property('company').equal('test_company');
    			expect(r.body).to.be.an.an('object').that.has.property('description').equal('test_description');
    			expect(r.body).to.be.an.an('object').that.has.property('state').equal('going');
    			expect(r.body).to.be.an.an('object').that.has.property('end_date');
    			expect(r.body).to.be.an.an('object').that.has.property('start_date');
    			assert.equalDate(new Date(r.body.end_date),new Date(2022, 11, 24, 10, 33, 30, 0));
    			assert.equalDate(new Date(r.body.start_date),date);
    			id1 = r.body._id;
    		})

    );
    
    it('CreateAnotherExperience', ()=>
    	request(server).
    		post('/api/experience/create').
    		set('Authorization', 'Bearer ' + token).
    		send({start_date: date,
    			end_date: new Date(2022, 11, 24, 10, 33, 30, 0),
    			position: 'test2_position',
    			company: 'test2_company',
    			description: 'test2_description',
    			state: 'end',
    		}).
    		expect(200).
    		then((r)=>{
    			expect(r.body).to.be.an.an('object').that.has.property('_id');
    			expect(r.body).to.be.an.an('object').that.has.property('position').equal('test2_position');
    			expect(r.body).to.be.an.an('object').that.has.property('company').equal('test2_company');
    			expect(r.body).to.be.an.an('object').that.has.property('description').equal('test2_description');
    			expect(r.body).to.be.an.an('object').that.has.property('state').equal('end');
    			expect(r.body).to.be.an.an('object').that.has.property('end_date');
    			expect(r.body).to.be.an.an('object').that.has.property('start_date');
    			assert.equalDate(new Date(r.body.end_date),new Date(2022, 11, 24, 10, 33, 30, 0));
    			assert.equalDate(new Date(r.body.start_date),date);
    			id2 = r.body._id;
    		})
    );
	
    it('GetAllExperience', ()=>
    	request(server).
    		get('/api/experience/').
    		set('Authorization', 'Bearer ' + token).
    		expect(200).
    		then((r)=>{
    			expect(r.body).to.be.an.an('array');
    			const projects = r.body.map(ele=>({
    				_id: ele._id,
    				start_date: (new Date(ele.start_date)).getTime(),
    				end_date: (new Date(ele.end_date)).getTime(),
    				position: ele.position,
    				company: ele.company,
    				description: ele.description,
    				state: ele.state
    			}));
				  expect(projects).to.deep.include.something.that.deep.include({
				  	_id: id1,
				  	start_date: date.getTime(),
				  	end_date: (new Date(2022, 11, 24, 10, 33, 30, 0)).getTime(),
				  	position: 'test_position',
				  	company:'test_company',
				  	description:'test_description',
				  	state: 'going'
				  });
				  expect(projects).to.deep.include.something.that.deep.include({
				  	_id: id2,
				  	start_date: date.getTime(),
				  	end_date: (new Date(2022, 11, 24, 10, 33, 30, 0)).getTime(),
				  	position: 'test2_position',
				  	company:'test2_company',
				  	description:'test2_description',
				  	state: 'end'
				  });
    		})
    );

    it('UpdateOneExperience',()=>
    	request(server).
    		post('/api/experience/update/'+id1).
    		set('Authorization', 'Bearer ' + token).
    		send({
    			position: 'test2_position',
    			company: 'test2_company',
    			description: 'test2_description',
    			state: 'end',
    		}).
    		expect(200).
    		expect('Content-Type', /json/).
    		then((r)=>{
    			expect(r.body).to.be.an('object');
    			expect(r.body).to.deep.include({
    				_id:id1,
    				position: 'test2_position',
    				company: 'test2_company',
    				description: 'test2_description',
    				state: 'end'
    			});
    	})
    );

    it('UpdateAnotherExperience',()=>
    	request(server).
    		post('/api/experience/update/'+id1).
    		set('Authorization', 'Bearer ' + token).
    		send({
    			position: 'test222_position',
    			company: 'test222_company',
    			description: 'test222_description',
    			state: 'going',
    		}).
    		expect(200).
    		expect('Content-Type', /json/).
    		then((r)=>{
    			expect(r.body).to.be.an('object');
    			expect(r.body).to.deep.include({
    				_id:id1,
    				position: 'test222_position',
    				company: 'test222_company',
    				description: 'test222_description',
    				state: 'going'
    			});
    	})
    );

    it('CompleteOne',()=>(
    	
    	request(server).
    		get('/api/experience/complete/'+id1).
    		set('Authorization', 'Bearer ' + token).
    		expect(200).
    		expect('Content-Type', /json/).
    		then((r)=>{
    			expect(r.body).to.be.an('object');
    			expect(r.body).to.be.an('object').that.has.property('_id').equal(id1);
    			expect(r.body).to.be.an('object').that.has.property('state').equal('end');
    	})

    ));

    it('DeleteOne',()=>
    	request(server).
    		delete('/api/experience/'+id1).
    		set('Authorization', 'Bearer ' + token).
    		expect(200).
    		expect('Content-Type', /json/).
    		then((r)=>{
    			assert.deepEqual(r.body,{"deleteId":id1})
    	})
    );
    it('DeleteOne',()=>
    	request(server).
    		delete('/api/experience/'+id2).
    		set('Authorization', 'Bearer ' + token).
    		expect(200).
    		expect('Content-Type', /json/).
    		then((r)=>{
    			assert.deepEqual(r.body,{"deleteId":id2})
    	})
    );
    it('Make sure its clean', ()=>
    	request(server).
    		get('/api/experience/').
    		set('Authorization', 'Bearer ' + token).
    		expect(200).
    		then((r)=>{
    			expect(r.body).to.be.an.an('array');
    			expect(r.body.length).equal(0);
    		})
    );

});