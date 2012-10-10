/*--------------------------------------
Author: Bharathkumar Gunasekaran
Email: bharath@ischool.berkeley.edu
Created: 10/03/2012
Description: Javascript for Project 2
----------------------------------------*/

( function(){

	var map, geocoder, marker, infowindow, entity, tag;
	var markersArray = [];
	var psx;


	window.onload = function(){ 

		psx = new PointStore("projectTwoTestPoints");
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
		

		var tagPoints = [];
		var filterPoints = [];
		psx.load(function() {
				 console.log("loaded points");
				 console.log(psx);
				 tagPoints = psx.getAll();
				 console.log(tagPoints);
				 placeMarkers(tagPoints);
				 console.log(markersArray);
		});

		$("#tagbutton").click(function() {
			tag = document.getElementById('tag').value;
			console.log(tag);
			filterPoints = psx.getByTag(tag);
			console.log(filterPoints);
			 for (i in filterPoints) {
			 	console.log(i)
			 	placeMarkers(filterPoints);
			 }
		});

		google.maps.event.addListener(map, 'click', function(e) {
					console.log(e.latLng)
		          placeMarker(e.latLng);
		        });



	}

	function placeMarkers(entity){

		clearMarkers();
	
		var location = [];
		for (var i = 0; i < entity.length; i++) {
			location.push(new google.maps.LatLng(entity[i].posn[0], entity[i].posn[1]));
		};
		console.log(location);
		for (var j = 0; j < location.length; j++) {
			placeMarker(location[j]);
		};
		for ( k in markersArray){
			var name = psx.points[k].name;
	        var details = '<div id="info">' +
						'<h2>'+name+'</h2>';
				for (m in psx.points[k].tags)
				{
					details += '<p>'+psx.points[k].tags[m]+'</p>';
				}				
			details += '</div';

			displayContent(markersArray[k], details);

		};
	}

	function placeMarker(position) {
          marker = new google.maps.Marker({
          position: position,
          map: map,
          title: 'Add info to point'
        });
        markersArray.push(marker);
      }

	function clearMarkers() {
		if (markersArray) {
		    for (i in markersArray) {
		      markersArray[i].setMap(null);
		    }
		    markersArray.length = 0;
		  }
      }

    function displayContent(mark, details) {
		  var infowindow = new google.maps.InfoWindow(
		      { content: details,
		      });
		  google.maps.event.addListener(mark, 'click', function() {
		    infowindow.open(map,mark);
 			 });	
      }



})();