$(document).ready(function() {
	console.log('Loading Edit Mode');

	$("#bottom").resizable({
		handles : "n"
	}).resize(function(event) {
		doresize();
		return false;
	});

	// toolbar
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

	$("#exportButton").click(function() {
		outputTable();
	});

	$("#linkTypeButton").click(function() {
		$("#linkTypes").html(JSON.stringify(indexedLinkTypes, null, 2));
		$("#linkTypeDialog").dialog("open");
	});

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

	// setup export dialog
	$("#placecsvdownload").button();
	$("#linkcsvdownload").button();
	$("#jsondownload").button();

	$("#outputtabs textarea").focus(function() {
		this.select();
		this.onmouseup = function() {
			this.onmouseup = null;
			return false;
		};
	});
	var tabs = $("#outputtabs").tabs();

	tabs.dialog({
		width : 'auto',
		autoOpen : false

	});

	// TODO: will work below into file open
	/*
	 * //used to parse and geocode the locations from a csv
	 * 
	 * function getCSV(url, callback) { console.log("retrieve: "+url); $.ajax({
	 * url: url, cache: false, dataType: 'text', processData: false, type:
	 * 'GET', success: function(response) { var parsed =
	 * $.csv.toObjects(response); if(callback) callback(parsed); }, error:
	 * function(request, type, errorThrown) { alert(msg_comm_err); } });
	 *  }
	 * 
	 * getCSV("institutions.csv", function(places) { var geocodePlacesComplete =
	 * geocodePlaces(places);
	 * 
	 * console.log("got promise:",geocodePlacesComplete);
	 * 
	 * $.when(geocodePlacesComplete).then(function(results) {
	 * console.log("geocoding complete..."); console.log(results);
	 * console.log(JSON.stringify(results));
	 * 
	 * loadPlaces(results); });
	 * 
	 * });
	 */

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

		if (key == 'organizationType') {
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
	var lastsel;

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
		// pager: '#pagernav',
		onSelectRow : function(id, status, event) {
			// check if edit bailed
			if (id && id !== lastsel) {
				$("#placeTable").jqGrid('restoreRow', lastsel);
			}

			// show corresponding infowindow on map
			if (event) {
				// only call if user actually click (otherwise recursive loop)
				if (indexedPlaces[id].marker) {
					map.zoomTo(indexedPlaces[id].marker);
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

	var table = $("#placeTable").jqGrid(tableOptions).navGrid("#pagernav", {
		edit : false,
		add : false,
		del : false
	});

	// set data reference directly on table so that we are linked for updates
	table[0].p.data = places;
	table.trigger('reloadGrid');

	$.contextMenu({
		selector : ".ui-jqgrid tr",
		build : function($trigger, e) {
			console.log(e);

			console.log('^^^^^^^^^^^^^^^^^^^^^^^^^ target:', $(e.target));

			// var id = $(e.target).parent('th').attr('id');
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
				deleteOrganization(id);

				$(this).dialog("close");
				map.removeMarker(indexedPlaces[id].marker);
				$("#placeTable").jqGrid('delRowData', id);
				delete indexedPlaces[id];
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
							// update back to objects
							var pos = indexedPlaces[id].marker.getPosition();
							indexedPlaces[id].geom = {
								type : "Point",
								coordinates : [ pos.lng(), pos.lat() ]
							};
							indexedPlaces[id].organizationType = orgTypesByType[indexedPlaces[id].organizationType];

							mergeOrganization(indexedPlaces[id]);
							map.updatePlace(indexedPlaces[id]);
						}
					});
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
	// $("#placeTable").jqGrid('setCell', place.uuid, 'latitude',
	// place.latitude);
	// $("#placeTable").jqGrid('setCell', place.uuid, 'longitude',
	// place.longitude);
}

function handleDragEnd(place) {
	console.log("location update, merge it:", place);
	mergeOrganization(place);
}

function handleSelectPlace(id) {
	$("#placeTable").jqGrid('setSelection', id);
}
