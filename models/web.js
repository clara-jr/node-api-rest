var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

var webSchema = new Schema({ 
  name:    { type: String }, 
  url:    { type: String },
  genre:    { type: String, enum:
  ['Reference', 'News', 'Sports', 'Science', 'Communication Media', 'Home', 'Recreation'] },
  filters : [{
        pattern : { type: String },
        level : { type: String },
        type : { type: String, enum: 
        	['Title', 'Body', 'Date', 'Author', 'Image', 'Audio', "Section", "Logo"] }
    }]
});

module.exports = mongoose.model('Web', webSchema); 