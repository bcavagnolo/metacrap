/*--------------------------------------
Author: Bharathkumar Gunasekaran
Email: bharath@ischool.berkeley.edu
Created: 10/03/2012
Description: Javascript for Project 2
----------------------------------------*/

( function(){

	var map, geocoder, marker, infowindow, entity, tag, newTag;
	var markersArray = [];
	var psx;


	window.onload = function(){ 

		psx = new PointStore("projectTwoTestPoints");
		console.log(psx);
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

				 tagPoints = psx.getAll();
				 console.log(tagPoints);
				 placeMarkers(tagPoints);


		});

		$("#tagbutton").click(function() {
			tag = document.getElementById('tag').value;
			filterPoints = psx.getByTag(tag);
			 for (i in filterPoints) {
			 	placeMarkers(filterPoints);
			 }
		});

		google.maps.event.addListener(map, 'click', function(e) {
		          placeMarker(e.latLng);
		        });



	}

	function placeMarkers(entity){

		clearMarkers();
	
		for (var i = 0; i < entity.length; i++) {

			entity[i].glatlng = new google.maps.LatLng(entity[i].posn[0], entity[i].posn[1]);
			placeMarker(entity[i]);
			decorateMarker(entity[i]);
			//location.push(new google.maps.LatLng(entity[i].posn[0], entity[i].posn[1]));
		};



	}

	function  decorateMarker(a) {
			var name = a.name;
	        var details = '<div id="info">' +
						'<h2>'+name+'</h2>';
			details += '<ul id="taglist">'
				for (m in a.tags)
				{
					details += '<li class="tag close'+m+'"><span class="tags">'+a.tags[m]+'</span><span class="close close'+i+'">x</span></li>';
				}				
			details += '</ul><div><label>Add tag:</label><input type="text" id="addtag"/><input type="submit" id="addTagButton"/></div></div>';
			 var infowindow = new google.maps.InfoWindow(
		      { content: details,
		      });


      }

	function placeMarker(a){
          marker = new google.maps.Marker({
          position: a.glatlng,
          map: map,
          title: 'Add info to point'
        });
		    google.maps.event.addListener(marker, 'click', function() {
		    infowindow.open(map,marker);

				$('#addTagButton').live("click", function(event){
					var newTag = $("#addtag").val();
					console.log(newTag);
					console.log(psx);
					console.log(entity);
				    });


 			 });
      }

	function clearMarkers() {
		if (markersArray) {
		    for (i in markersArray) {
		      markersArray[i].setMap(null);
		    }
		    markersArray.length = 0;
		  }
      }





})();