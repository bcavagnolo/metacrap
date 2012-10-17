/*--------------------------------------
Author: Bharathkumar Gunasekaran
Email: bharath@ischool.berkeley.edu
Created: 10/03/2012
Description: Javascript for Project 2
----------------------------------------*/

( function(){


	//declare the global variables
	var map, marker, infowindow;
	var listenerHandle;
	var len;
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

	window.onload = function(){ 

		//load the Pointstore
		psx = new PointStore(opt);
		
		//fix the map to Berkeley area
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

		//
		map = new google.maps.Map(document.getElementById('map'), options);

		psx.load(function() {
		google.maps.event.addListener(map, 'click', function(e) {
		        placeMarker(e.latLng);
		        });
		});
	}

	/**
	 * The markers get created when the page loads initially. 
	 */

		function createMarker(point) {


			point.glatlng = new google.maps.LatLng(point.posn[0], point.posn[1]);
		    var marker = new google.maps.Marker({
		        position: point.glatlng,
		        map: null,
		        title: 'Click to add tags',
		        });
		    point.Gmarker = marker;
		    len = point.tags.length;
		    
		    // added listeners to each of the markers for the user to click. The users will be able to delete the tags one by one.

		    google.maps.event.addListener(marker, 'click', function() {
				var contentString = '<div id="info">' +
					'<h2>'+point.name+'</h2>';
				contentString += '<ul id="taglist">'
				for (m in point.tags)
				{
					contentString += '<li class="tag" id="tag_' + point.idx + '_' + m + '">' +
						'<span class=tags id="content-tag_' + point.idx + '_' + m + '">'+point.tags[m]+'</span>' +
						'<span class="close close' + point.idx + '" id="close-tag_' + point.idx + '_' + m + '">x</span></li>';
				}
				contentString += '</ul><div><label>Add tag:</label><input type="text" id="addtag"/></div><div><input type="submit" id="addTagButton"/></div></div>';
				infowindow.setContent(contentString);
				infowindow.open(map,marker);
				$(".close" + point.idx).live("click", function(event){
					var id = this.id.split('-')[1];
					var tag = $('#content-' + id).html();
					i = point.tags.indexOf(tag);
					point.tags.splice(i,1);
					$('#' + id).remove();
				});

		     //This is used for the user to add new tags. The new tags added should also be delatable. 
		    // I'm not sure how to update the same point to pointstore after having added and removed tags
				$("#addTagButton").live("click", function(event){
					var asd = $("#addtag").val();
					point.tags.push(asd);
					
					console.log(asd);
				    var contentString = '<div id="info">' +
								'<h2>'+point.name+'</h2>';
					contentString += '<ul id="taglist">'
						for (n in point.tags)
						{
							contentString += '<li class="tag close'+n+'"><span class="tags">'+point.tags[n]+'</span><span class="close close'+n+'">x</span></li>';
						}				
					contentString += '</ul><div><label>Add tag:</label><input type="text" id="addtag"/></div><div><input type="submit" id="addTagButton"/></div></div>';
					infowindow.setContent("");
					infowindow.setContent(contentString);
					len = point.tags.length;
					$(".close").live("click", function(event){
					    var cls = $(this).attr('class');
					    var index;
					    for (var i = 0; i < len; i++)
					        {
					            if (cls.indexOf('close' + i)>=0)
					                index = i;
					        }
					    $('.close' + index).remove();
					    point.tags.splice(index,1);
				    console.log(point);
					});
				});
		        });
		
		};


      function showMarker(point){
      	point.Gmarker.setMap(map);
      };

      function hideMarker(point){
      	point.Gmarker.setMap(null);
      };


    //This function is used to add new markers and get input from the user. I have a problem if the user add more than one marker.
	function placeMarker(a){
		var b = new Point();
          marker = new google.maps.Marker({
          position: a,
          map: map,
          title: 'Add info to point'
        });
        b.Gmarker = marker;
        b.posn = [];
        b.posn.push(a.Xa);
        b.posn.push(a.Ya);

		    var contentForm = '<label>Name:</label><input type="text" id="addNewName"/><br><label>Add Entity Type:</label><input type="text" id="addNewEntity"/><br><label>Add tag:</label><input type="text" id="addNewTag"/><br><input type="submit" id="addTagForm"/>';
		    if (infowindow)
		    {
		    	infowindow.close();
		    }
		    infowindow.setContent(""); 
		    infowindow.setContent(contentForm); 			
		    infowindow.open(map,marker);

				$('#addTagForm').live("click", function(event){
					b.name = $("#addNewName").val();
					b.type = $("#addNewEntity").val();
					b.tags = [];
					b.tags.push($("#addNewTag").val());
					console.log(b);
					psx.updatePoint(b);
					infowindow.close();
					return false;
				    });
					  
    }
 
})();

