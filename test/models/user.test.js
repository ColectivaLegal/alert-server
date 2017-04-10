const chai = require('chai');
const assert = chai.assert;
const db = require('../../models/db.js');
const User = require('../../models/user.js').User;


describe('User Model', () => {
    before('Reset database', (done) => {
        // TODO:  Give our db exports a direct way to drop the database, without going through mongoose in the test suite.
        db.db.dropDatabase((err) => {
            done(err);
        });
    })

    it('Should be possible to create a user', (done) => {
        let user = new User();
        user.save().then(() => {done()});
    });

    it('Should generate unique secrets for each user', (done) => {
        let user1 = new User();
        let user2 = new User();
        assert.notEqual(user1.verification_secret, user2.verification_secret);
        done();
    })

    it('Should successfully verify when given the correct secret', (done) => {
        let user = new User();
        assert.isFalse(user.is_verified);
        assert.isTrue(user.verify(user.verification_secret));
        assert.isTrue(user.is_verified);
        done();
    });

    it('Should not successfully verify when given an incorrect secret', (done) => {
        let user = new User();
        assert.isFalse(user.is_verified);
        assert.isFalse(user.verify('12345'));
        assert.isFalse(user.is_verified);
        done();
    });
})