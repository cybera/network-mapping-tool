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
	if(this.currentEditLine) {
		this.clearEditLine();
	}
}

Map.prototype.clearEditLine = function() {
	if(this.midmarkers) {
		$.each(this.midmarkers, function(idx, itm) {
			itm.setMap(null);
		});
		$.each(this.waymarkers, function(idx, itm) {
			itm.setMap(null);
		});
		this.currentEditLine = undefined;
	}
};

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


Map.prototype.updatePlace = function(place) {
	var me = this;
	$.each(this.markers, function(index, marker) {
		if (marker.placename == place.uuid) {
			/*
			var colour = place.organizationType.colour;
			var icon = $.extend({}, me.circle, {fillColor: colour});
			marker.setIcon(icon);
			*/
			marker.setMap(null);
			me.markers.pop(marker);
			var newMarker = me.drawPlace(place, marker.linkCallback, marker.selectCallback, marker.dragCallback, marker.dragEndCallback);
			map.zoomTo(newMarker);
		}
	});
};

Map.prototype.drawPlace = function(place, linkCallback, selectCallback, dragCallback, dragEndCallback, bounce) {
	var ll = new google.maps.LatLng(place.geom.coordinates[1], place.geom.coordinates[0]);

	/*
	var image = new google.maps.MarkerImage('http://maps.google.com/mapfiles/kml/pal4/icon57.png',
		      new google.maps.Size(32, 32),
		      new google.maps.Point(0,0),
		      new google.maps.Point(16, 16));
	*/
	
	
	var animation = null;
	if(bounce) 
		animation = google.maps.Animation.BOUNCE;
		
	var colour = "FFFFFF";
	if(place.organizationType)
		colour = place.organizationType.colour;
	
	var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + colour.replace('#', ''),
	        new google.maps.Size(21, 34),
	        new google.maps.Point(0,0),
	        new google.maps.Point(10, 34));
	// var icon = $.extend({}, this.circle, {fillColor: colour});
	
	var marker = new google.maps.Marker({
		position: ll,
		map: this.map,
		icon: pinImage,
		zIndex: 100,
		draggable: editMode,
		animation: animation
		
	});
	
	if (place.organizationType)
		marker.set("orgType", place.organizationType.uuid);
	
	
	marker.placename = place.uuid;
	marker.linkCallback = linkCallback;
	marker.selectCallback = selectCallback;
	marker.dragCallback = dragCallback;
	marker.dragEndCallback = dragEndCallback;

	this.markers.push(marker);
	console.log("MARKER: ",marker);

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
   	 			var coordpos = itm.coordpos;
   	 			var midmarkerpos = 0;
   	 			
   	 			if(coordpos > 0) {
   	 				coordpos = itm.line.getPath().getLength()-1;
   	 				midmarkerpos = coordpos-1;
   	 			}	

   	 			console.log("coordpos:", coordpos);
   	 			itm.line.getPath().setAt(coordpos, newpos);

   	 			if(me.currentEditLine) {
	   	 			console.log("objs: ",itm.line, "->", me.currentEditLine.line);
	   	 			if(itm.line == me.currentEditLine.line)
		 				me.midmarkers[midmarkerpos].setMap(null);
   	 			}
   	 		});
   	 	}
   	 	
    });

    google.maps.event.addListener(marker, 'dragend', function (e) {
    	console.log("dragend...",marker);
    	
    	var place = indexedPlaces[marker.placename];
   	 	if(place.links) {
   	 		$.each(place.links, function(idx, itm) {
   	 			if(me.currentEditLine) {
		   	 		if(itm.line == me.currentEditLine.line) {
			 			me.createPullMarkers(me.currentEditLine.line, me.currentEditLine.connection);
		   	 		}
   	 			}
	   	 		me.storeLink(itm);
   	 		});
   	 	}   	 		
   	 		
    	if(marker.dragEndCallback) {
        	var place = indexedPlaces[marker.placename];
    		marker.dragEndCallback(place);
    	}
    });

    
    return marker;
};

