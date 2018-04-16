//File: controllers/webController.js
var mongoose = require('mongoose');  
require('../models/web');
var Web  = mongoose.model('Web');

parseJsonWeb = function(json) {
    var web = {
        name:   json.name,
        url:    json.url,
        genre:  json.genre
    };
    var filters_ = new Array();
    for (var i = 0; i<json.filters.length; i++) {
        filters_.push(parseJsonFilter(json.filters[i]));
    }
    web.filters = filters_;
    return web;
};

parseJsonFilter = function(json) { 
    var filter = {
        pattern:    json.pattern,
        level: json.level,
        type:  json.type
    };
    return filter;
};

//RESTful API

//GET - Return all webs in the DB (Parse response)
exports.findAllWebsParser = function(req, res) {  
    Web.find(function(err, webs) {
        if(err) return res.status(500).send({error: err.message}); // Internal Server Error
        console.log('GET /webs')
        var webs_ = new Array();
        for (i in webs) {
            webs_.push(parseJsonWeb(webs[i]));
        }
        res.status(200).jsonp(webs_);
    });
};

//GET - Return all webs in the DB
exports.findAllWebs = function(req, res) {  
    Web.find(function(err, webs) {
        if(err) return res.status(500).send({error: err.message}); // Internal Server Error
        console.log('GET /webs')
        res.status(200).jsonp(webs);
    });
};

//GET - Return a Web with specified ID
exports.findById = function(req, res) {  
    Web.findById(req.params.webId, function(err, web) {
    	if(err) return res.status(500).send({error: err.message}); // Internal Server Error
    	console.log('GET /webs/' + req.params.webId);
        console.log(web);
        if (web) {
            res.status(200).jsonp(web);
        } else {
            res.status(404).send({error: 'Web inexistent'});
        }
    });
};

//GET - Return a Web with specified url (Parse response)
exports.findByUrl = function(req, res) {
    Web.find({url: req.params.webUrl}, function(err, web) {
        if(err) return res.status(500).send({error: err.message}); // Internal Server Error
        console.log('GET /webs/url/' + req.params.webUrl);
        console.log(web);
        if (web.length != 0) {
            var web_ = new Array();
            web_.push(parseJsonWeb(web[0]));
            res.status(200).jsonp(web_);
        } else {
            res.status(404).send({error: 'Web inexistent'});
        }
    });
};

//GET - Return Webs with specified genre (Parse response)
exports.findByGenre = function(req, res) {
    Web.find({genre: req.params.webGenre}, function(err, webs) {
        if(err) return res.status(500).send({error: err.message}); // Internal Server Error
        console.log('GET /webs/genre/' + req.params.webGenre);
        console.log(webs);
        if (webs.length != 0) {
            var webs_ = new Array();
            for (i in webs) {
                webs_.push(parseJsonWeb(webs[i]));
            }
            res.status(200).jsonp(webs_);
        } else {
            res.status(404).send({error: 'No webs with genre: '+req.params.webGenre});
        }
    });
};

//POST - Insert a new Web in the DB
exports.addWeb = function(req, res) {  
    console.log('POST');
    console.log(req.body);
    var name = req.body.name ? req.body.name : req.body.data.name;
    var url = req.body.url ? req.body.url : req.body.data.url;
    var genre = req.body.genre ? req.body.genre : req.body.data.genre;
    var web = new Web({
        name:   name, 
        url:    url,
        genre:  genre
    });
    Web.find({url: url}).count(function(err, count) {
    	if(err) return res.status(500).send({error: err.message}); // Internal Server Error
        if (count != 0) {
            res.status(409).send({error: 'Web with url '+url+' already exists'});
        } else {
            web.save(function(err, web) {
                if(err) return res.status(500).send({error: err.message}); // Internal Server Error
                console.log(web);
                res.status(200).jsonp(web);
            });
        }
    });
};

