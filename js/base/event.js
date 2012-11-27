// Provides a way to connect and disconnect functions to the window or other elements.
;(function(iwk){
	iwk._loaded = false;	// true after the window.onLoad event has fired
	iwk._loaders = [];	// array of functions to fire on page load
	iwk._unloaders = [];	// array of functions to fire on page unload
	iwk._init = function() {
		// this function runs on page load
		iwk._loaded = true;
		// avoid memory leaks/multiple firings
		iwk.disconnect(window, "onload", iwk, iwk._init);
		// empty the loader array
		var f = iwk._loaders;
		iwk._loaders = [];
		// fire all of the loader functions
		for( var i = 0, l = f.length; i < f.length; i++ ) {
			f[i]();
		}
	};
	iwk._exit = function() {
		// this function runs on page unload
		var f = iwk._unloaders;
		iwk._unloaders = [];
		// fire all of the unloader functions
		for( var i = 0, l = f.length; i < f.length; i++ ){
			f[i]();
		}
	};
	iwk.ready = function(/*object?*/o, /*string/function*/f) {
		// adds a new function to fire on page load
		// o: a scope object, optional
		// f: either a function or a string key into object o
		var fcn = iwk.hitch(o, f);
		if( iwk._loaded ) {  // fire immediately if page is loaded
			fcn();
		} else {			// otherwise, add to the loader array
			iwk._loaders.push(fcn);
		}
	};
	iwk.unload = function(/*object?*/o, /*string/function*/f) {
		// adds a new function to fire on page unload
		// o: a scope object, optional
		// f: either a function or a string key into object o
		// please note: Opera does not support the onunload event
		iwk._unloaders.push( iwk.hitch(o, f) );
	};
	iwk.connect = function(/*object*/o, /*string*/e, /*object?*/s, /*string/function*/f, /*object*/args) {
		// attaches an event to given object
		// o: the object on which to attach the event
		// e: the event name, MUST have "on" as the first two characters
		// s: the scope in which to call f, optional
		// f: the function to run when the event fires
		// args: arguments array to pass into f, optional
		var fcn = iwk.hitch(s, f, args);
		if( o.attachEvent ) {	// IE
			o.attachEvent(e, fcn, false);
		} else if ( o.addEventListener ) {
			o.addEventListener(e.substring(2), fcn, false); // chop off the "on" part
		}
	};
	iwk.disconnect = function(/*object*/o, /*string*/e, /*function*/f) {
		// removes an event from given object
		// o: the object from which to detach the event
		// e: the event name, MUST have "on" as the first two characters
		// s: the scope in which to call f, optional
		// f: the function that runs when the event fires
		if( o.detachEvent ) {	// IE
			o.detachEvent(e, f, false);
		} else if ( o.removeEventListener ) {
			o.removeEventListener(e.substring(2), f, false); // chop off the "on" part
		}
	};
	iwk.hitch = function(/*object?*/s, /*string/function*/f, /*array*/args) {
		// returns function f called in scope s with arguments array of args
		if( !f ){
			f = s;
			s = null;
		}
		if( iwk.isString(f) ) {
			s = s || window;
			return function(){ return s[f].apply(s, args || []); };
		}
		return !s ? f : function(){ return f.apply(s, args || []); };
	};
	// add init and exit page handlers to the browser window
	iwk.connect(window, "onload", iwk, "_init");
	iwk.connect(window, "onunload", iwk, "_exit");
})(ibmwebkit);
