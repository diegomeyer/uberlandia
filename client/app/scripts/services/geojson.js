'use strict';

/**
 * @ngdoc service
 * @name clientApp.Geojson
 * @description
 * # Geojson
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('Geojson', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
      get: function () {
        return $http.get('../../geojson/brasil.geojson');
      }
    };
  });
