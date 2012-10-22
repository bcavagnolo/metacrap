Introduction
============

We imagined a meta-utopia where we don't penalize people for merely
misspelling. "People are Lazy!". MapCrap to the rescue.  Similar to the
misspelled listings on eBay that Cory Doctrow talks about, when people are
allowed to tag places on a map, they often misspell.  So we want to be able to
retrieve places with tags that were misspelled (e.g., 'restrant' rather than
'restaurant').  MapCrap's search filter does exactly that. We do not impose any
restrictionson on how the tags are spelled when they are created.  But we make
sure that even the misspelled tags show up in the search results.  Problem
solved!

Usage
=====

Load the index.html page and expect the map to center on Downtown Berkeley and
display all of the stored points.  Now you can:

Filter: start typing tags in the Filter Results box.  Expect the points that do
not have tags similar to the ones you specified to vanish.  Note that the
filter tolerates minor mispellings in the search tags.

Edit: Want to add a tag to an existing point?  Just click that point and expect
a dialog to pop up that allows you to edit the name, add tags, and remove tags.

Create: Want to add a new point to the map?  Just click the map where you want
the point to appear and expect a dialog to pop up that allows you to specify a
name and some tags.

Team
====

Bharathkumar Gunasekaran: Hacker & Designer - Set up the Interface &
Interaction with Google Maps API. Was also resposible for enabling all the
interactions with the user.

Brian Cavagnolo: Hacker & Designer - Designed, implemented and optimized the
"point store," which is the storage solution for the project. Integrated the
Fuzzy search algorithm.

Technologies
============
	javascript/json for framework
	AJAX for fetching point data
	Google maps API V3 for map and point display
	OpenKeyval for back-end storage
    Jasmine for unit testing
    List.js for fuzzy searching

Depolying
=========

The PointStore relies on a modified OpenKeyVal (http://openkeyval.org/) server.
This must be deployed on the server specified by the openKVURL option passed to
the PointStore constructor.  To deploy this server, fetch the code and follow
the instructions here:

https://github.com/shinyplasticbag/openkeyval

After you succeed, overwrite the server.inc file with the one supplied in this
distribution in the openkeyval directory.  This will add wildcard loading and
loading a range of kv pairs, which is used to optimize the PointStore's load
time.

After you complete your install, you should run the PointStore unit tests by
pointing your browser at:

PointStore-test.html

You also may wish to change the nameSpace option to the PointStore if you wish
to save points under a different nameSpace.  This allows many instances of
MapCrap to share a single back end.

Finally, if you want your MapCrap deploy to begin centered on a different
geographic location, change the latitude and longitude in map.js.

Quirks and known issues
=======================
	????????????
	

	
	

