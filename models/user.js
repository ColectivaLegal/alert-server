const mongoose = require('mongoose');
const uuid = require('uuid/v4');

var userSchema = new mongoose.Schema({
    verification_secret: {
        type: String,
        default: uuid,
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_blocked: {
        type: Boolean,
        default: false 
    }
});

userSchema.methods.verify = function(secret) {
    var retval = false;
    if (secret === this.verification_secret) {
        this.is_verified = true;
        this.save();
        retval = true;
    }
    return retval;
};

var User = mongoose.model('User',  userSchema);

module.exports = {
    User: User
}