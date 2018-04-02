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
        if(err) return res.status(500).send({error: err.message}); // Internal Server Error
        if (user.length != 0) {
        	if (hash === user[0].password) {
        		res.status(200).send();
        	} else {
        		res.status(403).send({error: 'Incorrect password'});
        	}
        } else {
            res.status(403).send({error: 'Incorrect username'});
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
        if(err) return res.status(500).send({error: err.message}); // Internal Server Error
        res.status(200).jsonp(user);
    });
};