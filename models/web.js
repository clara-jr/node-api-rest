var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var webSchema = new Schema({  
  url:    { type: String },
  genre:    { type: String, enum:
  ['Reference', 'News', 'Sports', 'Science', 'Communication Media', 'Home', 'Recreation'] },
  filters : [{
        pattern : { type: String },
        type : { type: String, enum: 
        	['Title', 'Body', 'Date', 'Author', 'Image'] }
    }]
});

module.exports = mongoose.model('Web', webSchema); 