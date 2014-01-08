function Map() {
	this.lines = [];
	this.markers = [];
	this.mapStyles = [
	       		  {
	       		    "featureType": "landscape",
	       		    "stylers": [
	       		      { "visibility": "on" },
	       		      { "color": "#d9d9d9" }
	       		    ]
	       		  },{
	       		    "featureType": "poi",
	       		    "stylers": [
	       		      { "visibility": "off" }
	       		    ]
	       		  },{
	       		    "featureType": "road",
	       		    "stylers": [
	       		      { "visibility": "off" }
	       		    ]
	       		  },{
	       		    "featureType": "transit",
	       		    "stylers": [
	       		      { "visibility": "off" }
	       		    ]
	       		  },{
	       		    "featureType": "administrative.locality",
	       		    "stylers": [
	       		      { "visibility": "off" }
	       		    ]
	       		  },{
	       		    "featureType": "administrative.neighborhood",
	       		    "stylers": [
	       		      { "visibility": "off" }
	       		    ]
	       		  },{
	       		    "featureType": "administrative.land_parcel",
	       		    "stylers": [
	       		      { "visibility": "off" }
	       		    ]
	       		  },{
	       		    "featureType": "administrative.country",
	       		    "elementType": "labels.text.fill",
	       		    "stylers": [
	       		      { "color": "#000000" },
	       		      { "visibility": "on" }
	       		    ]
	       		  },{
	       		    "featureType": "administrative.province",
	       		    "stylers": [
	       		      { "visibility": "on" }
	       		    ]
	       		  },{
	       		    "featureType": "water",
	       		    "elementType": "geometry.fill",
	       		    "stylers": [
	       		      { "color": "#ffffff" },
	       		      { "visibility": "on" }
	       		    ]
	       		  },{
	       		    "elementType": "labels.text.fill",
	       		    "stylers": [
	       		      { "color": "#808080" }
	       		    ]
	       		  },{
	       		  }
	       		];
	
		  var ll = new google.maps.LatLng(51.05,-114.05);
          var mapOptions = {
        		 center: ll, 
        		 zoom: 5,
        		 mapTypeId: google.maps.MapTypeId.ROADMAP,
        		 styles: this.mapStyles
         };	
         console.log("create map");
         
         this.circle = {
    		    path: google.maps.SymbolPath.CIRCLE,
    		    fillOpacity: 0.6,
    		    fillColor: "white",//"#88C949",
    		    strokeOpacity: 1.0,
    		    strokeColor: "black",
    		    strokeWeight: 0.6,
    		    scale: 4.0
    		};

         
         this.linkLine = new google.maps.Polyline({
         	path: [ll, ll],
             strokeColor: "#c0c0c0",
             strokeOpacity: 1.0,
             strokeWeight: 4
         });
         
         
         this.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
         this.infoWindow = new google.maps.InfoWindow();
         
         
         this.oms = new OverlappingMarkerSpiderfier(this.map, {keepSpiderfied: true});
         var me = this;
         
         
         //The dragging of spiderified markers looks to be broken, so disable when in that mode.
         
         this.oms.addListener('unspiderfy', function(markers) {
        	 
        	 $.each(markers, function(idx, itm) {
        		 itm.setOptions({
        			 draggable: editMode
        		 });

        	 });
          });

         this.oms.addListener('spiderfy', function(markers) {
        	 me.infoWindow.close();
        	 
        	 $.each(markers, function(idx, itm) {
        		 itm.setOptions({
        			 draggable: false
        		 });

        	 });
          });

     	this.oms.addListener('click', function(marker) {
//     		google.maps.event.addListener(marker, 'click', function() {
     			var base = $("<div>");
     			$("<div>").html("<strong>"+indexedPlaces[marker.placename].name+"</strong>").appendTo(base);
     			
     			if(marker.selectCallback)
     				marker.selectCallback(marker.placename);
     			
     			//$("<div>").html(marker.place.Address).appendTo(base);
     			if(!me.linkStart) {
     				if(editMode) {
	     				var button = $("<button>").html("Draw Link").click(function() {
	     					me.linkStart = marker.placename;
	     					me.infoWindow.close();
	     					
	     					//map.getProjection().fromPointToLatLng(new google.maps.Point(x, y))
	     					console.log("set path...");
	     					
	     					
	     					me.linkLine.setPath([marker.getPosition(), me.lastLatLng]);
	     					me.linkLine.setMap(me.map);
	     					
	     				}).button({
	     				      icons: {
	     				         primary: "draw-icon"
	     				       }
	     				}).appendTo(base);
     				}
     				else {
     					var place = indexedPlaces[marker.placename];
     					
     					$.each(orgDisplayItems, function(idx, itm) {
     						if(place[itm]) {
         						$("<div>").text(place[itm]).appendTo(base);
     						}
     					});
     					
     				}
     				
         			console.log(base);
         			me.infoWindow.setContent(base[0]);
         			me.infoWindow.open(me.map, marker);
     			}
     			else {
     					console.log("link from ",me.linkStart," to ",marker.placename);
     					me.infoWindow.close();
     					me.oms.unspiderfy();
     					
     					//don't link to self
     					if(me.linkStart != marker.placename) {
	     					if(marker.linkCallback) {
	     						console.log("initiate link callback, wiht true!");
	     						marker.linkCallback(me.linkStart, marker.placename, true);
	     					}
     					}
     					me.linkStart = undefined;
     					me.linkLine.setMap(undefined);

     					
     				//}).button().text("Link End").appendTo(base);
     			}
     			
     		});
     	
     	google.maps.event.addListener(this.map, 'mousemove', function(e) {
     		me.lastLatLng = e.latLng;
     		
     		if(me.linkStart) {
//     			me.linkLine.setMap(me.map);
     			me.linkLine.getPath().setAt(1, e.latLng);
     		}
     	});     	

     	google.maps.event.addListener(this.map, 'mouseover', function(e) {
     		console.log("mouseover...");
     		me.lastLatLng = e.latLng;
     	});
     	
     	google.maps.event.addListener(this.map, 'rightclick', function(e) {
     		console.log(e);
     		console.log(this);
     		var marker = new google.maps.Marker({
     			position: e.latLng,
     			map: me.map,
     			icon: me.circle,
     			draggable: editMode
     		});
     		
     	});
         
}

