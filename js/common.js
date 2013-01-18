require(["dojox/mobile"
		 , "dojo/query"
		 , "dojo/dom-attr"
		 , "dojox/mobile/parser"
		 , "dojox/mobile/deviceTheme"
		 , "dojo/ready"
		 , "dijit/registry"
		 , "dojox/mobile/compat"
		 , "dojox/mobile/View"
		 , "dojox/mobile/ViewController"		 
                    ], function(mobile,query,attr, parser, deviceTheme, ready, registry, compat, View, ViewController){
                        ready(function(){
							
                           show = function(dlg){
								registry.byId(dlg).show();
							}
							hide = function(dlg){
								registry.byId(dlg).hide();
							} 
							
							query(".slide").connect("onclick", function(e){
								dojo.stopEvent(e);
								var link = this;
								registry.byId('main').performTransition(null, 1, "slide", null, function(){ 
																										 location.href = attr.get(link,'href');
																										 });
							});
							query(".slider").connect("onclick", function(e){
								dojo.stopEvent(e);
								var link = this;
								registry.byId('main').performTransition(null, -1, "slide", null, function(){ 
																										 location.href = attr.get(link,'href');
																										 });
							});
                         });
						
                    });



function getUrlParams() {
	var paramMap = {};
	if (location.search.length == 0) {
	return paramMap;
	}
	var parts = location.search.substring(1).split("&");
	
	for (var i = 0; i < parts.length; i ++) {
	var component = parts[i].split("=");
	paramMap [decodeURIComponent(component[0])] = decodeURIComponent(component[1]);
	}
	return paramMap;
}