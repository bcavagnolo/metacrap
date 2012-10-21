/*--------------------------------------
Author: Bharathkumar Gunasekaran
Email: bharath@ischool.berkeley.edu
Created: 10/03/2012
Description: Javascript for Project 2
----------------------------------------*/

( function(){


	//declare the global variables
	var map, infowindow;
	var tagArray;
	var newPoint = null;
	var index;
	var listenerHandle;
	var len;
	var psx;
	var saved;
	var currentMark;
	var opt = {
    nameSpace: "osmBaseData",
    openKVURL: "http://riyadh.cusp.berkeley.edu/",
    listID: 'point-store-list',
    createPointDisplay: createMarker,
    showPoint: showMarker,
    hidePoint: hideMarker,
    searchBoxID: 'tag',
	};
	var uid = 0;
	window.onload = function(){ 

		//load the Pointstore
		psx = new PointStore(opt);
		
		//fix the map to Berkeley area
		var fix = new google.maps.LatLng(37.8717, -122.2728)
		var options = {
					center: fix,
					zoom: 16,
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

		$("#addTagButton-1").live("click", function(event){
			return addTag(null);
		});

		$(".close-1").live("click", function(event){
			return closeTag(null, this);
		});

		$("#saveButton-1").live("click", function(event){
			return savePoint(null);
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

		    handleListener(point, marker);
		};


      function showMarker(point){
      	point.Gmarker.setMap(map);
      };

      function hideMarker(point){
      	point.Gmarker.setMap(null);
      };

    //This function is used to add new markers and get input from the user. I have a problem if the user add more than one marker.
	function placeMarker(a){
		if (newPoint) {
			console.log("WARNING: creating a new point but newPoint not null");
		}
		newPoint = new Point();
          var marker1 = new google.maps.Marker({
          position: a,
          map: map,
          title: 'Add info to point'
        });
		newPoint.Gmarker = marker1;
		currentMark = marker1;
		newPoint.tags = [];
		newPoint.posn = [];
		newPoint.posn.push(a.Xa);
		newPoint.posn.push(a.Ya);
		console.log(newPoint);
		var contentString = buildWindow(newPoint);
		infowindow = new google.maps.InfoWindow();
		infowindow.setContent(contentString);
		infowindow.open(map, marker1);
		saved = "false";
		console.log(saved);
		google.maps.event.addListener(infowindow,'closeclick',function(){
			if (newPoint.idx == -1){
				if (saved == "false"){
			   		currentMark.setMap(null);
			   	}
		   	}
		});

    }

	// add a tag to a point,
	function addTag(point) {
		if (!point) {
			if (!newPoint) {
				console.log("WARNING: addTag called without a point and newPoint is null")
				return false;
			}
			point = newPoint;
		}
		var asd = $("#addtag"+point.idx).val();
		if (asd != "")
		{
			var n = point.tags.length;
			point.tags.push(asd);
			var newName = $("#name"+point.idx).val();
			$("#name"+point.idx).val(newName);
			$("#taglist_"+point.idx).append('<li class="tag" id="tag_' + point.idx + '_' + uid + '">' +
											'<span class=tags id="content-tag_' + point.idx + '_' + uid + '">'+asd+'</span>' +
											'<span class="close close' + point.idx + '" id="close-tag_' + point.idx + '_' + uid + '">x</span></li>');
			$("#addtag"+point.idx).val("");
			console.log("add");
			console.log(tagArray);
			uid++;
		}
		return false;
	}

	// remove a tag from a point
	function closeTag(point, jq) {
		if (!point) {
			if (!newPoint) {
				console.log("WARNING: closeTag called without a point and newPoint is null")
				return false;
			}
			point = newPoint;
		}
		var id = jq.id.replace("close-", "");
		var tag = $('#content-' + id).html();
		i = point.tags.indexOf(tag);
		point.tags.splice(i,1);
		$('#' + id).remove();
		return false;
	}

	function savePoint(point) {
		if (!point) {
			if (!newPoint) {
				console.log("WARNING: savePoint called without a point and newPoint is null")
				return false;
			}
			point = newPoint;
		}

		console.log($('#saveButton'+ point.idx));
		point.name = $("#name"+point.idx).val();
		console.log(point.tags);
		infowindow.close();
		psx.updatePoint(point);
		newPoint = null;
	}

    function buildWindow(a){
    		tagArray = a.tags;;
    		if(a.name == null)
    		{
    			a.name = "Enter the name";
    		}

    		var contentString = '<div class="info" id="info_'+a.idx+'">' +
					'<input type="text" id="name'+a.idx+'" value="'+a.name+'">';
				contentString += '<ul id="taglist_' + a.idx + '">'
				//console.log(a.tags)
				for (m in a.tags)
				{
					contentString += '<li class="tag" id="tag_' + a.idx + '_' + m + '">' +
						'<span class=tags id="content-tag_' + a.idx + '_' + m + '">'+a.tags[m]+'</span>' +
						'<span class="close close' + a.idx + '" id="close-tag_' + a.idx + '_' + m + '">x</span></li>';
				}
				contentString += '</ul><div><label>Add tag:</label><input type="text" id="addtag'+ a.idx +'"/></div><div><input type="submit" value="Add" id="addTagButton'+a.idx+'"/></div><div><input type="submit" value="save" id="saveButton'+a.idx+'"/></div></div>';
			//console.log(contentString);
			return contentString;

    };

    function handleListener(b, markerPassed){

			    if (!b.tags){ b.tags = []};
			    if (b.idx !== -1){
			    	index = b.idx;
			    }
			    if (b.idx === -1){
			    	++index;
			    	b.idx = index;
			    }
			    var n = b.tags.length;
			    infowindow = new google.maps.InfoWindow();

			    

			   		google.maps.event.addListener(markerPassed, 'click', function() {
	   				var contentString = buildWindow(b);
					infowindow.setContent(contentString);
					infowindow.open(map,markerPassed);

					console.log(b);
					});
			   	

    			$("#addTagButton"+ b.idx).live("click", function(event){
					return addTag(b);
				});
				$(".close" + b.idx).live("click", function(event){
					return closeTag(b, this);
				});

				$('#saveButton'+ b.idx).live("click", function(event){
					return savePoint(b);
					saved = "true";
				});
    }
})();