Map.prototype.notifyEscape = function(marker) {
	if(this.linkStart) {
		this.linkStart = undefined;
		this.linkLine.setMap(undefined);
	}
}


Map.prototype.zoomTo = function(marker) {
	var latlngbounds = new google.maps.LatLngBounds();
	latlngbounds.extend(marker.getPosition());
	this.map.panTo(latlngbounds.getCenter());
	 google.maps.event.trigger(marker, 'click');
//	this.map.fitBounds(latlngbounds); 
}

Map.prototype.removeMarker = function(marker) {
	if(marker) {
		this.oms.removeMarker(marker);
		marker.setMap(null);
	}
}

Map.prototype.getMarker = function(position) {
	var ll = new google.maps.LatLng(position.lat(), position.lng());

	var image = new google.maps.MarkerImage('http://maps.google.com/mapfiles/kml/pal4/icon57.png',
		      new google.maps.Size(32, 32),
		      new google.maps.Point(0,0),
		      new google.maps.Point(16, 16));
	
	var marker = new google.maps.Marker({
		position: ll,
		map: this.map,
		icon: this.circle,
		zIndex: 100,
		draggable: editMode,
		animation: google.maps.Animation.DROP
	});

	return marker;
}

Map.prototype.clearOverlays = function() {
	this.clearLines();
	this.clearMarkers();
}

Map.prototype.clearLines = function() {
	$.each(this.lines, function(idx, itm) {
		itm.setMap(null);
	});
}

Map.prototype.clearMarkers = function() {
	$.each(this.markers, function(idx, itm) {
		itm.setMap(null);
	});
};

Map.prototype.markerVisibility = function(visible, orgType) {
	var me = this;
	
	$.each(this.markers, function(index, marker) {
		if (marker.get("orgType") == orgType) {
			if (visible) marker.setMap(me.map);
			else marker.setMap(null);
		}
	});
};

Map.prototype.lineVisibility = function(visible, network) {
	var me = this;
	
	$.each(this.lines, function(index, line) {
		if (line.get("network") == network) {
			if (visible) line.setMap(me.map);
			else line.setMap(null);
		}
	});
};


