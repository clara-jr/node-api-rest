//File: controllers/webController.js
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = "mongodb://localhost:27017/";

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
        level: 		json.level,
        type:  		json.type
    };
    return filter;
};

_id = function(array, id) {
	var i = 0;
	var filter = undefined;
    for (i = 0; i < array.length; i++) {
        if (array[i]._id == id) {
        	filter = array[i];
        	break;
        }
    }
    return filter;
}

//RESTful API

//GET - Return all webs in the DB (Parse response)
exports.findAllWebsParser = function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) return res.status(500).send({error: err.message}); // Internal Server Error
        var dbo = db.db("scrapingdb");
        var query = {};
        dbo.collection("webs").find(query).toArray(function(err, result) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            db.close();
            console.log('GET /webs');
            console.log(result);
            var result_ = new Array();
            for (i in result) {
                result_.push(parseJsonWeb(result[i]));
            }
            res.status(200).jsonp(result_);
        });
    });
};

//GET - Return all webs in the DB
exports.findAllWebs = function(req, res) {  
    MongoClient.connect(url, function(err, db) {
        if (err) return res.status(500).send({error: err.message}); // Internal Server Error
        var dbo = db.db("scrapingdb");
        var query = {};
        dbo.collection("webs").find(query).toArray(function(err, result) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            db.close();
            console.log('GET /webs');
            console.log(result);
            res.status(200).jsonp(result);
        });
    });
};

//GET - Return a Web with specified ID
exports.findById = function(req, res) {
    if (req.params.webId.length != 24) {
        res.status(404).send({error: 'Web inexistent'});
    } else {
        MongoClient.connect(url, function(err, db) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            var dbo = db.db("scrapingdb");
            var query = { _id: ObjectId(req.params.webId) };
            dbo.collection("webs").findOne(query, function(err, result) {
                if (err) return res.status(500).send({error: err.message}); // Internal Server Error
                db.close();
                console.log('GET /webs/' + req.params.webId);
                console.log(result);
                if (result) {
                    res.status(200).jsonp(result);
                } else {
                    res.status(404).send({error: 'Web inexistent'});
                }
            });
        });
    }
};

//GET - Return a Web with specified url (Parse response)
exports.findByUrl = function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) return res.status(500).send({error: err.message}); // Internal Server Error
        var dbo = db.db("scrapingdb");
        var query = { url: req.params.webUrl };
        dbo.collection("webs").findOne(query, function(err, result) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            db.close();
            console.log('GET /webs/url/' + req.params.webUrl);
            console.log(result);
            if (result) {
                var result_ = new Array();
                result_.push(parseJsonWeb(result));
                res.status(200).jsonp(result_);
            } else {
                res.status(404).send({error: 'Web inexistent'});
            }
        });
    });
};

//GET - Return Webs with specified genre (Parse response)
exports.findByGenre = function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) return res.status(500).send({error: err.message}); // Internal Server Error
        var dbo = db.db("scrapingdb");
        var query = { genre: req.params.webGenre };
        dbo.collection("webs").find(query).toArray(function(err, result) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            db.close();
            console.log('GET /webs/genre/' + req.params.webGenre);
            console.log(result);
            if (result.length != 0) {
                var result_ = new Array();
                for (i in result) {
                    result_.push(parseJsonWeb(result[i]));
                }
                res.status(200).jsonp(result_);
            } else {
                res.status(404).send({error: 'No webs with genre: ' + req.params.webGenre});
            }
        });
    });
};

//POST - Insert a new Web in the DB
exports.addWeb = function(req, res) {  
    console.log('POST');
    console.log(req.body);
    var name = req.body.name ? req.body.name : req.body.data.name;
    var url_ = req.body.url ? req.body.url : req.body.data.url;
    var genre = req.body.genre ? req.body.genre : req.body.data.genre;
    var web = {
        name:   name, 
        url:    url_,
        genre:  genre,
        filters: []
    };
    MongoClient.connect(url, function(err, db) {
        if (err) return res.status(500).send({error: err.message}); // Internal Server Error
        var dbo = db.db("scrapingdb");
        var query = { url: url_ };
        dbo.collection("webs").find(query).count(function(err, result) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            console.log(result);
            if (result != 0) {
                db.close();
                res.status(409).send({error: 'Web with url ' + url_ + ' already exists'});
            } else {
                dbo.collection("webs").insertOne(web, function(err, result) {
                    if (err) return res.status(500).send({error: err.message}); // Internal Server Error
                    console.log("1 document inserted");
                    db.close();
                    res.sendStatus(200);
                });
            }
        });
    });
};

//DELETE - Delete a Web with specified ID
exports.deleteWeb = function(req, res) {  
    if (req.params.webId.length != 24) {
        res.status(404).send({error: 'Web inexistent'});
    } else {
        MongoClient.connect(url, function(err, db) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            var dbo = db.db("scrapingdb");
            var query = { _id: ObjectId(req.params.webId) };
            dbo.collection("webs").findOne(query, function(err, result) {
                if (err) return res.status(500).send({error: err.message}); // Internal Server Error
                console.log(result);
                if (result) {
                    dbo.collection("webs").deleteOne(query, function(err, result) {
                        if (err) return res.status(500).send({error: err.message}); // Internal Server Error
                        console.log("1 document deleted");
                        db.close();
                        res.sendStatus(200);
                    });
                } else {
                    db.close();
                    res.status(404).send({error: 'Web inexistent'});
                }
            });
        });
    }
};

