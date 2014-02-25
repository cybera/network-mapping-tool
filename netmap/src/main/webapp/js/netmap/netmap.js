//prevent console fail
if (typeof console === "undefined" || typeof console.log === "undefined") {
    console = {};
    console.log = function() {};
}

var indexedLinkTypes;
var networks;
var indexedPlaces;
var locations;
var map;
var currentView = {};
var networkVisibility = {};
var dragAllowed = false;


$(document).ready(function() {
	
	$.ajaxSetup ({
	    // Disable caching of AJAX responses
	    cache: false
	});
	
	
	//handle Views & Sharing
	var currentViewParam = decodeURIComponent($.urlParam('currentView'));
	currentView = JSON.parse(currentViewParam);

	$('#share').click(function() {
		createCurrentView();
		
		var url = window.location.origin + window.location.pathname + '?currentView=' + encodeURIComponent(JSON.stringify(currentView));
		var emailUrl = "mailto:?subject=A network map has been shared with you&body=" + encodeURIComponent(url);
		
		var dialog = $('<div>', {title: 'Map URL', style: 'font-size:.6em; word-wrap: break-word;'}).html(url);
		
		dialog.dialog({
			width: 450,
			buttons: {
				"email": function() {
					dialog.dialog('close');					
					window.location = emailUrl;
				},
				"pop-off": function() {
					dialog.dialog('close');
					window.open(url);
				},
				"close": function() {
					dialog.dialog('close');
				}
			}
		}).dialog('open');
	});
	
	
	//Legend Setup
	$("#maxLegend").click(function() {
		var mc =$("#mapController"); 
		var w = $(window).width();
		var h = $(window).height();

		
		if($("#maxLegend").attr("src") == "images/maximize.png") {
			mc.css("top", 0);
			mc.height(h-20);
			mc.width(400);
			mc.height(1000);
			$("#maxLegend").attr("src", "images/minimize.png");
			
			$(".legendImage").height(100);
			$(".legendIcon").height(80).width(80);
			$(".legendItemLabel").css("font-size", "25px");
			$(".legendTitle").css("font-size", "30px");
			$("#searchText").width("250").height(50).css("font-size", "25px");
			
		}
		else {
			setLegendPreferredSize();
		}
	});

	$("#minLegend").click(function() {
		var mc = $("#mapController");
		legendLastPos = {
				top: mc.position().top,
				left: mc.position().left,
				width: mc.width(),
				height: mc.height()
		};
		
		var width = $(window).width();
		
		$("#mapController").animate({
			top: 5,
			left: (width-250),
			width: 0,
			height: 0, 
		}, 500, function() {
			$("#mapController").hide();
			$("#layersButton").show();
		});
	});
	
	$("#layersButton").click(function() {
		$(this).hide();
		
		$("#mapController").show().animate(legendLastPos, 500);
	});
	
	//Search Box Setup
	$("#searchText").change(function() {
		var geocoder = new google.maps.Geocoder();

		geocoder.geocode({
			address : $(this).val()
		}, function(results, status) {
			console.log('geocode: ', " -> ", status);
			if (status == google.maps.GeocoderStatus.OK) {
				map.map.setCenter(results[0].geometry.location);
		        if (results[0].geometry.viewport) 
		          map.map.fitBounds(results[0].geometry.viewport);
			} else {
				showToast("unable to geocode", false, 'error');
			}

		});
	});
 
	
	//Map Style Setup
	$("#mapStyleChooser").dialog({
		autoOpen : false,
		modal : true,
		title : "Choose Map Style",
		width : 'auto',
		buttons : {
			"Done" : function() {
				$(this).dialog("close");
			}
		}
	});
	

	//Determine current mode from querystring "?mode=editMode"
	editMode = false;
	if($.urlParam("mode") == "editMode") {
		editMode = true;
	}
	
	//setup map
	map = new Map();
	$(document).keyup(function(e) {
		//pass escape thru to allow map to stop edit operations
		  if (e.keyCode == 27) { 
			  map.notifyEscape();
		  }
	});	

	//resize components with window/split pane change
	$(window).bind('resize', function() {
		doresize();
	}).trigger('resize');
	
	
	// determine what fields are shown on popup for user mode
	if(!editMode) {
		$.getJSON('ns/organization/displayDetails', function(result) {
			orgDisplayItems = $.map(result, function(itm, idx) {
				if(itm.visible)
					return itm.name;
			});			
		});
		
	}

	
	// fetch all the organizations & their networks
	var promises = [];	
	promises.push($.getJSON('ns/networkConnection/speeds'));
	promises.push($.getJSON('ns/networkConnection/networks'));
	promises.push($.getJSON('ns/organization/types'));
	promises.push($.getJSON('ns/organization'));
	promises.push($.getJSON('ns/networkConnection'));

	$.when.apply($, promises).done(function() {
		console.log('Netmap Init Promises: ', arguments);
		
		indexedLinkTypes = arguments[0][0];
		networks = arguments[1][0];
		organizationTypes = arguments[2][0];
		places = arguments[3][0];
		links = arguments[4][0];
		
		indexedPlaces={};
		$.each(places, function(idx, place) {
			indexedPlaces[place.uuid] = place;
			if(place.organizationType) {
				place.organizationType.toString = function() {
					return this.type;
				};
			}
		});
		
		if(editMode) {
			//Setup password prompt
			var loginPassed = false;
			var login = $("<div>", {id: 'login', 'class': 'login'});
			login.append($("<label>", {text: 'Password:'}));
			login.append($("<input>", {type: 'password', id: 'password'}));
			login.dialog({
				modal: true,
				title: 'Admin Login',
				buttons: {
					'Login': function() {
						
						var password = $('#password').val();
						post("ns/admin/login?password=" + password, null, 'json', function(result) {
							loginPassed = true;
							$('#login').dialog('close');
						});
					},
					'Cancel': function() {
						editMode = false;
						$(this).dialog('close');
					}
				},
				close: function() {
					editMode = loginPassed;
					finishLoad(editMode);					
				}
			});
		} else {
			finishLoad(false);	
		}

		//setup the autocomplete on organizations now that places have been loaded
		$("#searchText").autocomplete({
	 		source: $.map(places, function(val, key) { return {label: val.name, id: val.uuid}; }),
	 		select: function(event, ui) {
	 			map.zoomTo(indexedPlaces[ui.item.id].marker);
	 			map.click(ui.item.id);
	 		}
		});



	});
	
})

