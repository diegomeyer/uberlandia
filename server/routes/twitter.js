var express = require('express');
var prettyjson = require('prettyjson');
var PythonShell = require('python-shell');
var path = require('path');
var twitterController = require('../controllers/twitterController.js');
var router = express.Router();

/* GET users listing. */
router.get('/:query', function(req, res, next) {

	twitterController.list(req, function(response){

		var options = {
			noColor: false
		};
		//console.log(prettyjson.render(response, options));

		var string = "<p><b>Assunto:</b>"+req.params.query+ "<br>"+response.length+" resultados georeferenciados";
		for(var i = 0; i < response.length; i ++){
			string += "</p><p><b>texto:</b> "+response[i].text+"<br><b>data:</b> "+ response[i].created_at+"<br><b>coordenadas:</b> " + response[i].coordinates+"<br><b>pontuação:</b> " + response[i].score +"<br><b>classificação:</b> " + response[i].class;
		};

		res.send(string);
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
