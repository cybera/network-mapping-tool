
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
	showToast(getError(request), false, 'error');
}

function getError(request) {
	var message = "Error Occurred!";
	
	if (request.status) message += '  Error Code: [' + request.status + ']';
	if (request.statusText) message += '  Error Message: [' + request.statusText + ']';
	
	if (request.responseText) {
		var text = request.responseText;
		try {
			text = JSON.parse(request.responseText).message;
		} catch(e) {}
		if (text && text.length > 0) {
			message += '  Response Text: ' + text;
		}
	}

	return message;
}