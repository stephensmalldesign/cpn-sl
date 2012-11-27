// Helper functions to access the controls and containers of a static Portal page.
;(function(iwk) {
	iwk.layout = {};
	var layout = iwk.layout;
	layout.containerCls = "component-container";	// this CSS class is always on each container in a static page
	layout.controlCls = "component-control";		// this class is always on each control
	layout.getContainers = function() {
		// returns an array of all the containers on the page
		var ret = [];
		var c = iwk.byId(themeCfg.layout.rootId).childNodes;
		// loop through all the child nodes of the layout root node
		for( var i = 0, l = c.length; i < l; i++ ) {
			if( iwk.hasClass(c[i], layout.containerCls) ) {
				// if the node has the container class, add it to the return array
				ret.push(c[i]);
			}
		}
		return ret;
	};
	layout.getControls = function(/*DOMNode*/ct) {
		// returns an array of controls
		// ct: (optional) a container DOM node
		//		if present, function will return all controls in ct
		//		if not present, function will return all controls on the page
		var ret = [], c = [];
		if( !ct || !iwk.hasClass(ct,layout.containerCls) ) {
			// a container was not given
			c = layout.getContainers();
		} else {
			c.push(ct);
		}
		// loop through all of the containers to find the controls
		for( var i = 0, l = c.length; i < l; i++ ) {
			var cc = c[i].childNodes;
			// loop through the child nodes of the container c[i]
			for( var j = 0, ll = cc.length; j < ll; j++ ) {
				if( iwk.hasClass(cc[j], layout.controlCls) ) {
					// if the node has the control class, add it to the return array
					ret.push(cc[j]);
				}
			}
		}
		return ret;
	};
	layout.getID = function(/*DOMNode*/c) {
		// returns the id of the given container or control
		// 		the id can be found in the className of the given item
		// c: the DOM for the layout element
		var m = (c.className || "").match(/id-([\S]+)/);
		return m && m[1];
	};
})(ibmwebkit);
