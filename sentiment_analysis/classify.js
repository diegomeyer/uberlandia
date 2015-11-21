var MsTranslator = require('mstranslator');
var bayes = require('bayes')

var stateJson = require('./naivebayes.json');
var classifier = bayes.fromJson(stateJson)

var client = new MsTranslator({
  client_id: "uberlandia"
  , client_secret: "MlqN4nijjPlGfXyZmuYZB5jW3/GmDGKUWLGosuQj9LY="
}, true);

var tweets = ["Amo", "odeio", "vc é louco cachoeira"];

var params = {
  texts: tweets//'tem que ser retardado pra gostar do bolsonaro'
  , from: 'pt-br'
  , to: 'en'
};

var data;
var resultado = [];
// // Don't worry about access token, it will be auto-generated if needed.
client.translateArray(params, function(err, data) {
	data.forEach(function(tweet) {
		console.log(tweet.TranslatedText);
		console.log(classifier.categorize(String(tweet.TranslatedText)))
		resultado.push(classifier.categorize(String(tweet.TranslatedText)))
	});
});