Map.prototype.drawPlace = function(place, linkCallback, selectCallback, dragCallback, dragEndCallback, bounce) {
	var ll = new google.maps.LatLng(place.geom.coordinates[1], place.geom.coordinates[0]);

	var image = new google.maps.MarkerImage('http://maps.google.com/mapfiles/kml/pal4/icon57.png',
		      new google.maps.Size(32, 32),
		      new google.maps.Point(0,0),
		      new google.maps.Point(16, 16));
	
	
	var animation = null;
	if(bounce) 
		animation = google.maps.Animation.BOUNCE;
		
	var colour = "white";
	if(place.organizationType)
		colour = place.organizationType.colour;
	
	var icon = $.extend({}, this.circle, {fillColor: colour});
	
	var marker = new google.maps.Marker({
		position: ll,
		map: this.map,
		icon: icon,
		zIndex: 100,
		draggable: editMode,
		animation: animation
		
	});
	
	if (place.organizationType)
		marker.set("orgType", place.organizationType.uuid);
	
	this.markers.push(marker);
	
	console.log("MARDER: ",marker);
	
	marker.placename = place.uuid;
	marker.linkCallback = linkCallback;
	marker.selectCallback = selectCallback;
	marker.dragCallback = dragCallback;
	marker.dragEndCallback = dragEndCallback;
	
	var me = this;
	this.oms.addMarker(marker); 

    google.maps.event.addListener(marker, 'mouseover', function (e) {
    	console.log("mouserover marker...",me.linkStart);
    	if(me.linkStart) {
    		me.infoWindow.setContent(indexedPlaces[marker.placename].name);
			me.infoWindow.open(me.map, marker);
    	}
    });

    google.maps.event.addListener(marker, 'drag', function (e) {
    	//me.oms.unspiderfy();
    	       
    	console.log("trying to drag:",marker);
    	var place = indexedPlaces[marker.placename];
    	console.log(indexedPlaces[marker.placename]);
   	 	console.log(this.getPosition());
   	 	console.log(marker);
   	 	
   	 	var newpos = this.getPosition();
   	 	
   	 	place.geom.coordinates = [newpos.lng(), newpos.lat()];
   	 	
   	 	if(marker.dragCallback)
   	 		marker.dragCallback(place);
   	 	
   	 	if(place.links) {
   	 		$.each(place.links, function(idx, itm) {
   	 			itm.line.getPath().setAt(itm.coordpos, newpos);
   	 		});
   	 	}
   	 	
    });

    google.maps.event.addListener(marker, 'dragend', function (e) {
    	console.log("dragend...",marker);
    	if(marker.dragEndCallback) {
        	var place = indexedPlaces[marker.placename];
    		marker.dragEndCallback(place);
    	}
    });

    
    return marker;
}

Map.prototype.setStyle = function(style) {
	this.style = style;
	this.map.setOptions({styles: style});
}


Map.prototype.drawLink = function(link, from, to, type) {
	var ll1 = new google.maps.LatLng(from.geom.coordinates[1], from.geom.coordinates[0]);
	var ll2 = new google.maps.LatLng(to.geom.coordinates[1], to.geom.coordinates[0]);
	
	var options = {
		path: [ll1, ll2],
		map: this.map,
		strokeColor: link.network.colour,
		strokeWeight: link.connectionSpeed.lineThickness
	};
    
    var pl = new google.maps.Polyline(options);
    pl.set('network', link.network.uuid);
    this.lines.push(pl);
    
    var me = this;
 	google.maps.event.addListener(pl, 'click', function(e) {
 		console.log('Click On Link');
			var base = $("<div>", {style: 'display: inline-block; padding: 5px; padding-bottom: 20px;'});
 			$("<div>").html("<strong>"+from.name+" -> "+to.name+"</strong>").appendTo(base);
 			$("<hr>").appendTo(base);
 			
 			if(editMode) {
 				
 				var speedDiv = $("<div>", {style: 'display: inline-block; padding: 5px;'}).appendTo(base);
 				$("<label>", {text: 'Speed: '}).appendTo(speedDiv);
	 			var select = $("<select>", {id: 'speedSelect'}).appendTo(speedDiv);
	 			$.each(indexedLinkTypes, function(idx, itm) {
	 				var option = $("<option>", {value:itm.speed}).html(itm.speed);
	 				if(link.connectionSpeed.speed == itm.connectionSpeed)
	 					option.attr("selected", "selected");
	 				option.appendTo(select);
	  			});

	 			select.change(function() {
	 				var newSpeed = indexedLinkTypes[$(this).prop('selectedIndex')];
	 				link.connectionSpeed = newSpeed;
	 				pl.setOptions({strokeWeight: newSpeed.lineThickness});
	 				saveNetworkConnection(link);
	 			});

 				var networkDiv = $("<div>", {style: 'display: inline-block; padding: 5px;'}).appendTo(base);
 				$("<label>", {text: 'Network: '}).appendTo(networkDiv);
	 			var select = $("<select>", {id: 'networkSelect'}).appendTo(networkDiv);
	 			$.each(networks, function(idx, itm) {
	 				var option = $("<option>", {value:itm.uuid}).html(itm.name);
	 				if(link.network.name == itm.name)
	 					option.attr("selected", "selected");
	 				option.appendTo(select);
	  			});

	 			select.change(function() {
	 				var newNetwork = networks[$(this).prop('selectedIndex')];
	 				link.network = newNetwork;
	 				pl.setOptions({strokeColor: newNetwork.colour});
	 				saveNetworkConnection(link);
	 			});

	 			
 			
	 			$("<button>", {style: 'margin: 5px; padding: 0px;'}).html("Delete").click(function() {
	 				$.confirm("Do you want to delete this link?", {
	 					title: 'Confirm Delete',
	 					buttons: {
	 						"Yes": function() {
	 							$(this).dialog("close");
	 							deleteNetworkConnection(link, function() {
		 			 				links.splice(links.indexOf(link), 1);
		 			 				console.log(links);
		 			 				
		 			 				pl.setMap(null);
		 			 				me.infoWindow.close();
	 							});
	 						},
	 						"No": function() {
	 							$(this).dialog("close");
	 						}
	 					}
	 				});
	 			}).button().appendTo(base).wrap("<div>");
 			}
 			else {
 				var div = $("<div>", {style: 'display: inline-block; padding-top: 5px;'}).appendTo(base);
 				$("<div>").html("<B>Speed:</B> " + link.connectionSpeed.speed).appendTo(div);
 				$("<div>").html("<B>Network:</B> " + link.network.name).appendTo(div);
 			}
 			
 			console.log(base);
 			console.log(me.infoWindow);
 			me.infoWindow.setContent(base[0]);
 			
 			console.log("e:",e);
 			//either position where user clicked, or midpoint of line
 			if(e)
 				me.infoWindow.setPosition(e.latLng);
 			else {
 				var projection = me.map.getProjection();
 				var startLatLng = new google.maps.LatLng(from.latitude, from.longitude); 
 				var endLatLng = new google.maps.LatLng(to.latitude, to.longitude);
 				var startPoint = projection.fromLatLngToPoint(startLatLng); 
 				var endPoint = projection.fromLatLngToPoint(endLatLng); 
 				// Average 
 				var midPoint = new google.maps.Point( 
 				    (startPoint.x + endPoint.x) / 2, 
 				    (startPoint.y + endPoint.y) / 2); 
 				// Unproject 
 				var midLatLng = projection.fromPointToLatLng(midPoint); 
				me.infoWindow.setPosition(midLatLng);
 			}
 			me.infoWindow.open(me.map);
 	});

    
 	
 	
	if(from.links == undefined)
		from.links = [];
	if(to.links == undefined)
		to.links = [];
	
	from.links.push({coordpos: 0, line: pl});
	to.links.push({coordpos: 1, line: pl});

    
    return pl;
};

