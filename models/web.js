var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var webSchema = new Schema({  
  url:    { type: String },
  genre:    { type: String, enum:
  ['News', 'Sports', 'Films', 'Music', 'Free Time'] },
  filters : [{
  		id : { type: Number },
        pattern : { type: String },
        type : { type: String, enum: 
        	['Title', 'Body', 'Date', 'Author'] }
    }]
});

module.exports = mongoose.model('Web', webSchema); 

/*

var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var filterSchema = new Schema({
	pattern : { type: String },
    type : { type: String, enum: 
        ['Title', 'Body', 'Date', 'Author'] }
})

var webSchema = new Schema({  
  url:    { type: String },
  genre:    { type: String, enum:
  ['News', 'Sports', 'Films', 'Music', 'Free Time'] },
  filters : [filterSchema]
});

module.exports = mongoose.model('Web', webSchema); 

*/