//DELETE - Delete a Web with specified ID
exports.deleteWeb = function(req, res) {  
    Web.findById(req.params.webId, function(err, web) {
    	if(err) return res.status(500).send({error: err.message}); // Internal Server Error
        if (web) {
            web.remove(function(err) {
	            if(err) return res.status(500).send({error: err.message}); // Internal Server Error
	      		res.status(200).send();
	        })
        } else {
            res.status(404).send({error: 'Web inexistent'});
        }
    });
};

//PUT - Insert a new Filter in a Web
exports.addFilterToWeb = function(req, res) {  
    var webId = req.params.webId;
    Web.findById(webId, function(err, web) {
    	if(err) return res.status(500).send({error: err.message}); // Internal Server Error
    	if (web) {
            var count = web.filters.length;
	        console.log('ADD filter: ' + count);
	        var filter = web.filters.some(item => item.pattern === req.body.pattern);
	        if (filter) {
	            res.status(409).send({error: 'Filter with pattern '+req.body.pattern+' already exists'});
	        } else {
	            Web.update({_id: webId},{$push: {filters:{pattern: [req.body.pattern], level: [req.body.level], type: [req.body.filterType]}}}, {upsert:true}, function(err, result) {
	               if(err) return res.status(500).send({error: err.message}); // Internal Server Error
	               res.json(200).send();
	            });
	        }
        } else {
            res.status(404).send({error: 'Web inexistent'});
        }
    });
}

//GET - Return a Filter with specified ID
exports.getFilterOfWeb = function(req, res) {  
    var webId = req.params.webId;
    var filterId = req.params.filterId;
    console.log('GET filter');
    Web.findById(webId, function(err, web) {
        if(err) return res.status(500).send({error: err.message}); // Internal Server Error
        if (web) {
            var filter = web.filters.id(filterId);
            if (filter) {
                console.log('GET filter' + filter);
                res.status(200).jsonp(filter);
            } else {
                res.status(404).send({error: 'Filter inexistent'});
            }
        } else {
            res.status(404).send({error: 'Web inexistent'});
        }
    });
}

//PUT - Update a Filter of a Web
exports.updateFilterOfWeb = function(req, res) {  
    var webId = req.params.webId;
    var filterId = req.params.filterId;
    var filterPattern = req.body.pattern;
    var filterLevel = req.body.level;
    var filterType = req.body.filterType;
    Web.findById(webId, function(err, web) {
        if(err) return res.status(500).send({error: err.message}); // Internal Server Error
        if (web) {
            var filter_new = web.filters.some(item => item.pattern === req.body.pattern);
	        var filter = web.filters.id(filterId);
	        if (filter) {
	            console.log(filter);
	            console.log(filter_new);
	            if (filter_new && req.body.pattern != filter.pattern) {
	                res.status(409).send({error: 'Filter with pattern '+req.body.pattern+' already exists'});
	            } else {
	                Web.update({'filters._id': filterId}, {'$set': {
	                    'filters.$.pattern': filterPattern,
                        'filters.$.level': filterLevel,
	                    'filters.$.type': filterType
	                    }}, function(err) {
	                        if(err) return res.status(500).send({error: err.message}); // Internal Server Error
	                        res.status(200).send();
	                    }
	                );
	            }
	        } else {
	            res.status(404).send({error: 'Filter inexistent'});
	        }
        } else {
            res.status(404).send({error: 'Web inexistent'});
        }
    });
}

//PUT - Delete a Filter of a Web
exports.deleteFilterOfWeb = function(req, res) {  
    var webId = req.params.webId;
    var filterId = req.params.filterId;
    Web.findOne({_id: webId, filters: {$elemMatch: {_id: filterId}}}).count(function(err, count) {
    	if(err) return res.status(500).send({error: err.message}); // Internal Server Error
        if(count == 0) {
            res.status(404).send({error: 'Filter inexistent'});
        } else {
            Web.update({_id: webId},{$pull: {filters:{_id: [filterId]}}}, function(err, result) {
            	if(err) return res.status(500).send({error: err.message}); // Internal Server Error
               	res.status(200).send();
            });
        }
    });
}
