// A base slider widget.  It appears as a button or link, which when clicked, will slide a given area in and out of view.  
// The state (open or closed) of the area is persisted across full page refreshes.
;(function(iwk) {

	ibmUI.prototypes.slider = {
		area: null,						// the DOMNode that is toggled
		id: "",							// the storage id to hold state of toggle
		anim: "theme-anim-toggle",		// the slide down animation CSS3 class
		
		postCreate: function() {
			// set the area to toggle
			this.area = iwk.byId(this.area);
			
			// display me in the UI
			iwk.removeClass(this.domNode, themeCfg.css.hidden);
			
			// set this elements id to the DOM root's id plus "-state"
			this.id = this.domNode.id + "-state";
			
			// make sure the toggle state is consistent with the stored value
			if( localStorage && localStorage[this.id] ) {
				// access stored state from HTML5 local storage
				var state = localStorage[this.id];
				if( state == "open" ) {
					this.toggle.apply( this.area, [this.id, "open"] );
				} else if( state == "closed" ) {
					this.toggle.apply( this.area, [this.id, "closed"] );
				}
			}
			
			// apply the slide animation and explicit height to the area node
			// do this in a timeout so the animation is not activated too soon
			var me = this;
			if( state == "open" ) this.area.style.height = this.area.offsetHeight + "px";
			setTimeout( function(){ iwk.addClass(me.area, me.anim); }, 500);
			
			// set the click handler to toggle the area
			iwk.connect(this.domNode, "onclick", this.area, this.toggle, [this.id]);
		},
		
		toggle: function(/*string*/id, /*string?*/state) {
			// slides the area in or out of view by setting the height to 0
			// state: state into which the area should go, "open" or "closed", optional
			// id: the id of this slider
			var h = iwk.hasClass(this, themeCfg.css.noHgt);
			if( state === "open" || h ) {
				// state is open or area is hidden ==> display it
				iwk.removeClass(this, themeCfg.css.noHgt);
				localStorage.removeItem(id);  // the key must be removed before resetting it to avoid QUOTA_EXCEEDED_ERR error on ipad
				localStorage[id] = "open";
			} else if ( state === "closed" || !h ) {
				// state is closed or area is in view ==> hide it
				iwk.addClass(this, themeCfg.css.noHgt);
				localStorage.removeItem(id);
				localStorage[id] = "closed";
			}
		},
		
		destroy: function() {
		}
	};
	
})(ibmwebkit);
