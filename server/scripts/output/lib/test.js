/* start module: test */
$pyjs['loaded_modules']['test'] = function (__mod_name__) {
	if($pyjs['loaded_modules']['test']['__was_initialized__']) return $pyjs['loaded_modules']['test'];
	var $m = $pyjs['loaded_modules']['test'];
	$m['__repr__'] = function() { return '<module: test>'; };
	$m['__was_initialized__'] = true;
	if ((__mod_name__ === null) || (typeof __mod_name__ == 'undefined')) __mod_name__ = 'test';
	$m['__name__'] = __mod_name__;


	$m['pyjs'] = $p['___import___']('pyjs', null);
	$m['test'] = function() {

		$p['printFunc'](['TEST PY'], 1);
		return 'Phyton: HELLO';
	};
	$m['test']['__name__'] = 'test';

	$m['test']['__bind_type__'] = 0;
	$m['test']['__args__'] = [null,null];
	$m['test']();
	return this;
}; /* end test */


/* end module: test */


/*
PYJS_DEPS: ['pyjs']
*/
