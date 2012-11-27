// DOM helper functions dealing with element IDs, classNames and types
;(function(iwk) {
	iwk.byId = function(/*string/DOMNode*/id) {
		// returns a DOM node with the given id
		if( iwk.isString(id) ) return document.getElementById(id);
		else return id;
	};
	iwk.removeClass = function(/*string/DOMNode*/n, /*string*/c) {
		// add a CSS class to a DOM node
		// n: the DOM node or id
		// c: the CSS class to remove
		n = iwk.byId(n);
		var cls = n.className;
		if(cls) n.className = cls.replace(c,"");
	};
	iwk.addClass = function(/*string/DOMNode*/n, /*string*/c) {
		// remove a CSS class from a DOM node
		// n: the DOM node or id
		// c: the CSS class to add
		n = iwk.byId(n);
		if( iwk.hasClass(n, c) ) return;
		var cls = n.className;
		n.className = cls + " " + c;
	};
	iwk.hasClass = function(/*string/DOMNode*/n,/*string*/c) {
		// returns true if a DOM node has a CSS class
		// n: the DOM node or id
		// c: the CSS class to check
		n = iwk.byId(n);
		return ( n.className && n.className.indexOf(c) >= 0 );
	};
	iwk.isString = function(o) {
		// return true if o is a string
		return typeof o === "string";
	};
	iwk.isFunction = function(o) {
		// return true if o is a function
		return typeof o === "function" || o instanceof Function;
	};
	iwk.disable = function(n) {
		// disable the given DOM node by adding a disabled class
		iwk.addClass(n, themeCfg.css.disable);
	};
	iwk.enable = function(n) {
		// enable the given DOM node by removing a disabled class
		iwk.removeClass(n, themeCfg.css.disable);
	};
})(ibmwebkit);
