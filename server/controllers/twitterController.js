var url = require('url');
var Tweet = require('../models/tweet');
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'DdxyopTagiCxG3Je2SBQgzQj0',
  consumer_secret: 'FeDfrBkCVKdhnQBSzdksELac0iZqoe6vTitfGZ2eslSzHEXfkb',
  access_token_key: '154909777-S5fPVWEFzWdXXXLMpqETvDJaSoK9hNGVV28ChEoR',
  access_token_secret: 'MUxUC9Lvi3u5xEWJHCWz78qgQ9N4whGaYtHaqQQ0mKtjk'
});

exports.list = function (request, callBack) {
	var query = request.params.query;
	var array = [];
	twitterSearch(query, function(response){
		callBack(filterJSON(response));
	});
}


var twitterSearch = function(query, callBack){

	client.get('search/tweets', {q: query, count:100, geocode:'-14.3204892,-41.676742,2500km'}, function(error, tweets, response){
		if (!error) {
			callBack(tweets);
		}else{
			console.log(error);
		}
	});
}

var filterJSON = function (json) {
	var filteredArray = [];
	debugger;
	for(var i = 0; i < json.statuses.length; i++){
		var tweet = json.statuses[i];
		if (tweet.coordinates !== null) {
			filteredArray.push(
				{
					"text":tweet.text,
					"created_at":tweet.created_at,
					"coordinates":tweet.coordinates.coordinates
				}
			);
		}
	}

	return filteredArray;

}
