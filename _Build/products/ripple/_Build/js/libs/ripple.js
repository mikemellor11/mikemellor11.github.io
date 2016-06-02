var xmlDoc = null;
var windowObject = null;

function loadXMLFile (filenameAndPath, completeCallback) {
	if (Modernizr.xdomainrequest){
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filenameAndPath, false);
		xmlhttp.send();
		completeCallback(xmlhttp.responseXML);
	} else {
		$.ajax({
		    type: "GET",
		    url: filenameAndPath,
		    dataType: "xml",
		    success: function (xml) {
		        completeCallback($(xml));
		    },
		    error: function (err){
		    	console.log(err);
		    }
		});
	}
}

function popuplateCategories () {
	$('#js_categories').append($(document.createElement("option")).attr({'value': 0, 'disabled': 1, 'selected': 1, 'hidden': 1}).text("Category")[0]);
	ddlAddOption("js_categories", "All", 0);

	$(xmlDoc).find("topic").each(function(element){
		ddlAddOption("js_categories", this.getAttribute("title"), this.getAttribute("id"));
	});
}

function populateSubCategories () {
	$("#js_subCategories").empty();
	var currentCategory = getDDLSelectedValue("js_categories");

	if(+currentCategory === 0){
		$("#js_subCategories").parent().addClass('selectBox-noItems');
		$("#js_subCategories").prop( "disabled", true );
		$('#js_subCategories').append($(document.createElement("option")).attr({'value': 0, 'disabled': 1, 'selected': 1, 'hidden': 1}).text("Please select a category first")[0]);
	} else {
		$("#js_subCategories").parent().removeClass('selectBox-noItems');
		$("#js_subCategories").prop( "disabled", false );
		$('#js_subCategories').append($(document.createElement("option")).attr({'value': 0, 'disabled': 1, 'selected': 1, 'hidden': 1}).text("Sub-category")[0]);

		ddlAddOption("js_subCategories", "All", 0);

		$(xmlDoc).find("topic").each(function(){
			if(currentCategory == 0 || this.getAttribute("id") === currentCategory){
				for(var i = 0; i < this.childNodes.length; ++i){
					if(this.childNodes[i].nodeType == 1){
						ddlAddOption("js_subCategories", this.childNodes[i].getAttribute("title"), this.childNodes[i].getAttribute("id"));
					}
				}
			}
		});
	}
}

function countArticles(currentCategory, currentSubCategory, currentLastUpdated, currentSearch, currentFilter, results) {
	if(!arguments.length){
		currentCategory = getDDLSelectedValue("js_categories");
		currentSubCategory = getDDLSelectedValue("js_subCategories");
		currentLastUpdated = getDDLSelectedValue("js_lastUpdated");
		currentSearch = 0;
		currentFilter = 1;
	}
	
	var count = 0;
	var resultsList = [];
	var searchTerms = (+currentSearch === 0) ? null : decodeURIComponent(currentSearch).replace(/ /g, ',').split(',');
	var criteriaText = [];

	var today = new Date();
	var monthSelect = new Date(); monthSelect.setMonth(monthSelect.getMonth() - +currentLastUpdated);

	$(xmlDoc).find("topic").each(function(){
		if(currentFilter === 0 || +currentCategory === 0 || this.getAttribute("id") == currentCategory){
			if(results){
				var temp = (+currentCategory === 0) ? "All" : this.getAttribute("title");
				$('.js_cat').text(temp);
				criteriaText.push(temp);
			}

			$(this).find("subtopic").each(function(){
				if(currentFilter === 0 || +currentSubCategory === 0 || this.getAttribute("id") == currentSubCategory){
					if(results){
						var temp = (+currentSubCategory === 0) ? "All" : this.getAttribute("title");
						$('.js_sub').text(temp);
						criteriaText.push(temp);
					}

					$(this).find("keymessage").each(function(){
						var dateCheck = $(this).find('contentLastUpdated').text().split("-");
						var compare = new Date(dateCheck[0], (dateCheck[1] - 1), dateCheck[2]);
						if(currentFilter === 0 || +currentLastUpdated === 0 || (compare > monthSelect && compare < today)){
							if(results){
								var frequency = 0;

								if(+currentSearch === 0){
									frequency += 1;	
								} else {
									$(this).find("Word").each(function () {
										if($.inArray($(this).text(), searchTerms) > -1){
											frequency += +this.getAttribute('frequency');
										}
									});
								}

								var queryString = "?cat=" + currentCategory;
							    queryString += "&sub=" + currentSubCategory;
							    queryString += "&last=" + currentLastUpdated;
							    queryString += "&search=" + currentSearch;
							    queryString += "&filter=" + currentFilter;

								resultsList.push({
									search: queryString,
									id: this.getAttribute('id'),
									title: $($(this).find("title")).text(),
									last: $($(this).find("contentLastUpdated")).text(),
									frequency: frequency
								});
							}
							count += 1;
						}
					});
				}
			});
		}
	});

	if(searchTerms !== null){
		resultsList.sort(function (a,b) {
			if (+a.frequency > +b.frequency) {
			    return -1;
			}
			if (+a.frequency < +b.frequency) {
				return 1;
			}
			return 0;
		});
	}

	if(results){
		count = 0;

		$.each(resultsList, function(i, d){
			if(d.frequency > 0){
				$('#js_resultsList').append('<li><a href=' + "keyMessage.html" + d.search + "&kmID=" + d.id + '><span>' + d.title + '</span><span>Last updated ' + d.last + '</span></a></li>');
				count += 1;
			}
		});

		if(searchTerms !== null){
			$('.js_search').text(searchTerms.join(', '));
			$('.js_resultsAlt').removeClass('ut-hide');
		} else {
			$('.js_results').removeClass('ut-hide');
		}
	}

	$('.js_articleTotal').text(count);
}

