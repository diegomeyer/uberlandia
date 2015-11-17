'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $http) {
  	
  	$scope.image = "http://mave.me/img/projects/full_placeholder.png";
  	$scope.search = "";


   	$scope.convertDate = function(strDate){
   		var date = new Date(strDate);
   		return date;
   	}

   	$scope.doRequest = function() {
   		$http.get('http://127.0.0.1:3200/twitter/'+$scope.search).then(function successCallBack(response){
	   		console.log('success');
	   		$scope.tweets = response.data.data;
	   		$scope.image = response.data.image;
	   	}, function errorCallback(response){
	   		console.log('fail');
	   	});
   	}
  });
