var indico = require('indico.io')

indico.apiKey = "389764c8f9ac9eb51c6e2d88ab6ad3e1"; 

indico
  .batchSentiment(['Worst movie ever.', 'Best movie ever.'])
  .then(function(res){
    console.log(res) // [ 0.07808824238341827, 0.813400530597089 ] 
  })
  .catch(function(err){
    console.log('err: ', err);
  });