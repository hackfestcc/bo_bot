angular.module("bobotApp",[]).factory('GoogleMaps', function(){
 
  var apiKey = false;
  var map = null;
 
  function initMap(){
 
    var options = {timeout: 10000, enableHighAccuracy: true};
    
 
    navigator.geolocation.getCurrentPosition(function(position){
 
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
 
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
       // Create the search box and link it to the UI element.
				  var input = document.getElementById('localConsultado');
				  var searchBox = new google.maps.places.SearchBox(input);
				  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

				  // Bias the SearchBox results towards current map's viewport.
				  map.addListener('bounds_changed', function() {
				    searchBox.setBounds(map.getBounds());
				  });
 
      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){
 
        //Load the markers
        //loadMarkers();
 
      });
 
    }, function(error){
      console.log("Could not get location");
 
        //Load the markers
       // loadMarkers();
    });
 
  }
 
  function loadMarkers(){
 
      //Get all of the markers from our Markers factory
      Markers.getMarkers().then(function(markers){
 
        console.log("Markers: ", markers);
 
        var records = markers.data.result;
 
        for (var i = 0; i < records.length; i++) {
 
          var record = records[i];   
          var markerPos = new google.maps.LatLng(record.lat, record.lng);
 
          // Add the markerto the map
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: markerPos
          });
 
          var infoWindowContent = "<h4>" + record.name + "</h4>";          
 
          addInfoWindow(marker, infoWindowContent, record);
 
        }
 
      }); 
 
  }
 
  function addInfoWindow(marker, message, record) {
 
      var infoWindow = new google.maps.InfoWindow({
          content: message
      });
 
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
      });
 
  }
 
  return {
    init: function(){
      initMap();
    }
  }
 
})
.controller('listOcorrencias', ['$scope', 'GoogleMaps', function($scope, GoogleMaps){
    $scope.tiposOcorrencias = [{tipo:"Assalto", value:false}, {tipo:"Roubo", value:false}, {tipo:"Furto", value:false}, {tipo:"Estupro", value:false}
    , {tipo:"Vandalismo", value:false}, {tipo:"Assassinato", value:false}];
    $scope.ocorrencias = [
        {tipoOcorrencia:"Roubo",local:"Rua Do beco, 1231", horario:"12:30"},
        {tipoOcorrencia:"Assalto",local:"Rua Do beco, 1231", horario:"12:30"},
        {tipoOcorrencia:"Furto",local:"Rua Do beco, 1231", horario:"12:30"},
        {tipoOcorrencia:"Homicídio",local:"Rua Do beco, 1231", horario:"12:30"},
        {tipoOcorrencia:"Vandalismo",local:"Rua Do beco, 1231", horario:"12:30"}
        
    ];
    GoogleMaps.init();
    
   
}]); 