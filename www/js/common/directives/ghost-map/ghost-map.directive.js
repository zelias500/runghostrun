app.directive('ghostMap', function (MapFactory) {
	return {
		scope: {
			ghost: '=',
			anchors: '=', // whether or not clicking the map opens the challenge page
			boxes: '=' // whether or not we show info boxes
		},
		templateUrl: '/js/common/directives/ghost-map/ghost-map.html',
		restrict: 'E',
		link: function (scope) {
			// Note: this directive may take either a run or a ghost. The term 'ghost' is used interchangeably in this scope.
			// However, only maps that are completed (not meant to be updated) should be passed into this.

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
		            styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}],
		            center: new google.maps.LatLng(scope.map.wayPoints[0].lat, scope.map.wayPoints[0].lng)
	        	})
	        	scope.map.makePolyline();
	        	scope.map.runPath.setMap(gmap);
	            gmap.fitBounds(scope.map.bounds);
			}	        		
				
			// push rendering the gmap to the event queue to handle async loading of google maps
			setTimeout(initialize, 0);
		}
	}
});