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
	    "URL": {
				editable: true, 
				name: 'url', 
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
		onListRefresh: function(list) {
			refreshMapStyles();
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
function showOrgDetails() {

	$.getJSON('ns/organization/displayDetails', function(result) {

		var div = $("<div>");

		var ul = $("<ul>", {id: 'displayDetails'}).appendTo(div);
		
		$.each(result, function(idx, itm) {
			var li = $("<li>", {'data-value': itm.uuid, 'class': 'ui-state-default'}).html(itm.name)
			.appendTo(ul)
			.append($("<span>", {'class': 'ui-icon ui-icon-grip-dotted-horizontal', style: 'float: right; display: inline-block'}));
			
			if(!itm.visible)
				li.addClass("ui-state-disabled");
			
			li.click(function() {
				   if($(this).hasClass('ui-state-disabled'))
					   $(this).removeClass("ui-state-disabled");
				   else
					   $(this).addClass("ui-state-disabled");
				});
			
		});
		
		ul.sortable({
	      placeholder: "ui-state-highlight"
	    });
		
		
		div.dialog({
			title: "User Org Details",
			width: 'auto',
			height: 'auto',
			buttons: { 'Okay': function() {
				var newDetails = $.map($("#displayDetails li"), function(itm, idx) { 
					var $itm = $(itm);
					var obj = { 
						visible: !$itm.hasClass("ui-state-disabled"),
						uuid: $itm.attr("data-value"),
						name: $itm.text(),
						sortOrder: idx
					};
					return obj;
				});
				
				
				post('ns/organization/displayDetails', newDetails);
				$(this).dialog("close");
			},
			'Cancel': function() {
				$(this).dialog("close");
			}
			},
			close: function(event, ui) {
				$(this).dialog('destroy').remove();
			}
		});
	});
	
	
}
