app.directive('ghostMap', function(MapFactory){
	return {
		scope: {
			ghost: '=',
			anchors: '=', // whether or not clicking the map opens the challenge page
			boxes: '=' // whether or not we show info boxes
		},
		templateUrl: '/js/common/directives/ghost-map/ghost-map.html',
		restrict: 'E',
		link: function (scope) {

			scope.ghostUniqueId = scope.ghost._id + _.random(0, 1000, false)

			if (scope.anchors) scope.linksTo = "#/tab/ghost/" + scope.ghost._id
			else scope.linksTo = false;

			function initialize () {
				scope.map = MapFactory.newMap(scope.ghost);
			  	var gmap = new google.maps.Map(document.getElementById(scope.ghostUniqueId), {
		            zoom: 12,
		            mapTypeId: google.maps.MapTypeId.TERRAIN,
		            disableDefaultUI: true,
		            draggable: false,
		            center: new google.maps.LatLng(scope.map.wayPoints[0].lat, scope.map.wayPoints[0].lng)
	        	})
	        	scope.map.makePolyline();
	        	scope.map.runPath.setMap(gmap);
	            gmap.fitBounds(scope.map.bounds);
	            console.log('gmap initialized for ', scope.map.id)
			}	        		
				
			// push rendering the gmap to the event queue to handle async loading of google maps
			setTimeout(initialize, 0);
		}
	}
});