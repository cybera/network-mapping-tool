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
     					
     					var skipthese = ["marker", "links"];
     					$.each(place, function(key, val) {
     						if(!$.inArray(key, skipthese))
     							return true;
     						
     						$("<div>").html(key+":"+val).appendTo(base);
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
}

Map.prototype.drawPlace = function(place, linkCallback, selectCallback, dragCallback, bounce) {
	var ll = new google.maps.LatLng(place.latitude, place.longitude);

	var image = new google.maps.MarkerImage('http://maps.google.com/mapfiles/kml/pal4/icon57.png',
		      new google.maps.Size(32, 32),
		      new google.maps.Point(0,0),
		      new google.maps.Point(16, 16));
	
	
	var animation = null;
	if(bounce) 
		animation = google.maps.Animation.BOUNCE;
		
	
	
	var marker = new google.maps.Marker({
		position: ll,
		map: this.map,
		icon: this.circle,
		zIndex: 100,
		draggable: editMode,
		animation: animation
		
	});
	
	this.markers.push(marker);
	
	console.log("MARDER: ",marker);
	
	marker.placename = place.id;
	marker.linkCallback = linkCallback;
	marker.selectCallback = selectCallback;
	marker.dragCallback = dragCallback;
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
   	 	
   	 	place.latitude = newpos.lat();
   	 	place.longitude = newpos.lng();
   	 	
   	 	
   	 	if(marker.dragCallback)
   	 		marker.dragCallback(place);
   	 	
   	 	if(place.links) {
   	 		$.each(place.links, function(idx, itm) {
   	 			itm.line.getPath().setAt(itm.coordpos, newpos);
   	 		});
   	 	}
   	 	
    });

    return marker;
}

Map.prototype.setStyle = function(style) {
	this.style = style;
	this.map.setOptions({styles: style});
}


Map.prototype.drawLink = function(link, from, to, type) {
	var ll1 = new google.maps.LatLng(from.latitude, from.longitude);
	var ll2 = new google.maps.LatLng(to.latitude, to.longitude);

	/*
	var image = new google.maps.MarkerImage('http://maps.google.com/mapfiles/kml/pal4/icon57.png',
		      new google.maps.Size(32, 32),
		      new google.maps.Point(0,0),
		      new google.maps.Point(16, 16));
	
	marker = new google.maps.Marker({
		position: ll1,
		map: this.map,
		title: from.name,
		icon: image 
	});
	marker = new google.maps.Marker({
		position: ll2,
		map: this.map,
		title: to.name,
		icon: image
	});
	*/
	
	
    /*var lineSymbol = {
                      path: 'M 0,-1 0,1',
                      strokeOpacity: 0.3,
                              strokeColor: '#30B9ED',
                      scale: 4
                    };
*/
	
	var options = $.extend({}, type, {
		path: [ll1, ll2],
		map: this.map
	});

	
    //var total = Math.abs(from.coords.latitude-to.coords.latitude)+Math.abs(from.coords.longitude-to.coords.longitude);
	//var factor = total*.10;
    //var controlLat = from.coords.latitude+factor;
    //var controlLon = from.coords.longitude+factor;
    
//    var pl = new GmapsCubicBezier(from.coords.latitude, from.coords.longitude, controlLat, controlLon, controlLat, controlLon, to.coords.latitude, to.coords.longitude, 0.1, this.map);
    
    /*
    var pl = new google.maps.Polyline({
    	path: [ll1, ll2],
        strokeColor: "#30B9ED",
        strokeOpacity: 1.0,
        strokeWeight: 4,
        zIndex:1000,
        //icons: [{
//        	icon: lineSymbol,
            //offset: '0',
            //repeat: '20px'
        //}],
        map: this.map});
    */
    
    var pl = new google.maps.Polyline(options);
    
    this.lines.push(pl);
    
    var me = this;
 	google.maps.event.addListener(pl, 'click', function(e) {
			var base = $("<div>");
 			$("<div>").html("<strong>"+from.name+" -> "+to.name+"</strong>").appendTo(base);
 			
 			if(editMode) {
	 			var select = $("<select>").appendTo(base);
	 			$.each(indexedLinkTypes, function(idx, itm) {
	 				var option = $("<option>", {value:idx}).html(idx);
	 				if(link.type == idx)
	 					option.attr("selected", "selected");
	 				
	 				option.appendTo(select);
	 				
	 				
	  			});
	 			select.change(function() {
	 				console.log($(this).val());
	 				link.type=$(this).val();
	 				
	 				/*var options = $.extend({}, indexedLinkTypes[$(this).val()], {
	 					path: [ll1, ll2],
	 					map: me.map
	 				}); */
	 				pl.setOptions(indexedLinkTypes[$(this).val()]);
	 				//need to update link here as well...
	 				
	 				displayLinks();
	 			});
 			
 			
	 			$("<button>").html("Delete").click(function() {
	 				$.confirm("Do you want to delete this link?", {
	 					title: 'Confirm Delete',
	 					buttons: {
	 						"Yes": function() {
	 							$(this).dialog("close");
	 			 				links.splice(links.indexOf(link), 1);
	 			 				console.log(links);
	 			 				
	 			 				pl.setMap(null);
	 			 				me.infoWindow.close();
	 						},
	 						"No": function() {
	 							$(this).dialog("close");
	 						}
	 					}
	 				});
	 			}).button().appendTo(base).wrap("<div>");
 			}
 			else {
 				$("<div>").html(link.type).appendTo(base);
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
}

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