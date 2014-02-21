var lastsel;

$(document).ready(function() {
	console.log('Loading Edit Mode');

	//allow resizing of grid/map
	$("#bottom").resizable({
		handles : "n"
	}).resize(function(event) {
		doresize();
		return false;
	});

	// toolbar actions
	$("#fileinput").hide().fileReaderJS({
		on : {
			load : function(e, file) {
				importKML(file);
			},
			error : function(e, file) {
			},
			groupstart : function(group) {
			},
			groupend : function(group) {
			}
		}
	});

	$("#openButton").click(function() {
		$("#fileinput").click();
		return false;
	});

	$("#linkTypeDialog").dialog({
		autoOpen : false,
		modal : true,
		width : 600,
		buttons : {
			"Update" : function() {
				try {
					indexedLinkTypes = JSON.parse($("#linkTypes").val());
					showLinks();
				} catch (e) {
					alert("Unable to update link types: JSON failed to parse");
				}
				$(this).dialog("close");
			},
			Cancel : function() {
				$(this).dialog("close");
			}
		}
	});

	$("#addButton").click(function() {
		addRow();
	});

	$("#editButton").click(function() {
		var row = $("#placeTable").jqGrid("getGridParam", "selrow");
		console.log("row: ", row);
		editRow(row);
	});

	$("#deleteButton").click(function() {
		var row = $("#placeTable").jqGrid("getGridParam", "selrow");
		console.log("row: ", row);
		deleteRow(row);
	});

	$("#lockButton").click(function() {
		dragAllowed = !dragAllowed;
		
		var msg = "Map Pins are now locked and cannot be dragged.";
		var img = "images/lock.png";
		if(dragAllowed) {
			img = "images/unlock.png";
			msg = "You can now drag the map pins.";
		}
		$("#lockButton").attr("src", img);
		
		$.each(places, function(idx, itm) {
			itm.marker.setDraggable(dragAllowed);
		});
		
		showToast(msg);
	});

	
	setupTable();
});

function setupTable() {
	if (!editMode)
		return;

	var placeObj = getFirstProperty(indexedPlaces);
	var colNames = [];
	var colModel = [];

	// setup table model based on properties of object
	$.each(placeObj, function(key, val) {
		console.log("key:", key, "val:", val);

		// Internal types we don't want in the table
		if (key == 'marker' || key == 'links')
			return true;

		var name = key;
		console.log('name:', name);
		colNames.push(key);

		var opts = {
			name : name,
			editable : true,
			sortable : true,
			sorttype : 'text'
		};

		if (key == "uuid") {
			opts.key = true;
			opts.hidden = true;
		}
		else if (key == 'organizationType') {
			opts.edittype = 'custom';
			opts.editoptions = {
				custom_element : function(value, options) {
					console.log(value, options);

					var select = $("<select>");

					$.each(organizationTypes, function(idx, itm) {
						var option = $("<option>", {
							value : itm.type
						}).html(itm.type).appendTo(select);
						if (itm.type == value)
							option.attr("selected", "selected");

					});

					return select;
				},
				custom_value : function(elem) {
					var val = $(elem).val();
					console.log("val: ", val);
					return val;
				}
			};
			/*
			opts.formatter = function (cellValue, options, rawData) {
				if (cellValue instanceof String) return cellValue;
				return cellValue.type;
			};
			opts.unformat = function (cellValue, options, rawData) {
				console.log('Unformat: ' + cellValue);
				return cellValue;
			}
			*/
		} else if (key == 'connected') {
			opts.edittype = 'checkbox';
			opts.editoptions = {
				value : "true:false"
			};
		} else if (key == 'geom') {
			opts.hidden = true;
		}

		colModel.push(opts);
	});

	var w = $(window).width();

	console.log("colNames:", colNames);
	console.log("colModel:", colModel);

	tableOptions = {
		grouping : true,
		groupingView : {
			groupField : [ 'province' ],
			groupDataSorted : true
		},
		datatype : "local",
		sortable : true,
		colNames : colNames,
		colModel : colModel,
		shrinkToFit : true,
		height : 175,
		width : w,
		rowNum : places.length,
		rowList : [ 10, 20, 30 ],
		scroll : true,
		scrollrows : true,
		
		onSelectRow : function(id, status, event) {
			// check if edit bailed
			if (id && id !== lastsel) {
				if(lastsel) {
					console.log("lastsel:",lastsel);
					console.log("id:",id);
				$.confirm("Do you want to save changes to "+indexedPlaces[lastsel].name+"?",
						{
						buttons : {
							"Yes" : function() {
								console.log("calls saveRow",id);
								$("#placeTable").jqGrid('saveRow', lastsel, {
									url : 'clientArray',
									keys : true,
									aftersavefunc : function() {
										saveOrg(lastsel);
									}
								});
								$(this).dialog("close");
		
							},
							"No" : function() {
								$("#placeTable").jqGrid('restoreRow', lastsel);
								lastsel = undefined;
								$(this).dialog("close");
							}
						}
						});
				}
			}

			// show corresponding infowindow on map
			if (event) {
				// only call if user actually click (otherwise recursive loop)
				if (indexedPlaces[id].marker) {
					map.zoomTo(indexedPlaces[id].marker);
					map.click(id);
				}
			}

		},
		ondblClickRow : function(id, ri, ci, e) {
			// edit on double click

			lastsel = id;
			// $("#placeTable").jqGrid('editRow', id, true, 'clientArray');
			editRow(id);

		}

	};

	var table = $("#placeTable").jqGrid(tableOptions);
	
//	.navGrid("#pagernav", {
//		edit : false,
//		add : false,
//		del : false
//	});

	// set data reference directly on table so that we are linked for updates
	table[0].p.data = places;
	table.trigger('reloadGrid');

	//handle right click on rows
	$.contextMenu({
		selector : ".ui-jqgrid tr",
		build : function($trigger, e) {
			console.log(e);

			console.log('^^^^^^^^^^^^^^^^^^^^^^^^^ target:', $(e.target));

			var id = $trigger.attr('id');

			var items = {
				'edit' : {
					name : "Edit"
				}
			};
			var sel = $("#placeTable").jqGrid("getGridParam", "selrow");

			var address = indexedPlaces[sel].postalCode;
			if (address) {
				items['geocode'] = {
					name : "Geocode Postal Code."
				};
			}

			return {
				callback : function(key, options) {
					if (key == "edit")
						editRow(sel);
					else if (key == "geocode") {
						
						//Geocode with google maps api
						var geocoder = new google.maps.Geocoder();
						geocoder.geocode({
							address : address
						}, function(results, status) {
							console.log('geocode: ', address + " -> ", status);
							if (status == google.maps.GeocoderStatus.OK) {

								var newLatLng = new google.maps.LatLng(
										results[0].geometry.location.lat(),
										results[0].geometry.location.lng());
								indexedPlaces[sel].marker
										.setPosition(newLatLng);
								indexedPlaces[sel].geom = {
									type : "Point",
									coordinates : [ newLatLng.lng(),
											newLatLng.lat() ]
								};

								mergeOrganization(indexedPlaces[sel]);
								// console.log("save here too...");

							} else {
								showToast("unable to geocode", false, 'error');
							}

						});

					}
					console.log("geocode" + address);
				},
				items : items
			};
		}
	});

}

