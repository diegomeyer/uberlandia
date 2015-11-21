'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function($scope, $http, Geojson) {

    $scope.image = "http://mave.me/img/projects/full_placeholder.png";
    $scope.search = "";
    $scope.buscou = false;


    $scope.convertDate = function(strDate) {
      var date = new Date(strDate);
      return date;
    }
    var geojson;
    Geojson.get().success(function(data) {
      $scope.geojson = data;

      geojson = L.geoJson($scope.geojson, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(map);
    });
    $scope.doRequest = function() {
      $scope.buscou = true;
      $http.get('http://127.0.0.1:3000/twitter/' + $scope.search).then(function successCallBack(response) {
        console.log('success');
        $scope.tweets = response.data.data;
        $scope.image = response.data.image;
        $scope.theme = $scope.search;
        var estados = response.data.estados;

        for (var i = 0; i < $scope.geojson.features.length; i++) {
          var name = $scope.geojson.features[i].properties.name;
          for (var j = 0; j < estados.length; j++) {
            if (estados[j].estado === name) {
              $scope.geojson.features[i].properties.sentiment = estados[j].sentiment;
            }
          };

        };
        geojson.clearLayers(); // inherited from LayerGroup
        geojson.addData($scope.geojson);
        $scope.buscou = false;
      }, function errorCallback(response) {
        console.log('fail');
        $scope.buscou = false;
      });
    }

    // LeafLet
    var map = L.map('map').setView([-22.0124378, -67.8971016], 4);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.light'
    }).addTo(map);


    // control that shows state info on hover
    var info = L.control();

    info.onAdd = function(map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };

    info.update = function(props) {
      this._div.innerHTML = '<h4>US Population Density</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>' : 'Hover over a state');
    };

    info.addTo(map);



    map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');
    var legend = L.control({
      position: 'bottomright'
    });
    legend.onAdd = function(map) {

      var div = L.DomUtil.create('div', 'info legend'),
        grades = [100, 80, 60, 40, 20, 0, -20, -40, -60, -80, -1],
        labels = [],
        from, to;

      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' + getColor(from + 1) + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };
    legend.addTo(map);


    // get color depending on population density value
    function getColor(d) {


      return d >= 100 ? '#058902' :
        d >= 80 && d <= 99 ? '#10D401' :
        d >= 60 && d <= 79 ? '#77D25E' :
        d >= 40 && d <= 59 ? '#9DFF3E' :
        d >= 20 && d <= 39 ? '#CCFF99' :
        d > 0 && d <= 19 ? '#FAF44B' :
        d === 0 ? '#D3CDCD' :
        d < 0 && d >= -19 ? '#FAF44B' :
        d <= -20 && d >= -39 ? '#FF9933  ' :
        d <= -40 && d >= -59 ? '#FF6600 ' :
        d <= -60 && d >= -79 ? '#FF5613' :
        d <= -80 && d >= -99 ? '#FE3333' :
        d <= -100 ? '#880000' :
        '#D3CDCD';
    }

    function style(feature) {
      return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.sentiment)
      };
    }

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
      }

      info.update(layer.feature.properties);
    }



    function resetHighlight(e) {
      geojson.resetStyle(e.target);
      info.update();
    }

    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      });
    }



  });