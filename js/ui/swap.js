// A base swap widget.  Takes a list of items and displays one at a time.  When the swap() function is called, the widget will display a different item.
;(function(iwk) {

	ibmUI.prototypes.swap = {
		root: null,		// the parent node for all the items
		items: [],		// list of references to all the swappable items
		anim: "theme-anim-switch",	// the animation class, choices are theme-anim-fade, theme-anim-switch, or theme-anim-turn
		evt: "",		// the event name to which this element will subscribe to know when to swap items
		cur: 0,			// the index of the currently displayed item
		eId: 0,			// id of the swap event
		iCls: "theme-in",	// the CSS class for swapping in
		oCls: "theme-out",	// the CSS class for swapping out
		tCls: "theme-top",	// the CSS class for the item currently displaying
		
		postCreate: function() {
			// retrieve the root and items
			this.root = iwk.byId(this.root);
			
			// set the CSS classes for the top item and animation type
			iwk.addClass(this.items[0], this.tCls);
			iwk.addClass(this.root, this.anim);
			
			// put a height on the root and children equal to the largest child
			var h = 0;
			for ( var i = 0, l = this.items.length; i < l; i++ ) {
				// find the talling child
				var hh = this.items[i].offsetHeight;
				if( hh > h ) h = hh;
			}
			this.root.style.height = h + "px";
			for ( var i = 0, l = this.items.length; i < l; i++ ) {
				this.items[i].style.height = h + "px";
			}
			
			// subscribe to the given event to know when to swap items
			var me = this;
			this.eId = iwk.subscribe( this.evt || "none", function(o){ me.swap.apply(me,[o]); } );
		},
		
		swap: function(o) {
			// swap from the current to the next item
			// o: object that contains o.next = the index of the item to swap to
			if( this.items[this.cur] && this.items[o.next] ) {
				// swap the current item out by removing the in and top classes and adding the out class
				iwk.removeClass(this.items[this.cur], this.iCls);
				iwk.removeClass(this.items[this.cur], this.tCls);
				iwk.addClass(this.items[this.cur], this.oCls);
				// swap the next item in by removing the out class and adding the in and top classes
				iwk.removeClass(this.items[o.next],this.oCls);
				iwk.addClass(this.items[o.next],this.iCls);
				iwk.addClass(this.items[o.next],this.tCls);
				// set cur to next
				this.cur = o.next;
			}
		},
		
		destroy: function() {
			// unsubscribe from the swap event
			iwk.unsubscribe(this.eId);
		}
	};
	
})(ibmwebkit);