function getFirstProperty(obj) {
	return obj[Object.keys(obj)[0]];
}

function importKML(file) {

	var data = new FormData();

	data.append("kmlFile", file);

	$.ajax({
		url : 'ns/organization/loadKML',
		data : data,
		cache : false,
		contentType : false,
		processData : false,
		type : 'POST',
		success : function(data) {
			showToast("reload organizations here...");
		},
		error : function(data) {
			handleError(data);
		}
	});

}

function deleteOrganization(id, callback) {
	deleteCall("ns/organization/" + id, callback);
}

function mergeOrganization(org, callback) {
	var record = $.extend({}, org);

	delete record.marker;
	delete record.links;
	delete record.latitude;
	delete record.longitude;
	delete record.id;

	post('ns/organization', record, 'json', callback);
}

function deleteRow(id) {
	$.confirm("Do you want to delete " + indexedPlaces[id].name + "?", {
		title : 'Confirm Delete',
		buttons : {
			"Yes" : function() {
				deleteOrganization(id, function() {
					map.removeMarker(indexedPlaces[id].marker);
					$("#placeTable").jqGrid('delRowData', id);
					delete indexedPlaces[id];
				});
				$(this).dialog("close");
			},
			"No" : function() {
				$(this).dialog("close");
			}
		}
	});
}

function editRow(id) {

	console.log("in editRow...");
	$("#placeTable")
			.jqGrid(
					'editRow',
					id,
					{
						url : 'clientArray',
						keys : true,
						aftersavefunc : function() {
							saveOrg(id);
						},
						afterrestorefunc: function() {
							
							lastsel = undefined;
						}
					});
}

function saveOrg(id) {
	lastsel = undefined;
	
	var record = $.extend({}, indexedPlaces[id]);
	
	// update back to objects
	var pos = indexedPlaces[id].marker.getPosition();
	record.geom = {
		type : "Point",
		coordinates : [ pos.lng(), pos.lat() ]
	};
	record.organizationType = orgTypesByType[indexedPlaces[id].organizationType];

	mergeOrganization(record);
	map.updatePlace(indexedPlaces[id]);
}

function addRow() {
	var center = map.map.getCenter();

	mergeOrganization({
		geom : {
			type : 'Point',
			coordinates : [ center.lng(), center.lat() ]
		},
		organizationType : organizationTypes[0]
	}, function(place) {
		var table = $("#placeTable").jqGrid('addRowData', place.uuid, place,
				"first");

		// keep index up to date, note jqgrid does an extend, so we need to get
		// the reference from our linked array.
		place = places[places.length - 1];
		indexedPlaces[place.uuid] = place;

		place.marker = map.drawPlace(place, createLink, handleSelectPlace,
				handleDrag, handleDragEnd, true);

		editRow(place.uuid);
	});

}

function createLink(from, to, open) {
	var f = indexedPlaces[from];
	var t = indexedPlaces[to];

	var type = indexedLinkTypes[0];

	var networkConnection = {
		connectionSpeed : type,
		network : networks[0],
		orgStartUUID : f.uuid,
		orgEndUUID : t.uuid
	};

	saveNetworkConnection(networkConnection, function(link) {
		links.push(link);
		var line = map.drawLink(link, f, t, indexedLinkTypes[0], true);
		// if (open) google.maps.event.trigger(line, 'click');

	});
}

function handleDrag(place) {
}

function handleDragEnd(place) {
	console.log("location update, merge it:", place);
	mergeOrganization(place);
}

function handleSelectPlace(id) {
	$("#placeTable").jqGrid('setSelection', id);
}

//@ sourceURL=netmapEdit.js
