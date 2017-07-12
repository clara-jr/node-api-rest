var express = require("express");
var app = express();
var bodyParser  = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());

var routes = require('./routes/index');
app.use('/', routes);

mongoose.connect('mongodb://localhost/webfilters', function(err, res) {  
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  }
  app.listen(8080, function() {
    console.log("Node server running on http://localhost:8080");
  });
});

module.exports = app;