//PUT - Insert a new Filter in a Web
exports.addFilterToWeb = function(req, res) {
    if (req.params.webId.length != 24) {
        res.status(404).send({error: 'Web inexistent'});
    } else {
        MongoClient.connect(url, function(err, db) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            var dbo = db.db("scrapingdb");
            var query = { _id: ObjectId(req.params.webId) };
            dbo.collection("webs").findOne(query, function(err, result) {
                if (err) return res.status(500).send({error: err.message}); // Internal Server Error
                console.log('GET /webs/' + req.params.webId);
                console.log(result);
                if (result) {
                    var count = result.filters.length;
                    console.log('ADD filter: ' + count);
                    var filter = result.filters.some(item => item.pattern === req.body.pattern);
                    if (filter) {
                        db.close();
                        res.status(409).send({error: 'Filter with pattern ' + req.body.pattern + ' already exists'});
                    } else {
                        var values = { $push: { filters: { _id: ObjectId(), pattern: req.body.pattern, level: req.body.level, type: req.body.filterType } } };
                        dbo.collection("webs").updateOne(query, values, function(err, result) {
                            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
                            console.log("1 document updated");
                            db.close();
                            res.sendStatus(200);
                        });
                    }
                } else {
                    db.close();
                    res.status(404).send({error: 'Web inexistent'});
                }
            });
        });
    }
}

//GET - Return a Filter with specified ID
exports.getFilterOfWeb = function(req, res) {
    var webId = req.params.webId;
    var filterId = req.params.filterId;
    if (webId.length != 24) {
        res.status(404).send({error: 'Web inexistent'});
    } else if (filterId.length != 24) {
        res.status(404).send({error: 'Filter inexistent'});
    } else {
        MongoClient.connect(url, function(err, db) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            var dbo = db.db("scrapingdb");
            var query = { _id: ObjectId(webId) };
            dbo.collection("webs").findOne(query, function(err, result) {
                if (err) return res.status(500).send({error: err.message}); // Internal Server Error
                console.log('GET /webs/' + webId);
                console.log(result);
                db.close();
                if (result) {
                    var filter = _id(result.filters, filterId);
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
        });
    }
}

//PUT - Update a Filter of a Web
exports.updateFilterOfWeb = function(req, res) { 
    var webId = req.params.webId;
    var filterId = req.params.filterId;
    var filterPattern = req.body.pattern;
    var filterLevel = req.body.level;
    var filterType = req.body.filterType; 
    if (webId.length != 24) {
        res.status(404).send({error: 'Web inexistent'});
    } else if (filterId.length != 24) {
        res.status(404).send({error: 'Filter inexistent'});
    } else {
        MongoClient.connect(url, function(err, db) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            var dbo = db.db("scrapingdb");
            var query = { _id: ObjectId(webId) };
            dbo.collection("webs").findOne(query, function(err, result) {
                if (err) return res.status(500).send({error: err.message}); // Internal Server Error
                console.log('GET /webs/' + webId);
                console.log(result);
                if (result) {
                    var filter_new = result.filters.some(item => item.pattern === filterPattern);
                    var filter = _id(result.filters, filterId);
                    if (filter) {
                        console.log(filter);
                        console.log(filter_new);
                        if (filter_new && filterPattern != filter.pattern) {
                            db.close();
                            res.status(409).send({error: 'Filter with pattern ' + filterPattern + ' already exists'});
                        } else {
                            var query = { 'filters._id': ObjectId(filterId) };
                            console.log(filterPattern);
                            var values = { $set: { 'filters.$.pattern': filterPattern, 'filters.$.level': filterLevel, 'filters.$.type': filterType } };
                            dbo.collection("webs").updateOne(query, values, function(err, result) {
                                if (err) return res.status(500).send({error: err.message}); // Internal Server Error
                                console.log("1 document updated");
                                db.close();
                                res.sendStatus(200);
                            });
                        }
                    } else {
                        db.close();
                        res.status(404).send({error: 'Filter inexistent'});
                    }
                } else {
                    db.close();
                    res.status(404).send({error: 'Web inexistent'});
                }
            });
        });
    }
}

//PUT - Delete a Filter of a Web
exports.deleteFilterOfWeb = function(req, res) {  
	var webId = req.params.webId;
    var filterId = req.params.filterId;
    if (webId.length != 24) {
        res.status(404).send({error: 'Web inexistent'});
    } else if (filterId.length != 24) {
        res.status(404).send({error: 'Filter inexistent'});
    } else {
        MongoClient.connect(url, function(err, db) {
            if (err) return res.status(500).send({error: err.message}); // Internal Server Error
            var dbo = db.db("scrapingdb");
            var query = { _id: ObjectId(webId) };
            dbo.collection("webs").findOne(query, function(err, result) {
                if (err) return res.status(500).send({error: err.message}); // Internal Server Error
                console.log('GET /webs/' + webId);
                console.log(result);
                if (result) {
                    var filter = _id(result.filters, filterId);
                    if (filter) {
                        var query = { _id: ObjectId(webId) };
	                    var values = { $pull: { filters: { _id: ObjectId(filterId) } } };
	                    dbo.collection("webs").updateOne(query, values, function(err, result) {
	                        if (err) return res.status(500).send({error: err.message}); // Internal Server Error
	                        console.log("1 document updated");
	                        db.close();
	                        res.sendStatus(200);
	                    });
                    } else {
                    	db.close();
                        res.status(404).send({error: 'Filter inexistent'});
                    }
                } else {
                	db.close();
                    res.status(404).send({error: 'Web inexistent'});
                }
            });
        });
    }
}
