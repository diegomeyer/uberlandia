var url = require('url');
var sentiment = require('sentiment')
var Twitter = require('twitter');
var brasil = require('./brasil-reduzido');
var geolib = require('geolib');
var google = require('google-images');

var geojson = brasil.geojson();
var minScore = 0;
var maxScore = 0;
var scores = [];
var destruir = "";
var imageTheme = "";

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
	 		image:imageTheme,
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
			searchImage(query, function(image){
				console.dir(image.url);
				imageTheme = image.url;
				callBack(tweets);
			});

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
			var score = classifier.score;

			var place = tweet.place;
			if (place !== null && place.country_code === 'BR') {
				var fullName = place.full_name;
				var cityState = fullName.split(/, (.+)?/);

				

				if (cityState[1] !== undefined) {
					var state = normalizePlace(cityState[1]);
					var city = normalizePlace(cityState[0]);
					if (state === 'Brazil' || state === 'Brasil') {
						state = city;
					}

					filteredArray.push(
						{
							"text":tweet.text,
							"created_at":tweet.created_at,
							"image": tweet.user.profile_image_url,
							"score": classifier.comparative,
							"classe": classify(score),
							"place": {
								"state": state
							}
						}
					);
				}

				
			}
		}
	}
	processScore(filteredArray);
	return filteredArray;

}

var searchImage = function(image, callBack){
	google.search(image , function(err, images){
		if(!err){
			callBack(images[0]);
		}else{
			callBack("");
		}
	});

}

var processScore = function(tweets){
	scores = [];
	for (var i = 0; i < tweets.length; i++) {
		var state = tweets[i].place.state;
		var score = tweets[i].classe;
		updateScores(state,score);
	};
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
		return 'negativo';

	}
	return 'positivo';

}



var updateScores = function(estado, classe){
	var alreadyExists = false;
	for (var i = 0; i < scores.length; i++) {
		if (scores[i].estado === estado) {
			if (classe === 'positivo') {
				scores[i].positivos ++;
			}else{
				scores[i].negativos ++;
			}
			alreadyExists = true;
			break;
		}	
	}
	if (!alreadyExists) {
		var pos = 0;
		var neg = 0;
		if (classe === "positivo") {
				pos ++;
			}else{
				neg ++;
			}
		scores.push({
				estado: estado,
				positivos: pos,
				negativos: neg
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

var normalizePlace = function(state) {
	if (state.toLowerCase() === "Amapa".toLowerCase()) {
		return "Amapá";
	}
	if (state.toLowerCase() === "Ceara".toLowerCase()) {
		return "Ceará";
	}
	if (state.toLowerCase() === "Espirito Santo".toLowerCase()) {
		return "Espírito Santo";
	}
	if (state.toLowerCase() === "Goias".toLowerCase()) {
		return "Goiás";
	}
	if (state.toLowerCase() === "Maranhao".toLowerCase()) {
		return "Maranhão";
	}
	if (state.toLowerCase() === "Para".toLowerCase()) {
		return "Pará";
	}
	if (state.toLowerCase() === "Paraiba".toLowerCase()) {
		return "Paraíba";
	}
	if (state.toLowerCase() === "Parana".toLowerCase()) {
		return "Paraná";
	}
	if (state.toLowerCase() === "Piaui".toLowerCase()) {
		return "Piauí";
	}
	if (state.toLowerCase() === "Rondonia".toLowerCase()) {
		return "Rondônia";
	}
	if (state.toLowerCase() === "Sao Paulo".toLowerCase()) {
		return "São Paulo";
	}
	return state;
}
