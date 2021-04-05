process.env.NODE_ENV = 'test';
const request = require('supertest');
const chai = require('chai');
const server = require('../server.js');

const {expect} = chai;

const imageController = require('../server/controllers/imageController');

describe('User testing', () => {
  let token = '';
    describe('create a new user testing', () => {
        it('sign up a new user', () =>
            request(server)
                .post('/api/user')
                .send({
                    user: {
                        username: 'test',
                        email: 'test@gmail.com',
                        lastname: 'test',
                        firstname: 'test',
                        password: 'test',
                    },
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .then((r) => {
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('username')
                        .equal('test');
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('email')
                        .equal('test@gmail.com');
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('lastname')
                        .equal('test');
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('firstname')
                        .equal('test');
                }));

        it('fail if creating a new user with existing username', () =>
            request(server)
                .post('/api/user')
                .send({
                    user: {
                        username: 'test',
                        email: 'test@gmail.com',
                        password: 'test',
                    },
                })
                .expect(422)
                .expect('Content-Type', /json/)
                .then((r) => {
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('errors')
                        .that.has.property('username')
                        .equal('is already taken.');
                }));

        it('fail if creating a new user with incorrect format for email', () =>
            request(server)
                .post('/api/user')
                .send({
                    user: {
                        username: 'test',
                        email: 'test',
                        lastname: 'test',
                        firstname: 'test',
                        password: 'test',
                    },
                })
                .expect(422)
                .expect('Content-Type', /json/)
                .then((r) => {
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('errors')
                        .that.has.property('email')
                        .equal('is invalid');
                }));
    })


    describe('Testing on current logged in user', () => {
        it('log in to the existing user ', () =>
            request(server)
                .post('/api/user/sign-in')
                .send({
                    user: {
                        email: 'test@gmail.com',
                        password: 'test',
                    },
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .then((r) => {
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('username')
                        .equal('test');
                    token = r.body.token;
                }));

        it('fetch user data information', () =>
            request(server)
                .get(`/api/user`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .then((r) => {
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('username')
                        .equal('test');
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('email')
                        .equal('test@gmail.com');
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('lastname')
                        .equal('test');
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('firstname')
                        .equal('test');
                }));

        it('update user information', () =>
            request(server)
                .put(`/api/user`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user: {
                        username: 'testupdate',
                        email: 'testupdate@gmail.com',
                        lastname: 'testupdate',
                        firstname: 'testupdate',
                        headline: 'testupdate',
                    },
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .then((r) => {
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('username')
                        .equal('testupdate');
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('email')
                        .equal('testupdate@gmail.com');
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('lastname')
                        .equal('testupdate');
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('firstname')
                        .equal('testupdate');
                    expect(r.body)
                        .to.be.an.an('object')
                        .that.has.property('headline')
                        .equal('testupdate');
                }));

        it('delete user account', () =>
            request(server)
                .delete(`/api/user`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .then((r) => {
                    expect(r.text).to.be.a('string');
                }));
    });

});
