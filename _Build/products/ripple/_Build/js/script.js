$(document).ready(function(){
	"use strict";
	
    FastClick.attach(document.body);

    $('input, textarea').placeholder();

    windowObject = location.search; // Needed to stub in karma tests

    loadXMLFile("xml/maintopics.xml", function(tempXml){
    	xmlDoc = tempXml;
    	pageJS();
    });
});