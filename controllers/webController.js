//File: controllers/webController.js
var mongoose = require('mongoose');  
require('../models/web');
var Web  = mongoose.model('Web');

//RESTful API

//GET - Return all webs in the DB
exports.findAllWebs = function(req, res) {  
    Web.find(function(err, webs) {
    	if(err) res.send(500, err.message);
    	console.log('GET /webs')
        res.status(200).jsonp(webs);
    });
};

//GET - Return a Web with specified ID
exports.findById = function(req, res) {  
    Web.findById(req.params.webId, function(err, web) {
    	if(err) return res.status(500).send(err.message);
    	console.log('GET /webs/' + req.params.webId);
        res.status(200).jsonp(web);
    });
};

//GET - Return a Web with specified url
exports.findByUrl = function(req, res) {  
    console.log('GET /webs/url/' + req.body.url);
    Web.find({url: req.body.url}).count(function(err, count) {
        if(err) return res.send(500, err.message);
        console.log('GET /webs/url/' + req.body.url);
        console.log('GET /webs/url/' + count);
        res.status(200).jsonp(count); 
    });
};

//POST - Insert a new Web in the DB
exports.addWeb = function(req, res) {  
    console.log('POST');
    console.log(req.body);
    var url = req.body.url ? req.body.url : req.body.data.url;
    var genre = req.body.genre ? req.body.genre : req.body.data.genre;
    var web = new Web({
        url:    url,
        genre:  genre
    });
    web.save(function(err, web) {
        if(err) return res.status(500).send(err.message);
        res.status(200).jsonp(web);
    });
};

//DELETE - Delete a Web with specified ID
exports.deleteWeb = function(req, res) {  
    Web.findById(req.params.webId, function(err, web) {
        web.remove(function(err) {
            if(err) return res.status(500).send(err.message);
      		res.status(200).send();
        })
    });
};

//PUT - Insert a new Filter in a Web
exports.addFilterToWeb = function(req, res) {  
    var webId = req.params.webId;
    Web.findById(webId, function(err, web) {
        var count = web.filters.length;
        console.log('ADD filter: ' + count);
        Web.update({_id: webId},{$push: {filters:{pattern: [req.body.pattern], type: [req.body.filterType]}}}, {upsert:true}, function(err, result) {
           console.log(result);
           res.json(result);
        });
    });
}

//GET - Return a Filter with specified ID
exports.getFilterOfWeb = function(req, res) {  
    var webId = req.params.webId;
    var filterId = req.params.filterId;
    console.log('GET filter');
    Web.findById(webId, function(err, web) {
        if(err) return res.status(500).send(err.message);
        var filter = web.filters.id(filterId);
        console.log('GET filter' + filter);
        console.log('GET filter' + filter.pattern);
        res.status(200).jsonp(filter);
        // if (filter == 'undefined') res.json("Filter does not exists in DB.");
    });
}

//PUT - Update a Filter of a Web
exports.updateFilterOfWeb = function(req, res) {  
	var webId = req.params.webId;
	var filterId = req.params.filterId;
  	var filterPattern = req.body.pattern;
  	var filterType = req.body.filterType;
	Web.findOne({_id: webId, filters: {$elemMatch: {_id: filterId}}}).count(function(err, count)
	{
		if(count == 0) {
			res.json("Filter does not exists in DB.");
		} else {
            console.log('UPDATE filter: ' + count);
		    Web.update({'filters._id': filterId}, {'$set': {
			    'filters.$.pattern': filterPattern,
			    'filters.$.type': filterType
				}}, function(err) {
					if(err) return res.status(500).send(err.message);
      				res.status(200).send();
				}
			);
		}
	});
}

//PUT - Delete a Filter of a Web
exports.deleteFilterOfWeb = function(req, res) {  
    var webId = req.params.webId;
    var filterId = req.params.filterId;
    Web.findOne({_id: webId, filters: {$elemMatch: {_id: filterId}}}).count(function(err, count)
    {
        if(count == 0) {
            res.json("Filter does not exists in DB.");
        } else {
            Web.update({_id: webId},{$pull: {filters:{_id: [filterId]}}}, function(err, result) {
               console.log(result);
               res.json(result);
            });
        }
    });
}
