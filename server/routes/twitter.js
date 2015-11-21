var express = require('express');
var twitterController = require('../controllers/twitterController.js');
var router = express.Router();

/* GET users listing. */
router.get('/:query', function(req, res, next) {

	twitterController.list(req, function(response){
      res.send(response);
    });

});

module.exports = router;
