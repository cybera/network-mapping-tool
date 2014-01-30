;(function ( $, window, document, undefined ) {

    $.widget( "netmap.editPopup" , {

        //Options to be used as defaults
        options: {
        	title: '',
        	url: '',
        	urlList: '',
        	grid: {},
        	displayAttribute: '',
        	width: 'auto',
        	height: 'auto',
        	onListRefresh: function() {}
        },
        
        _create: function () {
        	var me = this;
        	
        	this.data = {};
        	
        	this.toolbar = $("<div>", {style: 'margin-left:10px; margin-bottom:10px; height:25px; width:100%'}).appendTo(this.element);
        	this.addButton = $("<img>", {title: 'Add', src: 'images/add.png', 'class': 'btn'}).appendTo(this.toolbar);
        	this.editButton = $("<img>", {title: 'Edit', src: 'images/edit.png', 'class': 'btn'}).appendTo(this.toolbar);
        	this.deleteButton = $("<img>", {title: 'Delete', src: 'images/delete.png', 'class': 'btn'}).appendTo(this.toolbar);

        	this.table = $("<table>").uniqueId().appendTo(this.element);
        	this.table.css("padding-right", "20px");
        	this.dataById = {};
        	
        	if(me.options.appendLayout) {
        		$(me.options.appendLayout).appendTo(this.element);
        	}
        	
        	
        	var colNames = [];
        	var colModel = [];
        	$.each(this.options.grid, function(key, val) {
        		colNames.push(key);
        		colModel.push(val);
        	});
        	
        	console.log("Col Model:",colModel);
        	console.log("Col Names:",colNames);
        	
        	var lastSel;
        	var tableOptions = {
        			datatype: "local",
        			sortable: true,
        			colNames:colNames,
        			colModel:colModel,
        			shrinkToFit: true,
        			height: 175,
        			width: 400,
        			rowNum: 10000,
        		   	rowList:[10,20,30],
        		   	scroll: true,
        		   	scrollrows: true,
        			onSelectRow: function(id, status, event){
        				//check if edit bailed
        				if(id && id!==lastSel){
        					if(lastSel) {
        						console.log("lastsel:",lastSel);
        						console.log("id:",id);
        						
        						
        						me._confirmSave(lastSel, function() {
        							lastSel = undefined;
        						});
        					
        					}
        					
        				}
        			},
        			ondblClickRow: function (id, ri, ci, e) {
        				//edit on double click

        				lastSel=id;
        				
        				me.editRow(id);
        				    
        			}
        		};
        	
        		var table = me.table.jqGrid(tableOptions).navGrid("#pagernav",{edit:false,add:false,del:false});
        		
        		me.addButton.click(function() {
        			post(me.options.url, me.options.defaultObject, 'json', function(d) {
        				me.dataById[d.uuid] = d;
        				
        				table.jqGrid('addRowData', d.uuid, d, "first");
        				
        				me.editRow(d.uuid);
        			});
        		});

        		me.editButton.click(function() {
        			var id = table.jqGrid("getGridParam", "selrow");

        			this.editRow(id);
        		});

        		
        		me.deleteButton.click(function() {
        			var id = table.jqGrid("getGridParam", "selrow");
        			$.confirm("Do you want to delete "+me.dataById[id][me.options.displayAttribute]+"?", {
        				title: 'Confirm Delete',
        				buttons: {
        					"Yes": function() {
        						deleteCall(me.options.url+"/"+id, function() {
        							table.jqGrid('delRowData', id);
        				
        							delete me.dataById[id];
        							$.getJSON(me.options.urlList, function(result) {
        								me.options.onListRefresh.call(me, result);
        							});

        						});
        						$(this).dialog("close");
        					},
        					"No": function() {
        						$(this).dialog("close");
        					}
        				}
        			});
        		});

        		
        		this.element.dialog({
        			autoOpen: false,
        			title: me.options.title,
        			width: me.options.width,
        			height: me.options.height,
        			buttons: {'Done': function() {
        					if(me.table.find("tr[editable='1']").length > 0) {
        						me._confirmSave(me.table.find("tr[editable='1']").attr("id"));
        					}
        				
        					$(this).dialog("close");
        				}
        			}
        		});
        		
        		
        		console.log("fetch list: "+me.options.urlList);
        		$.getJSON(me.options.urlList, function(result) {
        			me.data = result;
        			me.options.onListRefresh.call(me, me.data);
            		
        			me.dataById = {};
            		
            		$.each(me.data, function(idx, itm) {
            			me.dataById[itm.uuid] = itm;
            		});
            		
            	    table[0].p.data = me.data;
            		table.trigger('reloadGrid');

        			
        		});
        		
        		
        		
        		
    		this._setOptions(this.options);
        },

        _confirmSave: function(lastSel, callback) {
        	var me = this;
			var name = "";
			if(me.dataById[lastSel].name)
				name = " to "+me.dataById[lastSel].name;

        	$.confirm("Do you want to save changes"+name+"?",
					{
					buttons : {
						"Yes" : function() {
							console.log("calls saveRow",lastSel);
							me.table.jqGrid('saveRow', lastSel, {
								url : 'clientArray',
								keys : true,
								aftersavefunc : function() {
									me._saveit(lastSel);
								}
							});
							$(this).dialog("close");
	
						},
						"No" : function() {
							me.table.jqGrid('restoreRow', lastSel);
							if(callback)
								callback();
							
							$(this).dialog("close");
						}
					}
					});
        },
        
        _destroy: function () {
        },

        _setOptions: function() {
          this._superApply( arguments );
        },
   
        // _setOption is called for each individual option that is changing
        _setOption: function( key, value ) {
          this._super( key, value );
        },
        
        open: function() {
        	this.element.dialog("open");
        },
        
        editRow: function(id) {
        	var me = this;
        	
        	console.log("call edit row: "+id);
        	this.table.jqGrid('editRow', id, {
		    	url: 'clientArray',
		    	keys: true,
		    	aftersavefunc: function(row) {
		    		me._saveit(row);
		    	}
		    });
        },
        
        _saveit: function(row) {
        	var me = this;
        	
    		//Get the new updated data (reference in me.data) & update the index
    		var newdata = $.grep(me.data, function(obj, idx) {
    			   if(obj.uuid == row)
    			      return true;
    			})[0];

    		//jqGrid appends id to the object on adds, kill it as we don't want it
    		delete newdata.id;
    		me.dataById[row] = newdata; 
    		
    		console.log("after save func, call post: ",me.options.url,newdata);
    		post(me.options.url, me.dataById[row], 'json');
    		// post(me.options.url, d, 'json');
        }
        
        
        

    });

})( jQuery, window, document );




