var express = require("express");
var app = express();
var bodyParser  = require("body-parser");
var methodOverride = require("method-override");
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/scrapingdb";

var cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());

var routes = require('./routes/index');
app.use('/', routes);

// Create database

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

// Create collection

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("scrapingdb");
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("scrapingdb");
  dbo.createCollection("webs", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});

app.listen(1607, function() {
    console.log("Node server running on http://localhost:1607");
});

module.exports = app;