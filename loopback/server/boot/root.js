var colors = require('colors/safe');

var twitterController = require('./controllers/twitterController');

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  
  router.get('/', server.loopback.status());

  router.get('/twitter/:query', function(req, res) {

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


  	// npm
    
  	//Tweet.find({texto:query}, function(err, response){
  		
    	//console.log(colors.blue('uberlandia: ') + "response: ");
    	//console.log(response);
    	
  	//});
    
    
  });


  server.use(router);
};