function finishLoad(editMode) {
	if (editMode) {
		//dynamically load the page/javascript for edit functionality
		$("#edit_canvas").load("netmapEdit.html", function() {
			loadPlaces(places);
			showLinks();
			createMapController(applyCurrentView);
		});
	} else {
		loadPlaces(places);
		showLinks();
		createMapController(applyCurrentView);	
	}
}

function refreshNetworkLegend() {
	var me = this;

	//fetch the networks and rebuild the section in the Legend
	return $.getJSON('ns/networkConnection/networks', function(result) {
		$("#mapNetworks").empty();
		networks = result;

		$.each(networks, function(index, network) {
			var legendItem = $("<div>", {'class': 'legendItem', id: network.uuid}).appendTo("#mapNetworks");
			
			$("<div>", {'class': 'legendIcon', style: 'background-color:'+network.colour}).appendTo(legendItem);
			$("<span>", {'class': 'legendItemLabel'}).text(network.name).appendTo(legendItem);
			
			networkVisibility[network.uuid] = true;
			legendItem.click(function() {
				var opacity = $(this).css("opacity");
				var selected = true;
				var nopacity = 1;
				
				if(opacity == 1) {
					selected = false;
					nopacity = 0.2;	
				}
				
				var id = $(this).attr('id');
				me.map.lineVisibility(selected, id);
	 			$(this).css("opacity", nopacity);
	
	 			//where to for this now?
	//			window.open(network.url);
	 			
				console.log($(this).attr("opacity"));
			});
		});
	});
}