Map.prototype.storeLink = function(link) {
	var obj = $.extend({}, link.connection);
	
	obj.geom = {type: "LineString",
			    coordinates: []};
	
	link.line.getPath().forEach(function(point, idx) {
		obj.geom.coordinates.push([point.lng(), point.lat()]);
	});
	
	post('ns/networkConnection', obj);
};

Map.prototype.setStyle = function(style) {
	this.style = style;
	this.map.setOptions({styles: style});
}

Map.prototype.getLatLng = function(coordinates) {
	return new google.maps.LatLng(coordinates[1], coordinates[0]);
};

Map.prototype.drawLink = function(link, from, to, type, click) {
	
	if(!link.geom) {
		console.log("NO GEOMETRY....");
		link.geom = { type: 'LineString',
					  coordinates: [
					                [from.geom.coordinates[0], from.geom.coordinates[1]],
					                [to.geom.coordinates[0], to.geom.coordinates[1]]
			         ]
		};
		console.log(link.geom);	
		
		post('ns/networkConnection', link);		
	}
	
	var coords = [];
	var me = this;
	$.each(link.geom.coordinates, function(idx, itm) {
		coords.push(me.getLatLng(itm));
	});

	console.log("coords is: ",coords);
	
	var options = {
		path: coords,
		map: this.map,
		strokeColor: link.network.colour,
		strokeWeight: link.connectionSpeed.lineThickness
	};
    
    var pl = new google.maps.Polyline(options);
    pl.set('network', link.network.uuid);
    this.lines.push(pl);
    
    var me = this;
    
 	google.maps.event.addListener(pl, 'rightclick', function(e) {
 		var showpull = true;
 		
 		if(me.currentEditLine) {
 			if(pl == me.currentEditLine.line) {
 				showpull = false;
 			}
 			me.clearEditLine();
 		}
 		
 		if(showpull) {
 			me.createPullMarkers(pl, link);
 		}
 	});

    
 	google.maps.event.addListener(pl, 'click', function(e) {

 		console.log('Click On Link');
			var base = $("<div>", {style: 'display: inline-block; padding: 5px; padding-bottom: 20px;'});
 			$("<div>", {style: 'height: 25px;'}).html("<strong>"+from.name+" <img src='images/arrow.gif' width=25 height=15 style='vertical-align: bottom;'/> "+to.name+"</strong>").appendTo(base);
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
	 			
	 			$("<button>", {style: 'margin: 5px; padding: 0px;'}).html("Edit Line").button().appendTo(base).click(function() {
	 	        	 me.infoWindow.close();

	 				console.log("find midpoint and show marker", pl);
	 				//var path = pl.getPath();
	 				me.createPullMarkers(pl, link);
	 				
	 			});
	 			
	 			
 			}
 			else {
 				var div = $("<div>", {style: 'display: inline-block; padding-top: 5px;'}).appendTo(base);
 				$("<div>").html("<B>Speed:</B> " + link.connectionSpeed.speed).appendTo(div);
 				$("<div>").html("<B>Network:</B> " + link.network.name).appendTo(div);
 				var linksDiv = $("<div>").html("<B>Links:</B>").appendTo(div);
 				$.each(link.websites, function(index, website) {
 					linksDiv.append($("<a>", {href: website.url, text: website.label}));
 				});
 			}
 			
 			console.log(base);
 			console.log(me.infoWindow);
 			me.infoWindow.setContent(base[0]);
 			
 			console.log("e:",e);
 			//either position where user clicked, or midpoint of line
 			if(e)
 				me.infoWindow.setPosition(e.latLng);
 			else {
 				
 				var startLatLng = new google.maps.LatLng(from.latitude, from.longitude); 
 				var endLatLng = new google.maps.LatLng(to.latitude, to.longitude);
 				
 				var midLatLng = me.getMidPoint(startLatLng, endLatLng);
				me.infoWindow.setPosition(midLatLng);
 			}
 			me.infoWindow.open(me.map);
 	});

    
 	
 	
	if(from.links == undefined)
		from.links = [];
	if(to.links == undefined)
		to.links = [];
	
	from.links.push({coordpos: 0, line: pl, connection: link});
	to.links.push({coordpos: 1, line: pl, connection: link});

	// if (click) google.maps.event.trigger(pl, 'click');
    
    return pl;
};

