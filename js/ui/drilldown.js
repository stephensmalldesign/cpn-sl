// A base nested drilldown widget.  Here ULs are the tree nodes and their LIs are the tree node items:
// <ul>  LEVEL 1 tree node
//		<li></li>
//			<ul>  LEVEL 2 tree node
//				<li></li>
//				<li>
//					<ul>  LEVEL 3 tree node
//						<li></li>
//						<li></li>
//					</ul>
//				</li>
//				<li>
//					<ul>  another LEVEL 3 tree node on a different branch
//						<li></li>
//						<li></li>
//					</ul>
//				</li>
//			</ul>
//		<li></li>
// </ul>
;(function(iwk) {

	ibmUI.prototypes.drilldown = {
		levels: {},					// associative array of page ids and the DOM that holds that page's children
		curLevel: 0,				// the id of the level currently being displayed
		levelSel: "data-tree-level",// query selector on each tree level
		itemSel: "data-tree-swap",	// query selector on each tree node item
		onCls: "theme-selected",	// CSS class to put on the level currently showing
		offCls: "theme-hidden",		// CSS class to put on all other levels which are hidden
		
		postCreate: function() {
			// find all of the tree levels, often a UL element
			var nodes = this.domNode.querySelectorAll( '[' + this.levelSel + ']' );
			
			// find all of the items which drill either up or down, often a LI element
			var items = this.domNode.querySelectorAll( '[' + this.itemSel + ']' );
			
			// create an associative array between page ids and the DOM for that
			// page's children by looping through the level DOM elements
			// while looping, find the currently selected level by identifying 
			// the node that contains the onCls
			for( var i = 0, l = nodes.length; i < l; i++ ) {
				// store the level
				var id = nodes[i].getAttribute(this.levelSel);
				this.levels[id] = nodes[i];
				// is this the current level?
				if( iwk.hasClass(nodes[i], this.onCls) ) {
					this.curLevel = id;
				}
			}
			
			// put an onclick handler to change the current level of the drilldown by looping
			// through all the tree items that have a itemSel attribute
			// the itemSel attribute holds the id of the page/level to switch to
			for( var i = 0, l = items.length; i < l; i++ ) {
				var id = items[i].getAttribute(this.itemSel);
				iwk.connect(items[i], "onclick", this, "drill", [id]);
			}
		},
		
		drill: function(id) {
			// drill up or down to a new level
			// id: the id of the level to go to
			// hide the current level
			this.toggle(this.curLevel, true);
			// show the new level
			this.toggle(id, false);
			// set the new current level
			this.curLevel = id;
			// run the onDrill call-out
			this.onDrill();
		},
		
		onDrill: function() {
			// stub to be called whenever the drill function is ran
		},
		
		toggle: function(id, out) {
			// hides a level
			// id: the level to hide
			// out: true if the level should drill out, 
			//		false to drill into that level
			var node = this.levels[id];
			iwk.removeClass(node, out ? this.onCls : this.offCls);
			iwk.addClass(node, out ? this.offCls : this.onCls);
		},
		
		destroy: function() {
		}
	};
	
})(ibmwebkit);