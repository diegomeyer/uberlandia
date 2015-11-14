var colors = require('colors/safe');
var inside = require('point-in-polygon');
module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  
  router.get('/', server.loopback.status());

  router.get('/twitter/:query', function(req, res) {
  	var query = req.params.query;

  	var Tweet = server.models.Tweet;

    var polygon = [ [ 0, 0 ], [ -2, -2 ], [ 0, -2 ], [ 2, 0 ] ];
     
    console.dir([
        inside([ -1, -1 ], polygon),
        inside([ 4.9, 1.2 ], polygon),
        inside([ 1.8, 1.1 ], polygon)
    ]);
    
  	//Tweet.find({texto:query}, function(err, response){
  		
    	//console.log(colors.blue('uberlandia: ') + "response: ");
    	//console.log(response);
    	
  	//});
    
    
  });


  server.use(router);
};