Map.prototype.createPullMarkers = function(line, link) {
	this.clearEditLine();
	
	this.currentEditLine = {line: line, connection: link};
	
	var me = this;
	var lastpoint;
	this.midmarkers = [];
	this.waymarkers = [];
	
	var path = line.getPath();
	path.forEach(function(point, idx) {
		if(idx > 0) {
			me.createMidMarker(idx, line, point, lastpoint);
			
			if(idx < path.getLength()-1) {
				me.createWayMarker(idx, line, point);
			}
			
		}
		lastpoint = point;
	});
};

Map.prototype.createWayMarker = function(idx, line, point) {
	var me = this;
	var path = line.getPath();
	
	var marker = new google.maps.Marker({
    	position: point,
    	map: me.map,
    	icon: {
  	      path: google.maps.SymbolPath.CIRCLE,
  	      strokeOpacity: 1,
  	      scale: 5
  	    },
        raiseOnDrag: false,
    	draggable: true
    });
	this.waymarkers.push(marker);
	
	google.maps.event.addListener(marker, "drag", function(e) {
		me.midmarkers[idx-1].setMap(null);
		me.midmarkers[idx].setMap(null);
		
		console.log("drag",idx,e.latLng);
		path.setAt(idx, e.latLng);
	});
	google.maps.event.addListener(marker, "dragend", function(e) {
		me.createPullMarkers(line, me.currentEditLine.connection);
		me.storeLink(me.currentEditLine);
	});
	google.maps.event.addListener(marker, "dblclick", function (e) { 
        path.removeAt(idx);
        me.createPullMarkers(line, me.currentEditLine.connection);
		me.storeLink(me.currentEditLine);
     });
};

Map.prototype.getMidPoint = function(startLatLng, endLatLng) {
	var projection = this.map.getProjection();
	var startPoint = projection.fromLatLngToPoint(startLatLng); 
	var endPoint = projection.fromLatLngToPoint(endLatLng); 
	
	// Average 
	var midPoint = new google.maps.Point( 
	    (startPoint.x + endPoint.x) / 2, 
	    (startPoint.y + endPoint.y) / 2); 
	// Unproject 
	return projection.fromPointToLatLng(midPoint); 
};

Map.prototype.createMidMarker = function(idx,line,point,lastpoint) {
	var me = this;
	var path = line.getPath();
	
	var position = this.getMidPoint(point, lastpoint);
	
//	
//	var position = new google.maps.LatLng(
//	    		point.lat() - (0.5 * (point.lat() - lastpoint.lat())),
//	    		point.lng() - (0.5 * (point.lng() - lastpoint.lng()))
//	    	);
	console.log("position", position);

	var marker = new google.maps.Marker({
    	position: position,
    	map: me.map,
    	icon: {
  	      path: google.maps.SymbolPath.CIRCLE,
  	      strokeOpacity: 0.3,
  	      scale: 5
  	    },
      raiseOnDrag: false,
    	draggable: true
    });
	this.midmarkers.push(marker);
	
	google.maps.event.addListener(marker, "dragstart", function(e) {
		console.log("dragstarted, insert waypoint at:",idx,e.latLng);
		path.insertAt(idx, e.latLng);
	});
	google.maps.event.addListener(marker, "drag", function(e) {
		console.log("drag",idx,e.latLng);
		path.setAt(idx, e.latLng);
	});
	google.maps.event.addListener(marker, "dragend", function(e) {
		console.log("drag",idx,e.latLng);
		path.setAt(idx, e.latLng);
		
		me.createPullMarkers(line, me.currentEditLine.connection);
		me.storeLink(me.currentEditLine);
	});
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