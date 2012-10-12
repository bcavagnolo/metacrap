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
	var opt = {
    nameSpace: "projectTwoTestPoints",
    openKVURL: "http://riyadh.cusp.berkeley.edu/",
    listID: 'point-store-list',
  };

  var infowindow = new google.maps.InfoWindow();


	window.onload = function(){ 

		psx = new PointStore(opt);
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


	
		for (var i = 0; i < entity.length; i++) {

			entity[i].glatlng = new google.maps.LatLng(entity[i].posn[0], entity[i].posn[1]);
			createMarker(map,entity[i])


		};
		console.log(entity);
	}

		function createMarker(map, point) {
		    
		    var contentString = '<div id="info">' +
						'<h2>'+point.name+'</h2>';
			contentString += '<ul id="taglist">'
				for (m in point.tags)
				{
					contentString += '<li class="tag close'+m+'"><span class="tags">'+point.tags[m]+'</span><span class="close close'+m+'">x</span></li>';
				}				
			contentString += '</ul><div><label>Add tag:</label><input type="text" id="addtag"/><input type="submit" id="addTagButton"/></div></div>';

		    var marker = new google.maps.Marker({
		        position: point.glatlng,
		        map: map,
		        title: 'Add info to point',
		        });
		    point.Gmarker = marker;

		    google.maps.event.addListener(marker, 'click', function() {
		        infowindow.setContent(contentString); 
		        infowindow.open(map,marker);
		        });
		};



	function placeMarker(a){
          a.marker = new google.maps.Marker({
          position: a.glatlng,
          map: map,
          title: 'Add info to point'
        });
		    google.maps.event.addListener(marker, 'click', function() {
		    infowindow.open(map,a.marker);

				$('#addTagButton').live("click", function(event){
					var newTag = $("#addtag").val();
					console.log(newTag);
					console.log(psx);
					console.log(entity);
				    });


 			 });
      }





})();