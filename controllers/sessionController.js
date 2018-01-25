//File: controllers/sessionController.js

exports.login = function(req, res) {  
    var login = req.params.u;
    var password = req.params.p;
    if (login === "admin" && password === "password") {
        res.status(200).jsonp({correct:true});
    } else {
        res.status(200).jsonp({correct: false, message: 'Incorrect user or password'});
    }
};