function refreshOrgTypeLegend() {
	var me = this;
	
	//fetch the org types and rebuild the section in the Legend
	return $.getJSON('ns/organization/types', function() {
		$("#mapOrgTypes").empty();
		$.each(organizationTypes, function(index, type) {
			//var checkbox = $('<input>').attr({ type: 'checkbox', id: type.uuid, checked: true});
			//var style = 'color: ' + type.colour + ';';
			var legendItem = $("<div>", {'class': 'legendItem', id: type.uuid}).appendTo("#mapOrgTypes");
			
			$("<img>", {src: type.legendIcon, 'class': 'legendImage'}).appendTo(legendItem);
			$("<span>", {'class': 'legendItemLabel'}).text(type.type).appendTo(legendItem);
			
			
			legendItem.click(function() {
				var opacity = $(this).css("opacity");
				var selected = true;
				var nopacity = 1;
				
				if(opacity == 1) {
					selected = false;
					nopacity = 0.2;	
				}
				
				var id = $(this).attr('id');
	 			me.map.markerVisibility(selected, id);
	 			$(this).css("opacity", nopacity);
				
				console.log($(this).attr("opacity"));
			});
		});
	});
}

function createMapController(callback) {
	var me = this;
	
	//Fetch the legend data and setup
	var promises = [];	
	promises.push(refreshNetworkLegend());
	promises.push(refreshOrgTypeLegend());
	$.when.apply($, promises).done(function() {
		$("#mapController").show();
		setLegendPreferredSize();
		if (callback) callback();
	});
	$("#mapController").draggable().resizable();

	//Handle MapStyle change, store as a cookie to persist
	$("#mapStyleSelect").change(function() {
		var select = $(this);
		var itm = select.find('[value="'+select.val()+'"]').data("mapstyle");
		var style = JSON.parse(itm.style);
		console.log("itm: ",itm);
		map.map.setOptions({styles: style});
		
		$.cookie("defaultMapStyleID", itm.uuid);
	});
	refreshMapStyles();
}

function refreshMapStyles(styleUUID) {
	//Setup the Map Styles, setting to the default from the cookie if it exists
	$.getJSON("ns/mapStyles", function(result) {
		console.log("result:",result);
		var select = $("#mapStyleSelect");
		select.empty();
		var defaultId = (styleUUID) ? styleUUID : $.cookie("defaultMapStyleID");
		$.each(result, function(idx, itm) {
			var op = $("<option>", {value:itm.name}).html(itm.name).appendTo(select);
			if(itm.uuid == defaultId) {
				op.attr("selected", "selected");
				map.map.setOptions({styles: JSON.parse(itm.style)});
			}
			op.data("mapstyle", itm);
		});
	});
}

function loadPlaces(places) {
	//Setup places
	$.each(places, function(idx, place) {
		if(place.geom.coordinates[0]) {
			if (editMode)
				place.marker = map.drawPlace(place, createLink, handleSelectPlace, handleDrag, handleDragEnd);
			else
				place.marker = map.drawPlace(place);
		}
		
		if(place.organizationType) {
			//display this object by it's type in the table
			place.organizationType.toString = function() {
				return this.type;
			};
		}
	});
}

function showLinks() {
	//Display all the networks
	map.clearLines();
	$.each(links, function(idx, link) {
		var from = indexedPlaces[link.orgStartUUID];
		var to = indexedPlaces[link.orgEndUUID];
		var line = map.drawLink(link, from, to, indexedLinkTypes[link.type]);
	});
}

