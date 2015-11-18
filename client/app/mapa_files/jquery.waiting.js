(function($) {
	$.fn.waiting = function(options) {
		options = $.extend({modo: 'normal'}, options);
		
		this.fadeOut(options.modo);
		
		return this;
	};
})(jQuery);