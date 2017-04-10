const request = require('supertest');
const chai = require('chai');
const assert = chai.assert;
const db = require('../../models/db.js');
const User = require('../../models/user.js').User;
const app = require('../../app.js');
const apiRoot = require('../../settings.js').routing.apiRoot;

describe('Auth routes', () => {
    before('Reset database', (done) => {
        // TODO:  Give our db exports a direct way to drop the database, without going through mongoose in the test suite.
        db.db.dropDatabase((err) => {
            done(err);
        });
    })

    it('Should be possible to create a user', (done) => {
        request(app)
            .post(apiRoot + '/auth-token')
            .expect(200).end((err, res) => {
                assert.isDefined(res);
                assert.isDefined(res.body);
                assert.isDefined(res.body.id);
                assert.isDefined(res.body.verification_secret);
                err ? done(err) : done();
            });
    });

    it('Should be possible to verify a user', (done) => {
        request(app)
            .post(apiRoot + '/auth-token')
            .expect(200).end((err, res) => {
                if (err) {done(err)}
                else {
                    let verification_response = res.body;
                    request(app)
                        .put(apiRoot + '/auth-token')
                        .type('form')
                        .send(verification_response)
                        .expect(200).end((err, res) => {
                            err ? done(err) : done();
                        })
                }
            });
    });

    it('Should not be possible to verify a user without the correct verification_secret', (done) => {
        request(app)
            .post(apiRoot + '/auth-token')
            .expect(200).end((err, res) => {
                if (err) {done(err)}
                else {
                    let verification_response = res.body;
                    verification_response.verification_secret = verification_response.verification_secret + 'a';
                    request(app)
                        .put(apiRoot + '/auth-token')
                        .type('form')
                        .send(verification_response)
                        .expect(400).end((err, res) => {
                            err ? done(err) : done();
                        })
                }
            });
    });
})