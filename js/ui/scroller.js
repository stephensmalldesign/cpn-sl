// A base scroller widget.  Takes a list of items and if they do not fit horizontally across the page, will make the list scrollable so users can view all parts of the list.
;(function(iwk) {

	ibmUI.prototypes.scroller = {
		outer: null,			// encapsulating DOM node for the entire scroller
		inner: null,			// DOM node which holds the item list
		left: null,				// click this to see the item to the left
		right: null,			// click this to see the item to the right
		list: null,				// UL that holds all of the item nodes
		amt: 150,				// number of pixels this.list shifts on each arrow click
		scroll: false,			// true if there is enough content to scroll
		xPos: false,			// holds the current X position of a finger on the page
		noneTxt: "(none)",		// text to display if there are no items in the scroller
		anim: "theme-scroller",	// the CSS class to add that creates the scrolling animation
		
		postCreate: function() {
			// return if the given root DOM node does not exist
			this.list = this.domNode;
			
			// add the animation class to the scroller
			iwk.addClass(this.outer, this.anim);
			
			// find all the DOM node parts of the scroller
			this.outer = iwk.byId(this.outer);
			this.inner = iwk.byId(this.inner);
			this.left = iwk.byId(this.left);
			this.right = iwk.byId(this.right);
			
			this.onStart();
			
			// calculate the length of the domNode by tallying the widths of its children
			var children = this.domNode.childNodes, w = 0;
			for( var i = 0, l = children.length; i < l; i++ ) { 
				if( children[i].offsetWidth ) {
					w += children[i].offsetWidth + 4; // add extra for borders and margins
				}
			}
			
			// display message if there is nothing in the scroller OR
			// set the total width of all the children as the parent's width
			// this is to make sure there is no wrapping of children
			if( w == 0 ) this.domNode.innerHTML = '<span class="theme-none-text">' + this.noneTxt + '</span>';
			else this.domNode.style.width = w + "px";
			
			// set the scroll amount to 1/2 of the screen size
			// this ensures everything is easily accessible by scrolling
			this.amt = 0.5 * this.inner.offsetWidth;
			
			// set this.scroll to true if w is larger than the containing node
			//		because this means the scrolling area does not fit on the page
			this.scroll = w > this.inner.offsetWidth;
			
			// the left arrow always starts disabled
			// the right arrow is disabled if this.scroll is false
			iwk.disable( this.left );
			if( !this.scroll ) iwk.disable( this.right );
			
			// set the click handlers for the left and right arrows
			iwk.connect(this.left, "onclick", this, "shift", [this.left, this.right, 1]);
			iwk.connect(this.right, "onclick", this, "shift", [this.right, this.left, -1]);
			
			// set the scroll touch events
			var me = this;
			iwk.connect(this.outer, "ontouchstart", function(e){ me.touchStart(e); });
			iwk.connect(this.outer, "ontouchmove", function(e){ me.touchMove(e); });
			iwk.connect(this.outer, "ontouchend", function(e){ me.touchEnd(e); });
		},
		
		onStart: function() {
			// stub for instances to fill out
		},
		
		shift: function(/*DOMNode*/me, /*DOMNode*/you, /*integer*/dir, /*integer*/i) {
			// shifts the scroller to the to reveal different contents
			// me: the clicked arrow
			// you: the other arrow
			// dir: the direction to shift, -1 to go to the right, 1 to go to the left
			// i: optional, how many pixels to shift
			var amt = i || this.amt;
			var left = parseFloat( this.list.style.left || "0" );	// the current left value of the UL
			var newLeft = left + dir * amt;		 				// the prospective new left value
			newLeft = newLeft > 0 ? 0 : newLeft;				// ensure the new left position is no more than 0px
			var newNewLeft = newLeft + dir * amt;				// the prospective left value after two clicks
			var min = -1 * this.list.offsetWidth + 0.50 * this.inner.offsetWidth;	// the smallest amount allowed for left
			var allow = this.scroll && newLeft > min && newLeft <= 0;			// true if this shift is allowed
			var end = newNewLeft <= min || newNewLeft > 0; 		// true if there is no more content to shift to after this current shift
			if( allow ) {
				this.list.style.left = newLeft + "px";	// shift
				iwk.enable( you );						// make sure the opposite arrow is enabled
				if( end ) iwk.disable( me );			// disable this arrow if there is no more content in that direction
			}
		},
		
		touchStart: function(/*DOMEvent*/e) {
			// the user touches the scroller
			if( e.changedTouches.length > 0 ) {
				// remember the X position of the finger
				this.xPos = e.changedTouches[0].pageX;
			}
		},
		
		touchMove: function(/*DOMEvent*/e) {
			// the user lifts a finger from the scroller
			if( e.changedTouches.length > 0 && this.xPos ) {
				// avoid clicking on a link by preventing default touch behavior
				e.preventDefault();
				// calculate how far the finger has moved in the X direction
				var x = e.changedTouches[0].pageX,
					delta = this.xPos - x;
				if( delta < -5 ) {
					// if the finger moved to the left, activate the left arrow
					this.shift(this.left, this.right, 1, -1*delta);
					this.xPos = x;
				} else if ( delta > 5 ) {
					// if the finger moved to the right, activate the right arrow
					this.shift(this.right, this.left, -1, delta);
					this.xPos = x;
				}
			}
		},
		
		touchEnd: function(/*DOMEvent*/e) {
			// the user lifts a finger off the scroller
			this.xPos = false;
		},
		
		destroy: function() {
		}
	};
	
})(ibmwebkit);
