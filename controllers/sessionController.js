//File: controllers/sessionController.js
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var sha256 = require('js-sha256');

exports.login = function(req, res) {  
    var login = req.params.u;
    var password = req.params.p;
    var hash = sha256(password);
    MongoClient.connect(url, function(err, db) {
        if (err) return res.status(500).send({error: err.message}); // Internal Server Error
        var dbo = db.db("scrapingdb");
        var query = { username: login };
        dbo.collection("users").findOne(query, function(err, result) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            db.close();
            if (result.username) {
                if (hash === result.password) {
                    res.sendStatus(200);
                } else {
                    res.status(403).send({error: 'Incorrect password'});
                }
            } else {
                res.status(403).send({error: 'Incorrect username'});
            }
        });
    });
};

// Once: http://localhost:8080/create/admin/password
exports.create = function(req, res) {
    var username = req.params.u;
    var password = req.params.p;
	var hash = sha256(password);
    var user = {
        username:    username,
        password:  hash
    };
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("scrapingdb");
        dbo.collection("users").insertOne(user, function(err, result) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            console.log("1 document inserted");
            db.close();
            res.sendStatus(200);
        });
    });
};