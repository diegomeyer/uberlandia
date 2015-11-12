// Requer os componentes necessários
var mongo = require('mongoose');
var where = require('where');

var Schema = mongo.Schema;

var tweetSchema = new Schema({
		text: String,
		coordinates: { latd:Number, longd:Number },
		created_at: Date,
		updated_at: Date,
		classification: Number // 1 para positivo e 0 para negativo
	}
);

// Métodos
tweetSchema.methods.where = function(callBack) {

	var geocoder = new where.Geocoder;

	var point = new where.Point(this.coordinates.latd, this.coordinates.longd);

	geocoder.fromPoint(point, function (err, location) {
  		location.address.road; // Malminkaari 
  		location.address.city; // Helsinki 
  		callBack(location);
	});


  return this.name;
};

// O schema não tem utilidade se não especificarmos como Model
//var Tweet = mongoose.model('Tweet', tweetSchema);

exports.Tweet = mongo.model('Tweet', tweetSchema);