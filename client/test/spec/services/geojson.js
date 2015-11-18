'use strict';

describe('Service: Geojson', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var Geojson;
  beforeEach(inject(function (_Geojson_) {
    Geojson = _Geojson_;
  }));

  it('should do something', function () {
    expect(!!Geojson).toBe(true);
  });

});
