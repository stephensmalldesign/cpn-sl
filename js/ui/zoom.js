// A base zooming tiles widget.  Will display a given array of items with one item visible at a time with the ability to zoom out to view and select other items.
;(function(iwk) {

	ibmUI.prototypes.zoom = {
		isZoomedOut: false,			// true if the content is currently zoomed out to scroll over the items
		content: null,				// the DOM of the content area
		items: [],					// array of items to tile in the content area
		curItem: null,				// the DOM of item that is currently selected
		itemKey: "iwk-select-item",	// the localstorage key that holds the id of the current item
		time: 300,					// the time in milliseconds of the zoom animation length, used for timeouts that avoid animations
		btnHgt: 25,					// the height of the zoom out button in pixels
		overlayId: "theme-overlay",	// the id of the overlay that covered the tiles when zoomed out
		aCls: "theme-active",		// the CSS active class for component controls
		zCls: "theme-zoomed-out",	// the CSS class for a zoomed out content area
		tCls: "theme-tiles",		// the CSS class that creates the tiles
		anim: "theme-tile-anim",	// the CSS class that creates the zoom animations
		tileWidth: 200,				// the width, in pixels, of one tile
		tileSpace: 22,				// the amount, in pixels, of the tile margin and borders that adds to the width one tile takes
		zero: 0,					// in order to center each tile on the screen, the row of tiles cannot be all the way at 0
									// instead, it must be offset enough to center the item rather than using 0
		
		postCreate: function() {
			this.onStart();
			
			// calculate our zero offset for this screen size
			// this will center a tile on the screen
			this.zero = this.left = (this.domNode.offsetWidth - this.tileWidth - this.tileSpace) / 2;
			
			// check that there is at least one item in the content area
			if( this.processItems() > 0 ) {
				// add the CSS class that creates the zoom animations
				// add this in a timeout so the items do not animate on page load
				var me = this;
				setTimeout(function(){ iwk.addClass(me.domNode, me.anim); }, this.time);
			
				// add overlay and button for zooming out
				this.addZoom();
			}
		},
		
		onStart: function() {
			// stub for instances to fill out
		},
		
		processItems: function() {
			// loops through the items in the content area
			// returns the total number of items present
			
			// check if there is a selected item stored in the browser
			var selectedId = localStorage[this.itemKey], selectedIndex = -1, me = this;
			
			// loop through each item
			for( var i = 0, l = this.items.length; i < l; i++ ) {
				var item = this.items[i];
				// make the item's inline style set to its height, to allow animations to work
				// animations will not work on "auto" heights and widths
				item.style.height = item.offsetHeight + "px";
				// check if this item is currently selected
				if( iwk.layout.getID(item) == selectedId ) selectedIndex = i;
			}
			
			// add the CSS class that creates the tiles
			// this must be added after the inline heights are set on each item in the loop, otherwise all the item heights will fixed at the same height as the small tiles
			// however it must be added before an item is selected, otherwise the left value of the content area will be too big
			iwk.addClass(this.content, this.tCls);
			
			// remove the class that made the layout invisible during page load
			// this invisibility prevents all page content from flashing, full sized, on the screen during processing
			iwk.removeClass(this.content, "theme-invisible");
			
			// select the item indicated in localStorage, else zoom out to the tile view
			if( selectedIndex > -1 ) this.selectItem(this.items[selectedIndex]);
			else this.zoomOut();
			
			return i;
		},
		
		addZoom: function() {
			// add a button that zooms out to view and scroll through all the tiles
			var zoom = document.createElement("div");
			iwk.addClass(zoom, "theme-zoom-tab");
			this.domNode.appendChild(zoom);
			iwk.connect(zoom, "onclick", this, "zoomOut");
			this.btnHgt = zoom.offsetHeight || this.btnHgt;
			// add a height and width to the overlay that will prevent users from clicking links inside items when zoomed out
			var overlay = iwk.byId(this.overlayId), me = this;
			overlay.style.height = this.domNode.offsetHeight + "px";
			overlay.style.width = this.domNode.offsetWidth + "px";
			// add an onclick handler to the overlay which will zoom the back in on the current tile
			iwk.connect(overlay, "onclick", function(e){ me.zoomIn(e); });
			// add touch event handles to th overlay which will cycle through the tiles when zoomed out
			iwk.connect(overlay, "ontouchstart", function(e){ me.contentTouch(e, me.isZoomedOut); });
			iwk.connect(overlay, "ontouchmove", function(e){ me.contentMove(e, me.isZoomedOut); });
			iwk.connect(overlay, "ontouchend", function(e){ me.contentEnd(e); });
		},
		
		zoomOut: function() {
			// zoom the content area out, so the user can scroll through the items
			if( !this.isZoomedOut ) {
				this.isZoomedOut = true;
				iwk.addClass(this.domNode, this.zCls);
				this.content.style.left = this.left + "px";
				// remove the currently selected item in local storage
				localStorage.removeItem(this.itemKey);
			}
		},
		
		zoomIn: function(/*DOMNode*/e) {
			// zoom the content area in, onto the given selected item
			if( this.isZoomedOut ) { 
				// calculate index of the item clicked based on the x value of the cursor, the left offset of the row of tiles, and the size of the tiles
				var i = Math.round((e.clientX - parseFloat(this.content.offsetLeft)) / (this.tileWidth + this.tileSpace)-.5);
				// only zoom in if the index is in the range of available items
				if( i >= 0 && i < this.items.length ) {
					this.isZoomedOut = false;
					iwk.removeClass(this.domNode, this.zCls);
					this.selectItem(this.items[i]);
				}
			}
		},
		
		selectItem: function(/*DOMNode*/n) {
			// select the given DOM node item
			// move the active class from the old to the newly selected item
			if( this.curItem ) iwk.removeClass(this.curItem, this.aCls);
			iwk.addClass(n, this.aCls);
			
			// add a width to the active item so it fills out the whole screen
			if( this.curItem ) this.curItem.style.width = "";
			n.style.width = this.domNode.offsetWidth + this.tileSpace + "px";
			
			// make the content area the same height as the current item, to avoid empty space
			iwk.byId("theme-content").style.height = parseFloat(n.style.height) + "px";
			
			// scroll the content area to put the newly selected item in view
			this.content.style.left = -1 * n.offsetLeft + "px";
			
			// set the new item as the currently selected item
			this.curItem = n;
			localStorage[this.itemKey] = iwk.layout.getID(n);
		},
		
		contentTouch: function(/*DOMEvent*/e, /*boolean*/isZoomedOut) {
			// the user touches the content with two fingers
			if( isZoomedOut && e.touches.length > 0 ) {
				// remember the X position of the finger on the page
				this.pageX = e.touches[0].pageX; 
			}
		},
		
		contentMove: function(/*DOMEvent*/e, /*boolean*/isZoomedOut) {
			// the user moves the fingers on the content
			if( this.pageX && isZoomedOut && e.touches.length > 0 ) {
			
				// calculate the change in X position for both fingers
				var newPageX = e.touches[0].pageX;
				var delta = newPageX - this.pageX;
				this.pageX = newPageX;
				
				// only move if the user swiped more than 10 pixels
				if( delta > 10 || delta < -10 ) {
					// calculate min and max shift based on the size of the page
					var min = -1 * this.tileWidth * this.items.length;
					var max = this.zero;
					
					// calculate the current and new left left values to shift the row of tiles
					// the shift amount will move the amount of pixels needed to center the previous or next tile in the row
					// the addition of tileSpace is to account for tile margins and borders
					var curLeft = parseFloat(this.content.style.left);
					var shift = delta >= 0 ? this.tileWidth + this.tileSpace : -1 * this.tileWidth - this.tileSpace;
					var newLeft = shift + curLeft;
					
					// if the min and max left values are not crossed
					if( newLeft >= min && newLeft <= max ) {
						// reset pageX, so the tiles don't shift more than once for just one swipe
						// so the user must lift and swipe a separate time to move to the next tile
						this.pageX = false;
						this.left = newLeft;
						this.content.style.left = newLeft + "px";
					}
				}
			}
		},
		
		contentEnd: function(/*DOMEvent*/e) {
			// the user lifts the fingers off the content
			this.pageX = false;
		},
		
		destroy: function() {
		}
	};
	
})(ibmwebkit);
