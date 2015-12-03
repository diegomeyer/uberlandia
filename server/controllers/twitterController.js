var sentiment = require('sentiment');
var Twitter = require('twitter');
var bing = require('./bingController.js');
var classify = require('../sentiment_analysis/classify.js');


var scores = [];
var map = [];
var imageTheme = '';
var tweetsArray = [];
var pageCounter = 5;

var client = new Twitter({
	consumer_key: 'DdxyopTagiCxG3Je2SBQgzQj0',
	consumer_secret: 'FeDfrBkCVKdhnQBSzdksELac0iZqoe6vTitfGZ2eslSzHEXfkb',
	access_token_key: '154909777-S5fPVWEFzWdXXXLMpqETvDJaSoK9hNGVV28ChEoR',
	access_token_secret: 'MUxUC9Lvi3u5xEWJHCWz78qgQ9N4whGaYtHaqQQ0mKtjk'
});

exports.list = function(request, callBack) {
	var query = request.params.query;
	var array = [];
	bing.getImage('bolsonaro', function() {

	});
	twitterSearch(query, function(response) {

		filterJSON(response, function(parsedData) {
			parsedData
			callBack({
				data: parsedData,
				estados: map,
				image: imageTheme,

			});
		})
	});
};


var twitterSearch = function(query, callBack) {

	client.get('search/tweets', {
		q: query,
		count: 100,
		geocode: '-14.3204892,-41.676742,2500km'
	}, function(error, tweets, response) {

		if (!error) {
			bing.getImage(query, function(image) {
				imageTheme = image;
				callBack(tweets);
			});

		} else {
			console.log(error);
		}
	});
};


var filterJSON = function(json, callBack) {
	var filteredArray = [];
	debugger;
	var min = 0;
	var max = 0;

	var texts = getTweets(json.statuses);
	classify.classifyArray(texts, 'pt-br', 'en', function(error, classifiedArray) {
		if (error) {
			console.log('erro tradutor')
			callBack(error);
		} else {

			for (var i = 0; i < json.statuses.length; i++) {
				var tweet = json.statuses[i];

				if (tweet.coordinates !== null) {


					var place = tweet.place;
					if (place !== null && place.country_code === 'BR') {
						var fullName = place.full_name;
						var cityState = fullName.split(/, (.+)?/);

						//var classifier = sentiment(tweet.text);
						var score = convertToNumber(classifiedArray(i));
						//var score = classifier.score;

						if (cityState[1] !== undefined) {
							var state = normalizePlace(cityState[1]);
							var city = normalizePlace(cityState[0]);
							if (state === 'Brazil' || state === 'Brasil') {
								state = city;
							}

							filteredArray.push({
								"text": tweet.text,
								"created_at": tweet.created_at,
								"image": tweet.user.profile_image_url,
								"score": classifier.comparative,
								"classe": classifiedArray(i),
								"place": {
									"state": state
								}
							});
						}


					}
				}
			}

			processScore(filteredArray);
			callBack(filteredArray);
		}
	});


}

var getTweets = function(tweets) {

	var msg = [];

	tweets.forEach(function(tweet) {
		var pureText = tweet.text;//.replace(/[^\w\s]/gi, '');
		msg.push(pureText.replace(/(?:\r\n|\r|\n)/g, ' '));
	});

	return msg;
}

var convertToNumber = function(score) {
	if (score === 'positivo') {
		return 1;
	} else {
		return 0;
	}
}

var processScore = function(tweets) {
	scores = [];
	for (var i = 0; i < tweets.length; i++) {
		var state = tweets[i].place.state;
		var score = tweets[i].classe;
		console.log(score);
		updateScores(state, score);
	};

	map = normalizeScores(scores);
}

var normalizeScore = function(max, min, score) {
	var range = 0;
	if (min * max < 0) {
		range = Math.abs(min) + Math.abs(max);
		score += Math.abs(min);
	} else {
		range = Math.abs(max) - Math.abs(min);
		score -= Math.abs(min);

	}

	return (100 / range) * score;
}

var classifyTeste = function(score) {
	if (score <= 0) {
		return 'negativo';

	}
	return 'positivo';

}



var updateScores = function(estado, classe) {
	var alreadyExists = false;

	for (var i = 0; i < scores.length; i++) {

		if (scores[i].estado === estado) {
			if (classe === 'positive') {
				scores[i].positivos++;
			} else {
				scores[i].negativos++;
			}
			alreadyExists = true;
			break;
		}
	}
	if (!alreadyExists) {
		var pos = 0;
		var neg = 0;
		if (classe === 'positivo') {
			pos++;
		} else {
			neg++;
		}
		scores.push({
			estado: estado,
			positivos: pos,
			negativos: neg
		});
	}


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

var normalizeScores = function(json) {
	var estados = [];
	var maior = json[0].positivos - json[0].negativos;
	var menor = json[0].positivos - json[0].negativos;

	for (var i = 0; i < json.length; i++) {

		var nome = json[i].estado;
		var sentiment = json[i].positivos - json[i].negativos;

		var estado = {
			"estado": nome,
			"sentiment": sentiment
		}
		estados.push(estado);

		if (estados[i].sentiment > maior) {
			maior = estados[i].sentiment;
		} else if (estados[i].sentiment < menor) {
			menor = estados[i].sentiment;
		};
	};

	for (var i = estados.length - 1; i >= 0; i--) {
		if (estados[i].sentiment >= 0) {
			estados[i].sentiment = ((estados[i].sentiment / maior) * 100).toString();
		} else
			estados[i].sentiment = ((estados[i].sentiment / (menor * -1)) * 100).toString();
	};

	return estados;
}