var MsTranslator = require('mstranslator');
var bayes = require('bayes')

var classifyArray = function classifyArray(input_array, lang, translateTo, callback, errorCallBack) {
    
    var stateJson = require('./naivebayes.json');
    var classifier = bayes.fromJson(stateJson);

    var client = new MsTranslator({
       client_id: "uberlandia"
      , client_secret: "MlqN4nijjPlGfXyZmuYZB5jW3/GmDGKUWLGosuQj9LY="
    }, true);

    var params = {
      texts: input_array
      , from: lang
      , to: translateTo
    };

    var data = new Array();
    var resultado = new Array();

    client.translateArray(params, function(err, data) {
      console.log("HAHAHAHAHAHA");
      return;
      
      
    });

}

exports.classifyArray = classifyArray;