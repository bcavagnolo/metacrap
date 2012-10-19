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
		    handleListener(marker, point);
		    

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
        c.tags = [];
        c.posn.push(a.Xa);
        c.posn.push(a.Ya);
        psx.updatePoint(c);
        console.log(c);

		    var contentForm = buildWindow(c);
		    if (infowindow)
		    {
		    	infowindow.close();
		    }
		    infowindow.setContent(""); 
		    infowindow.setContent(contentForm); 			
		    handleListener(marker1, c);

					  
    }


    function buildWindow(a){
    		if(a.name == null)
    		{
    			a.name = "Enter the name";
    		}

    		var contentString = '<div id="info">' +
					'<input type="text" id="name'+a.idx+'" value="'+a.name+'">';
				contentString += '<ul id="taglist">'
				console.log(a.tags)
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

    function handleListener(marker2, b){

    			google.maps.event.addListener(marker2, 'click', function() {
		    	var contentString = buildWindow(b);
				infowindow.setContent(contentString);
				infowindow.open(map,marker2);
				console.log(b);
				$("#addTagButton"+ b.idx).live("click", function(event){
					console.log("addTagButton Listener within the placeMarker");
					var asd = $("#addtag"+b.idx).val();
					console.log(asd);
					b.name = $("#name"+b.idx).val();
					console.log(b.name);
					if (asd != ""){
						b.tags.push(asd);
						}
					//psx.updatePoint(b);
					var contentString = buildWindow(b);
					infowindow.setContent(contentString);
					return false;				
				});
				$(".close" + b.idx).live("click", function(event){
					console.log("close Listener within the placeMarker");
					var id = this.id.split('-')[1];
					console.log(id);
					var tag = $('#content-' + id).html();
					i = b.tags.indexOf(tag);
					b.tags.splice(i,1);
					$('#' + id).remove();
					psx.updatePoint(b);
					return false;
				});

				$('#saveButton'+ b.idx).live("click", function(event){
					console.log(this);
					psx.updatePoint(b);
					infowindow.close();
					return false;
				});
				
			});
    }
 
})();

