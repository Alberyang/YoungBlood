process.env.NODE_ENV = 'test';

const server = require('../server.js');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;


describe('Image', () => {
    var token = '';
    var id = '';
    var fileName='';
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

    it('should get all of the user images', () =>
        request(server)
            .get('/api/image')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect('Content-Type', /json/)
            .then((r) => {
                expect(r.body.files).to.be.an.an('array');
            }));

    it('post a new image', () =>
        request(server)
            .post('/api/image/upload/test')
            .set('Authorization', 'Bearer ' + token)
            .attach('file', './test/file/eportfolio-wordle.jpg')
            .then((r) => {
                expect(r.body).to.be.an.an('object').that.has.property('originalName').equal('eportfolio-wordle.jpg');
                id = r.body.fileId;
                fileName = r.body.filename;
            }));

    it('get a user image by filename', () =>
        request(server)
            .get(`/api/image/${fileName}`)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then((r) => {
                expect(r.text).to.be.a('string');
            }));

    it('delete user image by id', () =>
        request(server)
            .delete(`/api/image/${id}`)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .then((r) => {
                expect(r.text).to.be.a('string');
            }));

});