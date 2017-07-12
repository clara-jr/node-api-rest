var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var webSchema = new Schema({  
  url:    { type: String },
  genre:    { type: String, enum:
  ['News', 'Sports', 'Films', 'Music', 'Free Time'] },
  filters : [{
        pattern : { type: String },
        type : { type: String, enum: 
        	['Title', 'Body', 'Date', 'Author'] }
    }]
});

module.exports = mongoose.model('Web', webSchema); 