angular.module("bobotApp",[]).factory('GoogleMaps', function($http){
 
  var apiKey = false;
  var map = null;
 
  function initMap(){
 
    var options = {timeout: 10000, enableHighAccuracy: true};
    
 
    navigator.geolocation.getCurrentPosition(function(position){
 
      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      var mapOptions = {
        center: latlng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      
 
      map = new google.maps.Map(document.getElementById("mapViewDiv"), mapOptions);
      var imagem = 'img/alerta.png';

							
       // Create the search box and link it to the UI element.
				  var input = document.getElementById('localConsultado');
				  var searchBox = new google.maps.places.SearchBox(input);
				  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

				 
                   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

				  // Bias the SearchBox results towards current map's viewport.
				  map.addListener('bounds_changed', function() {
				    searchBox.setBounds(map.getBounds());
				  });
                  var markers = [];
				  // Listen for the event fired when the user selects a prediction and retrieve
				  // more details for that place.
				  searchBox.addListener('places_changed', function() {
				    var places = searchBox.getPlaces();

				    if (places.length == 0) {
				      return;
				    }

				    // Clear out the old markers.
				    markers.forEach(function(marker) {
				      marker.setMap(null);
				    });
				    markers = [];

				    // For each place, get the icon, name and location.
				    var bounds = new google.maps.LatLngBounds();
				    places.forEach(function(place) {
				      if (!place.geometry) {
				        console.log("Returned place contains no geometry");
				        return;
				      }
				      var icon = {
				        url: place.icon,
				        size: new google.maps.Size(71, 71),
				        origin: new google.maps.Point(0, 0),
				        anchor: new google.maps.Point(17, 34),
				        scaledSize: new google.maps.Size(25, 25)
				      };

				      // Create a marker for each place.
				      markers.push(new google.maps.Marker({
				        map: map,
				        icon: icon,
				        title: place.name,
				        position: place.geometry.location
				      }));
                        loadMarkers(place.geometry.location);
				      if (place.geometry.viewport) {
				        // Only geocodes have viewport.
				        bounds.union(place.geometry.viewport);
				      } else {
				        bounds.extend(place.geometry.location);
				      }
				    });
				    map.fitBounds(bounds);
                     
				  });
 
      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){
 
        //Load the markers
        loadMarkers(latlng);
 
      });
 
    }, function(error){
      console.log("Could not get location");
 
        //Load the markers
        loadMarkers(latlng);
    });
 
  }
 
  function loadMarkers(latlng){
      //Get all of the markers from our Markers factory
      $http.get('http://ba89ebf7.ngrok.io/getOcorrencias').then(function(markers){
 
        console.log("Markers: ", markers);
 
        var records = markers.data;
        var heatmapData2 = [];
        for (var i = 0; i < records.length; i++) {
 
          var record = records[i];   
          var markerPos = new google.maps.LatLng(record.latitude, record.longitude);
             heatmapData2.push(markerPos);
          // Add the markerto the map
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: markerPos,
              icon:"./Img/"+record.tipo+".png"
          });
          
          var infoWindowContent = '<div id="iw-container">' +
                    '<div class="iw-title">'+record.tipo+'</div>' +
                    '<div class="iw-content">' +
                      '<div class="iw-subTitle">Período da ocorrência: '+record.turno+'</div>' +
                      '<p>'+record.motivo+'</p>' +
                      '<div class="iw-subTitle">Contacts</div>' +
                      '<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>'+
                      '<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>'+
                    '</div>' +
                    '<div class="iw-bottom-gradient"></div>' +
                  '</div>';     
 
          addInfoWindow(marker, infoWindowContent, record);
 
        }

        var heatmap = new google.maps.visualization.HeatmapLayer({
							data: heatmapData2,
							map: map,
							dissipating: true,
							radius: 100

							});
 
 
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
.controller('listOcorrencias', ['$scope', 'GoogleMaps', '$http', function($scope, GoogleMaps, $http){
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