'use strict';

describe('Service: GeojsonHandler', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var GeojsonHandler;
  beforeEach(inject(function (_GeojsonHandler_) {
    GeojsonHandler = _GeojsonHandler_;
  }));

  it('should do something', function () {
    expect(!!GeojsonHandler).toBe(true);
  });

});
