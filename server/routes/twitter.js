var express = require('express');
var twitterController = require('../controllers/twitterController.js');
var router = express.Router();

/* GET users listing. */
router.get('/twitter', function(req, res, next) {

	var wpsRequest = req.query.Request;


	if (wpsRequest  !== undefined) {
		if (wpsRequest === 'Execute') {
			twitterController.list(req, function(response){
      			res.send(response);
    		});
		}else if (wpsRequest === 'DescribeProcess') {
			res.send(describeProcess);
		}if (wpsRequest === 'GetCapabilities') {
			res.send(getCapabilities);
		}	
	}
	

});

module.exports = router;


var getCapabilities = {
  "service": "Uberlandia",
  "version": "0.7",
  "lang": "pt-br",
  "service_identification": "twitter, mapa, geolocalização, sentimento, redes neurais, brasil, positivo, negativo",
  "service_provider": "Diego Meyer, Guilherme Nardari, Renato Borella, Willian Fagner",
  "operations_metadata": {
    "describeProcess": "http://foo.bar/twitter?service=WPS&Request=DescribeProcess&Version=MinVersion&Identifier=",
    "Execute": "http://foo.bar/twitter?service=WPS&Request=Execute&Version=MinVersion&DataInputs=String"
  },
  "process_offerings": {
    "describeProcess": "Retorna a descrição de um processo como JSON",
    "Execute": "Executa o serviço usando o parâmetro DataInputs, retorna um JSON"
  },
  "languages": ["pt-br"]
};

var describeProcess = {
  "InputType": "String",
  "Output": "JSON",
  "Description": "Usa a API do Twitter para pesquisar o tópico definidor pelo parâmetro DataInputs e faz analise de sentimento dos dados, retornando um JSON com o coeficiente de opinião de determinada região"
}