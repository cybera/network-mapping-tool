
function saveNetworkConnection(networkConnection, callback) {
	
	console.log('Save Network Connection: ', networkConnection);
	post('ns/networkConnection', networkConnection, 'json', callback);
	
}

function deleteNetworkConnection(networkConnection, callback) {
	
	console.log('Delete Network Connection: ', networkConnection);
	deleteCall('ns/networkConnection/' + networkConnection.uuid, callback);
	
}

function deleteCall(url, callback) {
	$.ajax({
        url: url,
        cache: false,
		headers: {
		    'Accept' : 'application/json',
		    'Content-Type' : 'application/json'
			},
        processData: false,
        type: 'DELETE',
        success: function(response) {
        	console.log(response);
        	if(callback)
        		callback(response);
        },
        error: function(request, type, errorThrown) {
        	console.log("in error...");
        	handleError(request);
        }
    });
	
}

function post(url, data, dataType, callback) {
	$.ajax({
        url: url,
        dataType: dataType, 
        data: JSON.stringify(data),
        cache: false,
		headers: {
		    'Accept' : 'application/json',
		    'Content-Type' : 'application/json'
			},
        processData: false,
        type: 'POST',
        success: function(response) {
        	console.log(response);
        	if(callback)
        		callback(response);
        },
        error: function(request, type, errorThrown) {
        	handleError(request);
        }
    });
}

function showToast(msg, sticky, type) {
	if(type == undefined)
		type='notice';
	
    $().toastmessage('showToast', {
        text     : msg,
        position: 'middle-center',
        sticky   : sticky,
        type     : type
    });
}

function handleError(request) {
	showToast(getError(request), true, 'error');
}

function getError(request) {
	var message = "";
	
	if (request.responseText) {
		var text = request.responseText;
		try {
			text = JSON.parse(request.responseText).message;
		} catch(e) {}
		if (text && text.length > 0) {
			message += text;
		}
	}

	if (request.status) message += '<br/><br/>  Error Code: [' + request.status + ']';
	if (request.statusText) message += '<br/>  Error Message: [' + request.statusText + ']';
	
	
	return message;
}

function geocodePlaces(places) {
	if(places[0].latitude == undefined) {
		var geocoder = new google.maps.Geocoder();
		var completed = 0;
		
		var deferred = $.Deferred();
		$.each(places, function(idx, place) {
			var locref = place.Address+" "+place.City+" "+place.Province+"  "+place.Pcode;
			setTimeout(function() {
			geocoder.geocode({address: locref}, function(results, status) {
				completed++;
				console.log('geocode: ',locref+" -> ",status);
				if(status == google.maps.GeocoderStatus.OK) {
					console.log("results: ",results);
					console.log("latitude: ",results[0].geometry.location.lat());
					place.coords = {};
					place.coords.latitude = results[0].geometry.location.lat();
					place.coords.longitude = results[0].geometry.location.lng();
				}
				/*
				else {
					console.log("error geocoding: "+locref);
				}
				*/
				console.log(completed+" -> "+places.length);
				if(completed == places.length)
					deferred.resolve(places);
			});
			}, idx*2000);
		});
		
		return deferred.promise();
		
	}
	
	return "";
	
}

function createCSV(data) {
	var str ='';
	//quick & dirty create all values as quoted
	$.each(data, function(idx, itm) {
		var first = true;
		$.each(itm, function(key, value) {
			(first)? first=false : str+=",";
			
			str += '"'+value+'"';
		})
		str+="\n";
	});

	return str;
}

function outputTable() {
	var model = $("#placeTable").jqGrid('getGridParam', 'colModel');
	var data = $("#placeTable")[0].p.data.slice(0);

	//remove internals 
	$.each(data, function(idx, itm) {
		delete itm.links;
		delete itm.marker;
	});
	
	var placecsv = createCSV(data);
	var linkcsv = createCSV(links);
	
 	var full = {
 			placeList: data,
 			linkList: links,
 			linkTypes: indexedLinkTypes,
 			mapStyle: map.style
 	};
 	console.log("full:",full);
 	
 	var jsonoutput = JSON.stringify(full, null, 2);
 	
 	$("#placeCSV").val(placecsv);
 	$("#linkCSV").val(linkcsv);
 	$("#jsonoutput").val(jsonoutput);
 	
 	$("#placecsvdownload").attr("href", "data:text/csv;charset=utf-8,"+escape(placecsv));
 	$("#linkcsvdownload").attr("href", "data:text/csv;charset=utf-8,"+escape(linkcsv));

 	$("#jsondownload").attr("href", "data:text/csv;charset=utf-8,"+escape(jsonoutput));
 	
	$("#outputtabs").dialog("open");
}



