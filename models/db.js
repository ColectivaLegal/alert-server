const mongoose = require('mongoose');
const settings = require('../settings.js');

const db = mongoose.connection;
mongoose.Promise = global.Promise;

function connect(callback) {
    mongoose.connect(settings.mongo.mongoConnectionUriFull, callback);
    db.once('open', ()=> { console.log("DB Connection established"); });
}

module.exports = {
    connect: connect,
    db: mongoose.connection,
};

