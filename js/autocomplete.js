// Javascript file for Autocompletion

// This part of the code is straight from the demo at http://jqueryui.com/demos/autocomplete/#categories
$.widget( "custom.catcomplete", $.ui.autocomplete, {
	_renderMenu: function( ul, items ) {
		var self = this,
			currentCategory = "";
		$.each( items, function( index, item ) {
			if ( item.category != currentCategory ) {
				ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
				currentCategory = item.category;
			}
			self._renderItem( ul, item );
		});
	}
});

// Set up map tag variables and autocompletion
// Any changes to the vocabulary should be made within mapTags.
$(function() {
	var mapTags = [
		{ label: "Fancy", category: "" },
		{ label: "Clean", category: "" },
		{ label: "Restaurant", category: "Food" },
		{ label: "Cafe", category: "Food" },
		{ label: "Clothing", category: "Shopping" },
		{ label: "Bicycles", category: "Shopping" },
		{ label: "Library", category: "Public Places" },
		{ label: "Park", category: "Public Places" },
		{ label: "Cheap", category: "Cost" }
	];
	
	// using jQuery to set the #mapTag input box to be autocomplete (categories)
	$( ".mapTaggable" ).catcomplete({
		delay: 0,
		source: mapTags
	});

});