function populateAutocomplete () {
	var searchTerms = [];
	var catID = getDDLSelectedValue("js_categories");
	var subCatID = getDDLSelectedValue("js_subCategories");

	$(xmlDoc).find("subtopic").each(function () {
		if((catID == 0 || this.parentNode.getAttribute("id") == catID) && (subCatID == 0 || this.getAttribute("id") == subCatID)){
			$(this).find("Word").each(function () {
				if($.inArray($(this).text(), searchTerms) == -1)
					searchTerms.push(($(this).text()));
			});
		}
	});
	searchTerms.sort();
	$("#js_searchTerms")
		.bind( "keydown", function (event) {
			if(event.keyCode == 13) {
				if($('.ui-autocomplete').css('display') === 'none') {
					$('.js_searchButton').click();
				}
			}
		})
		.autocomplete({
			appendTo: $('#js_searchTerms').parent(),
			minLength: 1,
			source: function (request, response) {
				response($.ui.autocomplete.filter(searchTerms, extractLast(request.term)));
			},
			focus: function() {
				return false;
			},
			select: function (event, ui) {
				var terms = split(this.value);
				terms.pop();
				terms.push(ui.item.value);
				terms.push("");
				this.value = terms.join( ", " );
				return false;
			},
			error: function (response) {
			}
		});
	function split( val ) {
	  return val.split( /,\s*/ );
	}
	function extractLast( term ) {
	  return split( term ).pop();
	}
}

function populateResults () {
	var searches = getQueryStringValue("search");
	if($.trim(searches) === ''){
		searches = 0;
	}
	countArticles(getQueryStringValue("cat"), getQueryStringValue("sub"), getQueryStringValue("last"), searches, getQueryStringValue("filter"), true);

	if($('#js_resultsList').children().length > 1){
		$($('#js_resultsList').children()[0]).addClass('ut-hide');
	}
}

function populateKeyMessage () {
	var keyMessageID = getQueryStringValue("kmID");
	loadXMLFile("xml/content/" + keyMessageID + "/" + keyMessageID + ".xml", function(kmXML){
		var keyMessage = $(kmXML).find("HtmlTextKey").text();
		$("#js_lastUpdated").html('Last updated ' + $(kmXML).find("contentLastUpdated").text());
		$(".js_messageTitle").html($(kmXML).find("Title").text());
		$("#js_keyMessage").html($(kmXML).find("HtmlText").text());
		$("#js_keyMessageKEY").html(keyMessage);
		$("#js_references").html($(kmXML).find("References").text());
		$(".js_pdf").attr("href", $(kmXML).find("pdf").text());
		$(".js_docx").attr("href", $(kmXML).find("docx").text());
		if($('#js_relatedKMs').length){
			$(kmXML).find("RelatedFile").each(function () {
				addRelatedKMToList("js_relatedKMs", $(this).text(), $(this).attr("ID"));
			});
		}

		if($.trim($("#js_references").html()).length > 0){
			$(".js_referencesNo").addClass('ut-hide');
		}

		$(".js_keyMessageNo").addClass('ut-hide');

		if($('#js_relatedKMs').children().length > 1){
			$($('#js_relatedKMs').children()[0]).addClass('ut-hide');
		}

		if($.trim(keyMessage).length > 0){
			$('.js_hideKey').show();
		}
	});

	var queryString = "?cat=" + getQueryStringValue("cat");
    queryString += "&sub=" + getQueryStringValue("sub");
    queryString += "&last=" + getQueryStringValue("last");
    queryString += "&search=" + getQueryStringValue("search");
    queryString += "&filter=" + getQueryStringValue("filter");

	$('.js_backButton').attr('href', "results.html" + queryString);
}

// XML DOC UPWWARDS

function getDDLSelectedValue (elementID) {
	if(typeof(elementID) !== "string"){
		return '0';
	}
	var ddl = document.getElementById(elementID);
	
	if(ddl === undefined || ddl === null){
		return '0';
	}

	return ddl.options[ddl.selectedIndex].value;
}

function ddlAddOption (dropDownListID, text, value) {
	var option = document.createElement("option");
	option.text = text;
	option.value = value;
	document.getElementById(dropDownListID).add(option);
}

function addRelatedKMToList (listID, itemText, relatedID) {
	var queryString = "?cat=" + getQueryStringValue("cat");
    queryString += "&sub=" + getQueryStringValue("sub");
    queryString += "&last=" + getQueryStringValue("last");
    queryString += "&search=" + getQueryStringValue("search");
    queryString += "&filter=" + getQueryStringValue("filter");

	var aTag = document.createElement("a");
	aTag.href = "keyMessage.html" + queryString + "&kmID=" + relatedID;
	aTag.innerHTML = itemText;

	var listItem = document.createElement("li");
	listItem.appendChild(aTag);
	document.getElementById(listID).appendChild(listItem);
}

function getQueryStringValue (paramName) {
	if(windowObject){
		var paramsAndValues = windowObject.split("?")[1].split("&");
		for(var i = 0; i < paramsAndValues.length; ++i){
			if(paramsAndValues[i].split("=")[0] == paramName)
				return paramsAndValues[i].split("=")[1];
		}
	}
	return 0;
}