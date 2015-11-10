var express = require('express');
var prettyjson = require('prettyjson');
var twitterController = require('../controllers/twitterController.js');
var router = express.Router();

/* GET users listing. */
router.get('/:query', function(req, res, next) {

	twitterController.list(req, function(response){
		var options = {
		  noColor: false
		};
		console.log(prettyjson.render(response, options));
		var string = "";
		for(var i = 0; i < response.length; i ++){
			string += "</p><p><b>texto:</b> "+response[i].text+"<br><b>data:</b> "+ response[i].created_at+"<br><b>coordenadas:</b> " + response[i].coordinates
		}

		res.send(string);
	});

});

module.exports = router;
