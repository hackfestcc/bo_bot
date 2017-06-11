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
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
{
"featureType": "administrative",
"elementType": "labels.text.fill",
"stylers": [
		{
				"color": "#444444"
		}
]
},
{
"featureType": "landscape",
"elementType": "all",
"stylers": [
		{
				"color": "#f2f2f2"
		}
]
},
{
"featureType": "poi",
"elementType": "all",
"stylers": [
		{
				"visibility": "off"
		}
]
},
{
"featureType": "road",
"elementType": "all",
"stylers": [
		{
				"saturation": -100
		},
		{
				"lightness": 45
		}
]
},
{
"featureType": "road.highway",
"elementType": "all",
"stylers": [
		{
				"visibility": "simplified"
		}
]
},
{
"featureType": "road.arterial",
"elementType": "labels.icon",
"stylers": [
		{
				"visibility": "off"
		}
]
},
{
"featureType": "transit",
"elementType": "all",
"stylers": [
		{
				"visibility": "off"
		}
]
},
{
"featureType": "water",
"elementType": "all",
"stylers": [
		{
				"color": "#46bcec"
		},
		{
				"visibility": "on"
		}
]
}
]
			
      };
      
 
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var imagem = 'img/alerta.png';

							var locais = [
								{lat: -7.121585, lng: -34.879090},
								{lat: -7.122598, lng: -34.882739},
								{lat: -7.118825, lng: -34.881310},
								{lat: -7.120597, lng: -34.877814},
								{lat: -7.117027, lng: -34.873731},
								{lat: -7.120065, lng: -34.882739},
								{lat: -7.124547, lng: -34.875568}
							];

							var heatmapData = [
								{location: new google.maps.LatLng(-7.121585, -34.879090), weight: 0.5},
								{location: new google.maps.LatLng(-7.122598, -34.882739), weight: 3.5},
								{location: new google.maps.LatLng(-7.118825, -34.881310), weight: 1.5},
								{location: new google.maps.LatLng(-7.120597, -34.877814), weight: 6},
								{location: new google.maps.LatLng(-7.117027, -34.873731), weight: 9.5},
								{location: new google.maps.LatLng(-7.120065, -34.882739), weight: 1.5},
								{location: new google.maps.LatLng(-7.124547, -34.875568), weight: 0.5}
							];


							var heatmapData2 = [
								new google.maps.LatLng(-7.121585, -34.879090),
								new google.maps.LatLng(-7.122598, -34.882739),
								new google.maps.LatLng(-7.118825, -34.881310),
								new google.maps.LatLng(-7.120597, -34.877814),
								new google.maps.LatLng(-7.117027, -34.873731),
								new google.maps.LatLng(-7.120065, -34.882739),
								new google.maps.LatLng(-7.124547, -34.875568)
							];


							var latlng = {lat: -7.120422, lng:  -34.880557};

							var map = new google.maps.Map(document.getElementById('map'), {
								center: latlng,
								zoom: 15
							});



							for (i = 0; i < locais.length; i++) {
								var marker = new google.maps.Marker({
									position: locais[i],
									map: map,
									icon: imagem

								});

							}

							var cityCircle = new google.maps.Circle({
								strokeColor: '#FF0000',
								strokeOpacity: 0.8,
								strokeWeight: 2,
								fillColor: '#FF0000',
								fillOpacity: 0.35,

								center: latlng,
								radius: 500
							});

							var heatmap = new google.maps.visualization.HeatmapLayer({
							data: heatmapData2,
							map: map,
							dissipating: true,
							radius: 100

							});
       // Create the search box and link it to the UI element.
				  var input = document.getElementById('localConsultado');
				  var searchBox = new google.maps.places.SearchBox(input);
				  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

				  // Bias the SearchBox results towards current map's viewport.
				  map.addListener('bounds_changed', function() {
				    searchBox.setBounds(map.getBounds());
				  });
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
    
    $http.get('http://5195298e.ngrok.io/getOcorrencias').then(function(data){
       console.log(data);
   })
   
}]); 