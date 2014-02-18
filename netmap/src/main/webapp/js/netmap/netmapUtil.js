
function saveNetworkConnection(networkConnection, callback) {
	console.log('Save Network Connection: ', networkConnection);
	post('ns/networkConnection', networkConnection, 'json', callback);
}

function deleteNetworkConnection(networkConnection, callback) {
	console.log('Delete Network Connection: ', networkConnection);
	deleteCall('ns/networkConnection/' + networkConnection.uuid, callback);
}

function deleteCall(url, callback) {
	//fire a DELETE to the server
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
	//fire a CREATE/UPDATE to the server
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
	//wrapper to show a toast message
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
	
	//Display the error received from the server
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
/*

function querystring(key) {
	// get the paramter from the querystring
   var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
   var r=[], m;
   while ((m=re.exec(document.location.search)) != null) r.push(m[1]);
   return r;
}
*/

$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

