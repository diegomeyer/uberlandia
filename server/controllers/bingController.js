var Bing = require('node-bing-api')({
	accKey: "RCfBxlngr0PAGRsNmZf+AJ6tllgaIJkHF45zm7ITb7M="
});

exports.getImage = function(query, callback) {
	Bing.images(query, {
		imageFilters: {
			size: 'large',
			color: 'color'
		}
	}, function(error, res, body) {
		if (error) {
			console.log('error');
		}else{
			result = body.d.results[0];
			callback(result.MediaUrl);	
		}
		
	});
}