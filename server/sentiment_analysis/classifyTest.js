var m = require('./classify');

var tweets = ["Amo", "#odeio", "vc é louco cachoeira"];

m.classifyArray(tweets, 'pt-br', 'en', function(result) {
	console.log(result);
});