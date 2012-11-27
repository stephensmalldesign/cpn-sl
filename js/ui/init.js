// Initializes the UI infrastructure.  Provides functions to create and instantiate UI elements, so the infrastructure can control their lifecycle on the page.
;(function(iwk) {
	// create the UI controller
	var w = this,
		ui = {
		// ibmwebkit.ui.prototypes will hold all the UI elements
		// add new prototypes like this:
		//			ibmUI.prototypes.NAME = {
		//				list object properties like strings, arrays, numbers
		//				postCreate: function(n,args) { do something },
		//				write other functions
		//				destroy: function(n) { destroy everything }
		//			}
		// OR base a new prototype off another like this:
		//			var newUI = ibmUI.prototypes.NAME = ibmUI.copy(ibmUI.prototypes.OTHERNAME);
		//			newUI.param = "something"; 			// overwrite a param
		//			newUI.fcn = function(n,args) { };	// overwrite a function
		// all prototypes MUST contain both a postCreate and destroy function
		//		so the UI element's lifecycle can be controlled
		// then create instances like this:
		//			var newUI = ibmUI.copy(ibmUI.prototypes.NAME);
		//			ibmUI.instantiate(newUI, "id", args);
		// OR more concisely like this:
		//			ibmUI.create(ibmUI.prototypes.NAME, "id", args);
		prototypes: {},
		elements: {},  // contains all the UI elements currently instantiated
		instantiate: function(/*object*/o, /*string*/id, /*object*/args) {
			// instantiates a UI element on the page
			// the UI element must have postCreate and destroy functions
			// the postCreate and destroy functions are added to the
			//		onLoad and onUnload queues
			// o: the UI object to instantiate
			// id: the root DOM id of the UI element, must be unique on the page
			// args: object to pass to postCreate()
			if( ibmUI.elements[id] ) {
				// make sure a UI element with this id does not already exist
				console.error('instantiate: UI element with id "' + id + '" already exists.');
				return;
			}
			ibmUI.elements[id] = o;
			// set the given id as the DOM node on o
			o.domNode = iwk.byId(id);
			// add the args to o
			for( var i in args ) {
				o[i] = args[i];
			}
			// add the postCreate function to the ready queue
			if( iwk.isFunction(o.postCreate) ) {
				iwk.ready(function(){ o.postCreate(); });
			} else {
				console.error('instantiate: UI element "' + id + '" does not have a postCreate function');
			}
			// add the destroy function to the unload queue
			if( iwk.isFunction(o.destroy) ) {
				iwk.unload(function(){ o.destroy(); });
			} else {
				console.error('instantiate: UI element "' + id + '" does not have a destroy function');
			}
		},
		copy: function(/*object*/o) {
			// creates and returns a new object with the same prototype as o
			// can be used to create instances of prototypes in ibmUI.prototypes
			var l = function(){};
			l.prototype = o;
			return new l();
		},
		create: function(/*object*/o, /*string*/id, /*object*/args) {
			// creates and instantiates a UI element on the page
			// the UI element must have postCreate and destroy functions
			// o: the object on which to base the new UI
			// id: the DOM id of UI root element
			// args: object to pass to the new UI element
			var ui = ibmUI.copy(o);
			ibmUI.instantiate(ui, id, args);
		}
	};
	w.ibmUI = ui;
})(ibmwebkit);
