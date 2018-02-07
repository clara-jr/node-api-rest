//File: controllers/sessionController.js
var mongoose = require('mongoose');  
require('../models/user');
var User  = mongoose.model('User');
var sha256 = require('js-sha256');

exports.login = function(req, res) {  
    var login = req.params.u;
    var password = req.params.p;
    var hash = sha256(password);
    User.find({username: login}, function(err, user) {
        if(err) return res.status(500).send(err.message);
        if (user.length != 0) {
        	if (hash === user[0].password) {
        		res.status(200).jsonp({correct: true});
        	} else {
        		res.status(200).jsonp({correct: false, message: 'Incorrect password'});
        	}
        } else {
            res.status(200).jsonp({correct: false, message: 'Incorrect username'});
        }
    });
};

// Once: http://localhost:8080/create/admin/password
exports.create = function(req, res) {
    var username = req.params.u;
    var password = req.params.p;
	var hash = sha256(password);
    var user = new User({
        username:    username,
        password:  hash
    });
    user.save(function(err, user) {
        if(err) return res.status(500).send(err.message);
        res.status(200).jsonp(user);
    });
};