function doresize() {
	//dynamically adjust the sizes of the panels when the window is resized
	var h = $(window).height();
	
	if($("#bottom").is(":visible")) {
		var bottomh = $("#bottom").height();
		var toolbarh = $("#toolbar").height();
		h = $(window).height()-bottomh;

		$("#placeTable").setGridWidth($(window).width());
		$("#placeTable").setGridHeight(bottomh-toolbarh);
	}
	$("#map_canvas").height(h);
	$("#map3d").height(h);
}

function setLegendPreferredSize() {
	//set a default size on the legend
	$("#mapController").css("top", 18).css("left", 83).height(500).width(200);
	
	$("#maxLegend").attr("src", "images/maximize.png");
	$(".legendImage").height(40);
	$(".legendIcon").height(30).width(30);
	$(".legendItemLabel").css("font-size", "14px");
	$(".legendTitle").css("font-size", "15px");
	$("#searchText").width("150").height(25).css("font-size", "15px");

}


function createCurrentView() {
	
	// build an object that contains the visual layout of the map
	currentView = {};
	
	currentView['disabledOrgTypes'] = [];
	$.each($("#mapOrgTypes > div"), function(index, div) {
		if ($(div).css('opacity') != 1) currentView['disabledOrgTypes'].push($(div).attr('id'));
	});
	
	currentView['disabledNetworks'] = [];
	$.each($("#mapNetworks > div"), function(index, div) {
		if ($(div).css('opacity') != 1) currentView['disabledNetworks'].push($(div).attr('id'));
	});
	
	if ($('#mapStyleSelect').val()) {
		var itm = $('#mapStyleSelect').find('[value="'+$('#mapStyleSelect').val()+'"]').data("mapstyle");
		currentView['mapStyle'] = itm.uuid;
	}
	
	if ($('#layersButton').is(':visible')) currentView['legend'] = 'minLegend';
	else if ($("#maxLegend").attr("src") == "images/minimize.png") currentView['legend'] = 'maxLegend';
	
	
	if (this.map.currentUUID != null && this.map.infoWindow.getMap() !== null && this.map.infoWindow.getMap() !== "undefined") {
		if (this.map.infoWindow.position !== null && this.map.infoWindow.position !== undefined) {
			currentView['infoWindowLat'] = this.map.infoWindow.position.lat();
			currentView['infoWindowLng'] = this.map.infoWindow.position.lng();
		} 
		currentView['infoWindowUUID'] = this.map.currentUUID;
	}
	
	currentView['mapLat'] = this.map.getCenter().lat();
	currentView['mapLng'] = this.map.getCenter().lng();
	currentView['zoom'] = this.map.getZoom();
	currentView['mapTypeId'] = this.map.map.mapTypeId;
	
	console.log("Curent View: ", currentView);
}

function applyCurrentView() {

	// Setup the map to match the stored view
	console.log("Applying Current View: ", currentView);
	
	if (currentView == null) return;
	
	if (currentView.disabledOrgTypes) {
		$.each(currentView.disabledOrgTypes, function(index, orgType) { $("#" + orgType).click(); });
	}
	
	if (currentView.disabledNetworks) {
		$.each(currentView.disabledNetworks, function(index, network) { $("#" + network).click(); });
	}
	
	if (currentView.mapStyle) {
		refreshMapStyles(currentView.mapStyle);
	}
	
	if (currentView.legend) {
		$('#' + currentView.legend).click();
	}
	
	if (currentView.mapLat && currentView.mapLng) {
		this.map.setCenter(currentView.mapLat, currentView.mapLng);
	}
	
	if (currentView.zoom) {
		this.map.setZoom(currentView.zoom);
	}
	
	this.map.map.setMapTypeId(currentView.mapTypeId);

	if (currentView.infoWindowLat && currentView.infoWindowLng) {
		this.map.click(currentView.infoWindowUUID, currentView.infoWindowLat, currentView.infoWindowLng);
	} else if (currentView.infoWindowUUID) {
		this.map.click(currentView.infoWindowUUID);
	}

}

