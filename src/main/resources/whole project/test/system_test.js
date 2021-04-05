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

describe('Regression test selection to ensure new changes doest break current code', ()=> {
    var token = '';
    var id_experience = '';
    var id_project = '';
    var id_image ='';
    var id_course ='';
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
            id_experience = r.body._id;
        })

    );
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
            rating: 0
        });
        expect(re.body).to.have.property('_id');
        id_project = re.body._id;
    });
    it('post a new image', () =>
        request(server)
            .post('/api/image/upload/test')
            .set('Authorization', 'Bearer ' + token)
            .attach('file', './test/file/eportfolio-wordle.jpg')
            .then((r) => {
                expect(r.body).to.be.an.an('object').that.has.property('originalName').equal('eportfolio-wordle.jpg');
                id_image = r.body.fileId;
                fileName = r.body.filename;
            }));
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
                id_course = r.body._id;
            });
    });
    it('Delete One  Experience',()=>
        request(server).
        delete('/api/experience/'+id_experience).
        set('Authorization', 'Bearer ' + token).
        expect(200).
        expect('Content-Type', /json/).
        then((r)=>{
            assert.deepEqual(r.body,{"deleteId":id_experience})
        })
    );
    it('Delete one Project', async ()=>{
        let re = await request(server).
        delete('/api/project/'+id_project).
        set('Authorization', 'Bearer ' + token);
        expect(re.statusCode).to.equal(200);
        expect(re.body).to.be.an.an('object').that.have.property('deleteId').equal(id_project);
    });
    it('delete user image by id', () =>
        request(server)
            .delete(`/api/image/${id_image}`)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .then((r) => {
                expect(r.text).to.be.a('string');
            }));
    it('Delete Course', async ()=>{
        let re1 = await request(server)
            .delete('/api/course/'+id_course)
            .set('Authorization', 'Bearer ' + token);
        expect(re1.statusCode).to.equal(200);
        assert.deepEqual(re1.body,{"deleteId":id_course});
    });


})