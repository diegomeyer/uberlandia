var colors = require('colors/safe');

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  
  router.get('/', server.loopback.status());

  router.get('/tweeter/:query', function(req, res) {
  	var query = req.params.query;

  	var Tweet = server.models.Tweet;
  	
  	console.log(colors.blue('uberlandia: ') + "query: "+ query);

  	Tweet.find({texto:query}, function(err, response){
  		
    	console.log(colors.blue('uberlandia: ') + "response: ");
    	console.log(response);
    	res.send(response);
  	});
    
    
  });


  server.use(router);
};
