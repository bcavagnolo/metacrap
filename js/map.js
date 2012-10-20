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
	var index;
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
		var c = new Point();
          var marker1 = new google.maps.Marker({
          position: a,
          map: map,
          title: 'Add info to point'
        });
        c.Gmarker = marker1;
        c.posn = [];
        c.posn.push(a.Xa);
        c.posn.push(a.Ya);
        console.log(c);			
		    handleListener(c, marker1);

					  
    }


    function buildWindow(a){
    		tagArray = a.tags;;
    		if(a.name == null)
    		{
    			a.name = "Enter the name";
    		}

    		var contentString = '<div class="info" id="info_'+a.idx+'">' +
					'<input type="text" id="name'+a.idx+'" value="'+a.name+'">';
				contentString += '<ul id="taglist">'
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
			    console.log(b.tags);
			    console.log("The index");
			    if (b.idx !== -1){
			    	index = b.idx;
			    }
			    if (b.idx === -1){
			    	++index;
			    	b.idx = index;
			    }
			    console.log(b.idx);
			    var n = b.tags.length;
			    var infowindow = new google.maps.InfoWindow();

			    

			   		google.maps.event.addListener(markerPassed, 'click', function() {
	   				var contentString = buildWindow(b);
					infowindow.setContent(contentString);
					infowindow.open(map,markerPassed);
					console.log(b);
					});
			   	

    			$("#addTagButton"+ b.idx).live("click", function(event){
 					console.log(n);
					var asd = $("#addtag"+b.idx).val();
					if (asd != "")
					{
						tagArray.push(asd);
						var newName = $("#name"+b.idx).val();
						$("#name"+b.idx).val(newName);
						$("#info_"+b.idx+" ul").append('<li class="tag" id="tag_' + b.idx + '_' + n + '">' +
							'<span class=tags id="content-tag_' + b.idx + '_' + n + '">'+asd+'</span>' +
							'<span class="close close' + b.idx + '" id="close-tag_' + b.idx + '_' + n + '">x</span></li>');
						++n;
						$("#addtag"+b.idx).val("");
						console.log("add");
						console.log(tagArray);
					}
					return false;				
				});
				$(".close" + b.idx).live("click", function(event){
						var id = this.id.split('-')[1];
						var tag = $('#content-' + id).html();
						i = b.tags.indexOf(tag);
						tagArray.splice(i,1);
						--n;
						console.log(id);
						console.log($('#' + id));
						$('#' + id).remove();
						console.log("remove");
						console.log(tagArray);
						return false;
				});

				$('#saveButton'+ b.idx).live("click", function(event){
					console.log($('#saveButton'+ b.idx));
					b.name = $("#name"+b.idx).val();
					b.tags = tagArray;
					console.log(b.tags);
					infowindow.close();
					//psx.updatePoint(b);
				});
    }
})();

