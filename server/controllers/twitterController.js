var url = require('url');
var sentiment = require('sentiment')
var Twitter = require('twitter');

var destruir = "";

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
			twitterStream(query);
			destruir = true;
			callBack(tweets);
		}else{
			console.log(error);
		}
	});
}

var twitterStream = function(query) {

	/**
	 * Stream statuses filtered by keyword
	 * number of tweets per second depends on topic popularity
	 **/

	client.stream('statuses/filter', {track: query},  function(stream){
	  	stream.on('data', function(tweet) {
	    	console.log(tweet.text);
	  	});

	  	stream.on('error', function(error) {
	    	console.log(error);
	 	});

	  	if (destruir !== query) {
	  		destruir = query;
	  		stream.destroy;

	  	}
	});
}

var filterJSON = function (json) {
	var filteredArray = [];
	debugger;
	var min = 0;
	var max = 0;
	for(var i = 0; i < json.statuses.length; i++){
		var tweet = json.statuses[i];

		if (tweet.coordinates !== null) {
			var classifier = sentiment(tweet.text);
			console.dir(classifier);
			var score = classifier.score;
			if (score > max) {
				max = score;
			}

			if (score < min) {
				min = score;
			};
		}
	}


	for(var i = 0; i < json.statuses.length; i++){
		var tweet = json.statuses[i];

		if (tweet.coordinates !== null) {
			var classifier = sentiment(tweet.text);
			var score = classifier.score;

			filteredArray.push(
				{
					"text":tweet.text,
					"created_at":tweet.created_at,
					"coordinates":tweet.coordinates.coordinates,
					"score": classifier.comparative,
					"class": classify(score)
				}
			);
		}
	}

	return filteredArray;

}

var normalizeScore = function(max, min, score){
	var range = 0;
	if (min*max < 0) {
		range = Math.abs(min) + Math.abs(max);
		score += Math.abs(min);
	}else{
		range = Math.abs(max) - Math.abs(min);
		score -= Math.abs(min);

	}

	return (100/range)*score;
}

var classify = function(score) {
	if (score <= 0) {
		return '<label style="color:red">negativo</label>';

	}
	return '<label style="color:green">positivo</label>';

}
