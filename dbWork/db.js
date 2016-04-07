'use strict';
var mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'testing';

//get the db config stuff for mongoose from the application config file
//nconf.use('file', {
//    file: process.cwd() + '/config/app.json',
//    format: nconf.formats.json
//});
//var dbConf = nconf.get('databaseConfig')[env];



var db = function() {
    return {
        connect: function() {
            if(!mongoose.connection.db) {
                //mongoose.connect("mongodb://" + dbConf.host + '/' + dbConf.database);
                mongoose.connect('mongodb://alexf4:1grinder@ds019700-a0.mlab.com:19700,ds019700-a1.mlab.com:19700/authtest?connectTimeoutMS=120000&socketTimeoutMS=120000')
            }
        }
    };
};

module.exports = db();