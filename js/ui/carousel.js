// A base carousel widget.  Will display a given array of items with one item visible at a time and arrows to navigate to previous and next items.
;(function(iwk) {

	ibmUI.prototypes.carousel = {
		content: null,				// the DOM of the content area
		outer: null,				// encapsulating DOM node for the entire carousel
		inner: null,				// DOM node which holds the item list
		left: null,					// click this to see the item to the left
		right: null,				// click this to see the item to the right
		list: null,					// UL that holds all of the item nodes
		items: [],					// list of references to all the LIs in list
		index: 0,					// index in items that is currently selected
		amt: 0,						// number of pixels list must shift to show the next item
		noneTxt: "(none)",			// text to display if there are no items in the carousel
		cls: "theme-carousel-nav",	// CSS class that styles the DOM as a carousel
		anim: "theme-anim-slide",	// CSS3 class that applies the sliding carousel animation
		
		postCreate: function() {
			// return if no root node for the carousel is given
			this.list = this.domNode;
			this.items = [];
			
			// find all the DOM node parts of the carousel
			this.content = iwk.byId(this.content);
			this.outer = iwk.byId(this.outer);
			this.inner = iwk.byId(this.inner);
			this.left = iwk.byId(this.left);
			this.right = iwk.byId(this.right);
			this.onStart();
			
			// set the carousel class on the outer DOM element
			iwk.addClass(this.outer, this.cls);
			
			// set the click handlers for the left and right arrows
			iwk.connect(this.left, "onclick", this, "shift", [this.left, this.right, -1]);
			iwk.connect(this.right, "onclick", this, "shift", [this.right, this.left, 1]);
			
			// set the carousel touch events
			var me = this;
			iwk.connect(this.outer, "ontouchstart", function(e){ me.navTouch(e); });
			iwk.connect(this.outer, "ontouchmove", function(e){ me.navMove(e); });
			iwk.connect(this.outer, "ontouchend", function(e){ me.navEnd(e); });
			if( this.content ) {
				// only set the content touch events if con was given
				iwk.connect(this.content, "ontouchstart", function(e){ me.contentTouch(e); });
				iwk.connect(this.content, "ontouchmove", function(e){ me.contentMove(e); });
				iwk.connect(this.content, "ontouchend", function(e){ me.contentEnd(e); });
			}
			
			// calculate the carousel shift amount based on the width of the inner DOM node
			// calculate and use this value inside a timeout, otherwise it happens too soon and the amt value is inaccurate
			// an inaccurate amt value results in the carousel items being uncentered
			setTimeout(function() { 
				me.amt = me.inner.offsetWidth;
				// build the list of item LIs and set the width of each one to the move amount
				// 		setting the width ensures only one item shows in the UI at a time
				// 		also keep track of which item has the selected class on it
				var sel = false;
				var c = me.domNode.childNodes;
				for( var i = 0, l = c.length; i < l; i++ ) {
					if( c[i].nodeName == "LI" ) {
						c[i].style.width = me.amt + "px";
						me.items.push(c[i]);
						if( !sel && !iwk.hasClass(c[i], themeCfg.css.active) ) me.index++;
						else sel = true;
					}
				}
				// if on item had the selected class on it, set the currently selected item to the first in the list
				if ( !sel ) me.index = 0;
				
				// shift the UL to the left so the selected item is in view
				//		and then disable either arrow if necessary
				me.list.style.left = -1 * me.index * me.amt + "px";
				if( me.index == 0 ) iwk.disable(me.left);
				if( me.index >= me.items.length - 1) iwk.disable(me.right);
				// if there are no items, display a message to the user
				if( me.index == me.items.length ) me.list.innerHTML = '<li class="theme-none-text">' + me.noneTxt + '</li>';
			}, 0);
			
			// use a timeout to assign the sliding transition so it does not start too soon
			setTimeout(function(){ iwk.addClass(me.outer, me.anim); }, 500);
		},
		
		onStart: function() {
			// stub for instances to fill out
		},
		
		change: function(/*integer*/i) {
			// stub for instances to fill out
			// i: the index in this.items that is now active in the carousel
		},
		
		shift: function(/*DOMNode*/me, /*DOMNode*/you, /*integer*/dir) {
			// shifts the carousel to the to reveal a different content area
			// me: the clicked arrow
			// you: the other arrow
			// dir: the direction to shift, 1 to go to the next piece of content, -1 to go to the previous
			var len = this.items.length;
			// returns true if there is room to shift the carousel in the given direction
			var allow = function(i) { return (i >= 0 && i < len); };
			// returns true if, after this current shift, the end of the carousel will be reached
			var end = function(i) { return (i == 0 || i == len - 1); };
			if( allow(this.index + dir) ) {
				// adjust the current carousel index and call change()
				this.index += dir;
				this.change(this.index);
				// slide the carousel contents to show a new item
				this.list.style.left = parseFloat(this.list.style.left) + -1 * dir * this.amt + "px";
				// enable the other arrow, and disable this arrow if the end has been reached
				iwk.enable(you);
				if( end(this.index) ) iwk.disable(me);
			}
		},
		
		navTouch: function(/*DOMEvent*/e) {
			// the user touches the carousel
			for( var i = 0, l = e.changedTouches.length; i < l; i++ ) {
				if( !this.nMv ) {
					// remember the X position of the finger on the page
					this.nMv = e.changedTouches[i].pageX;
				}
			}
		},
		
		navMove: function(/*DOMEvent*/e) {
			// the user moves a finger on the carousel
			e.preventDefault();
			for( var i = 0, l = e.changedTouches.length; i < l; i++ ) {
				if( this.nMv ) {
					// calculate how far the finger has moved in the X direction
					var delta = this.nMv - e.changedTouches[i].pageX;
					if( delta < -10 ) {
						// if the finger moved to the left, activate the left arrow
						this.shift(this.left, this.right, -1);
						this.nMv = false;
					} else if ( delta > 10 ) {
						// if the finger moved to the right, activate the right arrow
						this.shift(this.right, this.left, 1);
						this.nMv = false;
					}
				}
			}
		},
		
		navEnd: function(/*DOMEvent*/e) {
			// the user lifts a finger off the carousel
			this.nMv = false;
		},
		
		contentTouch: function(/*DOMEvent*/e) {
			// the user touches the content with two fingers
			if( e.touches.length > 1 ) {
				// remember the X position of the 2 fingers on the page
				this.pMv = [e.touches[0].pageX, e.touches[1].pageX]; 
			}
		},
		
		contentMove: function(/*DOMEvent*/e) {
			// the user moves the fingers on the content
			if( e.touches.length > 1 ) {
				//e.preventDefault();
				var w = this.content.offsetWidth;
				// calculate the change in X position for both fingers
				delta1 = this.pMv[0] - e.touches[0].pageX;
				delta2 = this.pMv[1] - e.touches[1].pageX;
				if( delta1 < -10 && delta2 < -10 ) {
					// if the fingers moved to the left, activate the left arrow
					this.shift(this.left, this.right, -1);
					this.pMv = false;
					this.content.style.left = w + "px";
				} else if ( delta1 > 10 && delta2 > 10 ) {
					// if the fingers moved to the right, activate the right arrow
					this.shift(this.right, this.left, 1);
					this.pMv = false;
					this.content.style.left = -1 * w + "px";
				}
			}
		},
		
		contentEnd: function(/*DOMEvent*/e) {
			// the user lifts the fingers off the content
			this.pMv = false;
		},
		
		destroy: function() {
		}
	};
	
})(ibmwebkit);
