'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $http, Geojson) {
  	
  	$scope.image = "http://mave.me/img/projects/full_placeholder.png";
  	$scope.search = "";
    $scope.buscou = false;

    

    Geojson.get().success(function(data) { 
      $scope.mapa = data;
    });
   	$scope.convertDate = function(strDate){
   		var date = new Date(strDate);
   		return date;
   	}

   	$scope.doRequest = function() {
      $scope.buscou = true;
   		$http.get('http://0fa42de6.ngrok.io/twitter/'+$scope.search).then(function successCallBack(response){
	   		console.log('success');
	   		$scope.tweets = response.data.data;
	   		$scope.image = response.data.image;
        $scope.buscou = false;
	   	}, function errorCallback(response){
	   		console.log('fail');
        $scope.buscou = false;
	   	});
   	}
  });
