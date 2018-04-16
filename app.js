var express = require("express");
var app = express();
var bodyParser  = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require('mongoose');

var cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());

var routes = require('./routes/index');
app.use('/', routes);

mongoose.connect('mongodb://localhost/webfiltersdbbb', function(err, res) {  //'mongodb://admin:admin@ds125183.mlab.com:25183/webfilters', function(err, res) {  
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  }
  app.listen(1607, function() {
    console.log("Node server running on http://localhost:1607");
  });
});

module.exports = app;