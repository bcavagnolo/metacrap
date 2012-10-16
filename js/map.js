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
    createPointDisplay: createMarker,
    showPoint: showMarker,
    hidePoint: hideMarker,
    searchBoxID: 'tag',
  };

  var infowindow = new google.maps.InfoWindow();
  var infowindow1 = new google.maps.InfoWindow();




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
		

		psx.load(function() {

/*				 tagPoints = psx.getAll();
        			 console.log(tagPoints);*/
		google.maps.event.addListener(map, 'click', function(e) {
				var newPoint = new Point();
		        placeMarker(newPoint,e.latLng);




		        });


		});


	}


		function createMarker(point) {


			point.glatlng = new google.maps.LatLng(point.posn[0], point.posn[1]);
		    
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
		        map: null,
		        title: 'Click to add tags',
		        });
		    point.Gmarker = marker;

		    google.maps.event.addListener(marker, 'click', function() {
		        infowindow.setContent(contentString); 
		        infowindow.open(map,marker);
		        });
		};


      function showMarker(point){
 			console.log("showMarker:");
			console.log(point);
      	point.Gmarker.setMap(map);

      };

      function hideMarker(point){
      		console.log("hideMarker:");
			console.log(point);
      	point.Gmarker.setMap(null);

      };

	function placeMarker(b,a){
		  console.log("bharath1")
		  console.log(b)
		  console.log(a)
			console.log("bharath2")
          marker = new google.maps.Marker({
          position: a,
          map: map,
          title: 'Add info to point'
        });
        b.Gmarker = marker;
        b.posn = a
		    //google.maps.event.addListener(marker, 'click', function() {

		  

		    var contentForm = '<label>Name:</label><input type="text" id="addNewName"/><br><label>Add Entity Type:</label><input type="text" id="addNewEntity"/><label>Add tag:</label><input type="text" id="addNewTag"/><input type="submit" id="addTagForm"/>';
		    infowindow1.setContent(contentForm); 			
		    infowindow1.open(map,marker);

				$('#addTagForm').live("click", function(event){
					b.name = $("#addNewTag").val();
					//newPoint.name = $("#entityName").val();
					//newPoint.type = $("#entityType").val();
					//tagss.push($("#entityType").val();
					//newPoint.tag.push($("#mapTag").val());
					  
					console.log(b);
				    });
					  


 			 //});
      }
 





})();