/*
Map.prototype.updateSpeeds = function(speeds) {
	$('#speedSelect').find('option').remove();
	$.each(speeds, function(idx, itm) {
			var option = $("<option>", {value:itm.speed}).html(itm.speed);
			if(link.connectionSpeed.speed == itm.connectionSpeed)
				option.attr("selected", "selected");
			option.appendTo(select);
	});
};

Map.prototype.updateNetworks = function(networks) {
	$('#networkSelect').find('option').remove();
	$.each(networks, function(idx, itm) {
			var option = $("<option>", {value:itm.name}).html(itm.name);
			if(link.connectionSpeed.speed == itm.connectionSpeed)
				option.attr("selected", "selected");
			option.appendTo(select);
	});
};
*/


/*
var GmapsCubicBezier = function(lat1, long1, lat2, long2, lat3, long3, lat4, long4, resolution, map, click){

    var points = [];

    for(it = 0; it <= 1; it += resolution) {
        points.push(this.getBezier({x:lat1, y:long1},{x:lat2, y:long2},{x:lat3, y:long3},{x:lat4, y:long4}, it));
    }

    for(var i = 0; i < points.length - 1; i++) {
            var Line = new google.maps.Polyline({
                path: [new google.maps.LatLng(points[i].x, points[i].y), new google.maps.LatLng(points[i+1].x, points[i+1].y)],
                geodesic: true,
                strokeColor: "#30B9ED",
                strokeOpacity: 1.0,
                strokeWeight: 4
            }); 

            Line.setMap(map);   
    }
};


GmapsCubicBezier.prototype = {

    B1 : function (t) { return t*t*t; },
    B2 : function (t) { return 3*t*t*(1-t); },
    B3 : function (t) { return 3*t*(1-t)*(1-t); },
    B4 : function (t) { return (1-t)*(1-t)*(1-t); },
    getBezier : function (C1,C2,C3,C4, percent) {
        var pos = {};
        pos.x = C1.x*this.B1(percent) + C2.x*this.B2(percent) + C3.x*this.B3(percent) + C4.x*this.B4(percent);
        pos.y = C1.y*this.B1(percent) + C2.y*this.B2(percent) + C3.y*this.B3(percent) + C4.y*this.B4(percent);
        return pos;
    }
};
*/