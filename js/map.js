/*--------------------------------------
Author: Bharathkumar Gunasekaran
Email: bharath@ischool.berkeley.edu
Created: 10/03/2012
Description: Javascript for Project 2
----------------------------------------*/

( function(){

var map, geocoder, marker, infowindow, entity, tag;

  var points = [new Point([0.0, 0.0], "Vital Vittles", "restaurant", ["cheap", "quiet"]),
              new Point([137.0, -34.0], "La Bedaine", "restaurant", ["costly", "awesome"]),
              new Point([0.0, 0.0], "Greek Theatre", "nightLife", ["rocking"])
             ];

var data = { "entities" : [
							{ "type" : "restaurant", "values": [
							      									{ "name": "Vital Vittles", "posn": [37.8557619, -122.28803370000003], "tags" :["cheap", "quiet"] },
								      								{ "name": "La Bedaine", "posn": [37.8911862, -122.2849177], "tags" : ["costly", "awesome"]}
    																]
    						},
    						{ "type" : "nightLife", "values": [
							      									{ "name": "Greek Theatre", "posn": [37.8737016, -122.25524719999999],"tags" : ["rocking"]}
    																]
    						},
   						]
};

var markersArray = [];

window.onload = function(){ 


	var fix = new google.maps.LatLng(37.8717, -122.2728)

	var options = {
				center: fix,
				zoom: 13,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: true,
				mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
				},
				streetViewControl: true,
		};
	map = new google.maps.Map(document.getElementById('map'), options);


	var entityForm = document.getElementById('entityFilter');
	var tagForm = document.getElementById('tagFilter');
	console.log(entityForm);
	console.log(tagForm);
	entityForm.onsubmit = function() {
	entity = document.getElementById('entity').value;
	placeMarkers(entity); 
	return false;
	}
	tagForm.onsubmit = function() {
	entity = document.getElementById('entity').value;
	tag = document.getElementById('tag').value;
	console.log(tag);
	console.log(entity);
	filterEntityTag(entity, tag);
	return false;
	}


}

	function placeMarkers(entity){

		if (markersArray) {
		    for (i in markersArray) {
		      markersArray[i].setMap(null);
		    }
		  }	

		
		for (var d = 0; d < data.entities.length; d++) {

				var location = [];
				if (entity==data.entities[d].type) {
					for (var i = 0; i < data.entities[d].values.length; i++) {
						location.push(new google.maps.LatLng(data.entities[d].values[i].posn[0], data.entities[d].values[i].posn[1] ));
					};
					
					for (var j = 0; j < location.length; j++) {
						console.log(location[j])
					    marker = new google.maps.Marker({
					      position: location[j],
					      map: map
					    });
					    markersArray.push(marker)
					};
			};
		};
	}

	function filterEntityTag(entity, tag){


		if (markersArray) {
		    for (i in markersArray) {
		      markersArray[i].setMap(null);
		    }
		  }	
	
		for (var d = 0; d < data.entities.length; d++) {
				var tagLocation = [];
				if (entity==data.entities[d].type) {
					for (var i = 0; i < data.entities[d].values.length; i++) {
							for (var j=0; j<data.entities[d].values[i].tags.length; j++) {
								if (tag==data.entities[d].values[i].tags[j]) {
									tagLocation.push(new google.maps.LatLng(data.entities[d].values[i].posn[0], data.entities[d].values[i].posn[1] ));
								};
							};
					};
					for (var j = 0; j < tagLocation.length; j++) {
						console.log(tagLocation[j])
					    marker = new google.maps.Marker({
					      position: tagLocation[j],
					      map: map
					    });
					    markersArray.push(marker)
					};
			};
		};
	}

})();