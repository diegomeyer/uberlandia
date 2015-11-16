var url = require('url');
var sentiment = require('sentiment')
var Twitter = require('twitter');
var brasil = require('./brasil-reduzido');
var geolib = require('geolib');

var geojson = brasil.geojson();
var minScore = 0;
var maxScore = 0;
var scores = [];
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
	 	callBack(
	 	{
	 		data:filterJSON(response), 
	 		estados:scores,
	 		escala: {
	 			min: minScore,
	 			max: maxScore
	 		}
	 	});
	 });
}


var twitterSearch = function(query, callBack){

	client.get('search/tweets', {q: query, count:100, geocode:'-14.3204892,-41.676742,2500km'}, function(error, tweets, response){
		if (!error) {
			// twitterStream(query);

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

	scores = [];
	for(var i = 0; i < json.statuses.length; i++){
		var tweet = json.statuses[i];

		if (tweet.coordinates !== null) {
			var classifier = sentiment(tweet.text);
			var score = classifier.score;
			searchState(tweet.coordinates.coordinates, function(resp){
				filteredArray.push(
					{
						"text":tweet.text,
						"created_at":tweet.created_at,
						"coordinates":tweet.coordinates.coordinates,
						"score": classifier.comparative,
						"classe": classify(score),
						"estado": resp
					}
				);
			});
			
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

var searchState = function(coordinates, callBack){

	var estados = geojson.features;

	for (var i = 0; i < estados.length; i ++) {

		var estado = estados[i];
		var estadoCoord = estado.geometry.coordinates[0];
		var geolibArray = convertCoordinates(estadoCoord);
		var isInside = geolib.isPointInside( {latitude: coordinates[0], longitude:coordinates[1] },geolibArray);
		if (isInside) {
			if (i === 0) {
				minScore = estado.properties.score;
			};
			estado.properties.score ++;
			if (estado.properties.score < minScore) {
				minScore = estado.properties.score;
			}

			if (estado.properties.score > maxScore) {
				maxScore = estado.properties.score;
			}

			updateScores(estado.properties.name, estado.properties.score);
			
			callBack(estado.properties.name);
			break;
		}
	}
	

}

var updateScores = function(estado, score){
	var alreadyExists = false;
	for (var i = 0; i < scores.length; i++) {
		if (scores[i].estado === estado) {
			scores[i].score = score;
			alreadyExists = true;
			break;
		}	
	}
	if (!alreadyExists) {
		scores.push({
				estado: estado,
				score: score
			});
	}
	

}

var convertCoordinates = function(coordArray){
	geolibArray = []
	for(var i = 0; i < coordArray.length; i ++){
		point = coordArray[i];
		geolibArray.push({latitude: parseFloat(point[0]), longitude: parseFloat(point[1])})
	}

	return geolibArray;
}
