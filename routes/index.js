var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {  
   res.send("Hello World!");
});

var webController = require('../controllers/webController');
var sessionController = require('../controllers/sessionController');

router.route('/login/:u/:p')  
  .get(sessionController.login);

router.route('/webs')  
  .get(webController.findAllWebs)
  .post(webController.addWeb);

router.route('/webs/:webId')  
  .get(webController.findById)
  .put(webController.addFilterToWeb)
  .delete(webController.deleteWeb);

router.route('/url')  
  .get(webController.findByUrl);

router.route('/webs/:webId/:filterId') 
  .get(webController.getFilterOfWeb)
  .put(webController.updateFilterOfWeb)
  .delete(webController.deleteFilterOfWeb);

module.exports = router;