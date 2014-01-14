$(document).ready(function() {

	$.contextMenu({
		selector: "#settingsButton",
		trigger: 'left',
		build: function($trigger, e) {
			return {
				callback: function(key, options) {
					if(key == 'orgTypes') {
						$("#orgTypeDialog").dialog("open");
					}
					else if(key =='orgDetails') {
						showOrgDetails();
					}
					else if (key == 'networks') {
						$('#networkDialog').dialog("open");
					}
					else if (key == 'speeds') {
						$('#speedDialog').dialog("open");
					}
					else if (key == 'mapStyles') {
						$('#mapStylesDialog').dialog("open");
					}
				},
				
				items: {'orgTypes': {name:'Organization Types'},
						'orgDetails': {name:'User Organization Details'},
						'networks': {name:'Networks'},
						'speeds': {name:'Connection Speeds'},
						'mapStyles': {name:'Map Styles'}
				}
			};
		}
	});
	
	 
	$("#orgTypeDialog").editPopup({
		title: 'Manage Organization Types',
		urlList: 'ns/organization/types',
		url: 'ns/organization/type',
		grid: {
		    "UUID": {
		     	hidden: true,
		     	name: 'uuid',
		     	key: true
		     },
		     "Organization Type": {
				editable: true, 
				name: 'type', 
				sortable: true
			},
			"Colour": {
				editable: true, 
				name: 'colour', 
				sortable: true,
				formatter: colorFormatter,
				// unformat: colorUnformatter,
				edittype: 'custom',
				editoptions: {
					custom_element: function(value, options) {
						console.log(value, options);
						var $span = $(value);
						
						var input = $("<input>", {type: 'input', value: $span.css("background-color")}).colorpicker({
							colorFormat: "RGB"
						});
						return input[0];
						
					},
					custom_value: function(elem) {
					 	var val = $(elem).val();
					 	console.log("val: ", val);
					 	return val;
					}
				}
			}
		},
		onListRefresh: function(list) {
			organizationTypes = list;
			
			orgTypesByType = {};
			$.each(organizationTypes, function(idx, itm) {
				orgTypesByType[itm.type] = itm;
			});
		},
		displayAttribute: 'type',
		defaultObject: {type: '', colour: '#FFFFFF'}
	});
	
	$("#networkDialog").editPopup({
	title: 'Manage Networks',
	urlList: 'ns/networkConnection/networks',
	url: 'ns/networkConnection/network',
	grid: {
	    "UUID": {
	     	hidden: true,
	     	name: 'uuid',
	     	key: true
	     },
	     "Network Name": {
			editable: true, 
			name: 'name', 
			sortable: true
		},
		"Colour": {
			editable: true, 
			name: 'colour', 
			sortable: true,
			formatter: colorFormatter,
			// unformat: colorUnformatter,
			edittype: 'custom',
			editoptions: {
				custom_element: function(value, options) {
					console.log(value, options);
					var $span = $(value);
					
					var input = $("<input>", {type: 'input', value: $span.css("background-color")}).colorpicker({
						colorFormat: "RGB"
					});
					return input[0];
					
				},
				custom_value: function(elem) {
				 	var val = $(elem).val();
				 	console.log("val: ", val);
				 	return val;
				}
			}
		}
	},
	onRefreshList: function(list) {
		networks = list;
	},
	displayAttribute: 'name',
	defaultObject: {name: '', colour: '#FFFFFF'}
});
	

$("#speedDialog").editPopup({
	title: 'Manage Connection Speeds',
	urlList: 'ns/networkConnection/speeds',
	url: 'ns/networkConnection/speed',
	grid: {'UUID': {
     	hidden: true,
     	name: 'uuid',
     	key: true
     },
	 'Connection Speed': {
		editable: true, 
		name: 'speed', 
		sortable: true
	},
	'Line Thickness': {
		editable: true, 
		name: 'lineThickness', 
		sortable: true,
	}	
	},
	displayAttribute: 'speed',
	defaultObject: {speed: '', lineThickness: 1.0}
});
	
	$("#mapStylesDialog").editPopup({
		title: 'Manage Map Styles',
		urlList: 'ns/mapStyles',
		url: 'ns/mapStyles',
		grid: {
			"UUID": {
		     	hidden: true,
		     	name: 'uuid',
		     	key: true
		     },
			 
		     "Name": {
			 editable: true, 
				name: 'name', 
				sortable: true
			},
			
			"Style JSON": {
				editable: true, 
				name: 'style', 
				sortable: true,
			}
		},
		displayAttribute: 'name',
		defaultObject: {name: '', style: '[]'},
	 	appendLayout: '<div>Build custom map styles JSON at:<br/><small><a target="_new" href="http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html">http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html</a></small></div>'

	});
	
	
});

function colorFormatter(cellvalue, options, rowObject) {
	return "<span style='display: inline-block; width:20px; height:20px; background-color: "
			+ cellvalue + "'/>";
}

/*
function colorUnformatter(cellvalue, options, rowObject) {
	console.log('UNFORMATTING COLOUR: ' + JSON.stringify(cellvalue, null, 2));
	console.log('Options: ' + JSON.stringify(options, null, 2));
	console.log('Row: ' + JSON.stringy(rowObject, null, 2));
	return cellvalue;
}
*/
