// Provides functions for subscribing to and publishing events on the client
;(function(iwk) {
	iwk._listeners = {};
	iwk._LID = 0;
	iwk.subscribe = function(/*string*/s, /*function*/f) {
		// registers a listener to an event by adding the s/f combo to the listeners object
		// s: string to subscribe to
		// f: function to run
		// returns: id for the listener
		var id = iwk._LID++;
		iwk._listeners[id] = {e:s, f:f};
		return id;
	};
	iwk.unsubscribe = function(id) {
		// removes a listener
		// id: the id of the listener to remove
		if( iwk._listeners[id] ) {
			iwk._listeners[id] = null;
			delete iwk._listeners[id];
		}
	};
	iwk.publish = function(/*string*/s, /*object*/o) {
		// publishes an event
		// s: string to publish
		// o: object to pass to listeners
		for( var i in iwk._listeners ) {
			if( iwk._listeners[i].e == s ) {
				// each time a listener is found where the event strings match,
				// fire the corresponding function
				iwk._listeners[i].f(o);
			}
		}
	};
})(ibmwebkit);
