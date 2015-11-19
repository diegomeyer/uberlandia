var express = require('express');
var prettyjson = require('prettyjson');
var PythonShell = require('python-shell');
var path = require('path');
var twitterController = require('../controllers/twitterController.js');
var router = express.Router();

/* GET users listing. */
router.get('/:query', function(req, res, next) {

	twitterController.list(req, function(response){
      res.send(response);
    });

});

var python = function() {

	PythonShell.defaultOptions  = {
		scriptPath: path.join(__dirname, 'scripts')
	};

	PythonShell.run('classify.py', function(err, result){
		if (err) throw err;
		//var json = JSON.parse(result);
		console.log(result);
	});

	// receive a message in JSON mode


}

module.exports = router;
