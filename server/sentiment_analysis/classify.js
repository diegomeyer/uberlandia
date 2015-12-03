var MsTranslator = require('mstranslator');
var bayes = require('bayes')

var classifyArray = function classifyArray(input_array, lang, translateTo, callback) {
    
    var stateJson = require('./naivebayes.json');
    var classifier = bayes.fromJson(stateJson);
    console.log(input_array);
    var client = new MsTranslator({
       client_id: "uberlandia"
      , client_secret: "MlqN4nijjPlGfXyZmuYZB5jW3/GmDGKUWLGosuQj9LY="
    }, true);

    var params = {
      texts: input_array
      , from: lang
      , to: translateTo
    };

    
    var resultado = new Array();

    client.translateArray(params, function(err, data) {
      console.log(data);

      if (err) {;
        console.log(err)
        resultado = [];
      }else{
        data.forEach(function(phrase) {
            console.log(phrase.TranslatedText);
            console.log(classifier.categorize(String(phrase.TranslatedText)));
            resultado.push(classifier.categorize(String(phrase.TranslatedText)));
        });
      };
        

      callback(resultado);
    });

}

exports.classifyArray = classifyArray;