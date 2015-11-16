var colors = require('colors/safe');

var twitterController = require('./controllers/twitterController');

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  
  router.get('/', server.loopback.status());

  router.get('/twitter/:query', function(req, res) {

    twitterController.list(req, function(response){
      res.send(response);
    });


  	// npm
    
  	//Tweet.find({texto:query}, function(err, response){
  		
    	//console.log(colors.blue('uberlandia: ') + "response: ");
    	//console.log(response);
    	
  	//});
    
    
  });


  server.use(router);
};

