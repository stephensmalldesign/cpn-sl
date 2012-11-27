// A base accordion widget.  It takes an array of items to use as sections of the accordion.
;(function(iwk) {

    ibmUI.prototypes.accordion = {
        nodes: [],     		// array of nodes to toggle, each entry is an object {skin:DOMNode,body:DOMNode,handle:DOMNode},
							// where skin is the parent skin node, body is the control contents to toggle and handle is the node on which the onclick is attached
        multiOpen: true,	// Set this to true to allow more than one accordion section to be open
							// A false value means a single open section style accordion
				closeAllOnLoad: false, // Set this to true to have all sections closed after initail page load

        postCreate: function() {
            // Do not listen for changes until the setup is complete
            this.resizeSection.listen = false;

            // loop through all the nodes to set the click handlers
            this.nodes = this.getNodes();
            for( var i = 0, l = this.nodes.length; i < l; i++ ) {
                var section = this.nodes[i];

                // set the toggle click handler on the title for this section
                iwk.connect(section.handle, "onclick", this, "toggle", [i]);

        				// Close this section under certain conditions
        				// 1. If closeAllOnLoad is true
        				// 2. If closeAllOnLoad is false and this is not the first portal
        				// Under no condition should we close the portlet if its the only one on the page
        				if( l > 1 && (this.closeAllOnLoad || i > 0) )
        					this.close(section.skin);

                // set the original height on the body, this allows CSS3 height animations to function
                section.body.style.height = section.body.scrollHeight + "px";

                // set the change listener on the body for this section
                iwk.connect(section.body, "onDOMSubtreeModified", this, "resizeSection", [i]);
            }

						// remove the class that made the layout invisible during page load
						// this invisibility prevents all the portlets from flashing, full sized, on the screen
						var root = this.getRoot();
						iwk.removeClass(root, "theme-invisible");

						// set a CSS class on the root layout container if only one portlet is allowed to be open at a time
            if(!this.closeAllOnLoad && !this.multiOpen ) iwk.addClass(root, "theme-layout-accordion-noclose");

            // start listening for changes in the sections
            this.resizeSection.listen = true;

            this.onStart();
        },

        getNodes: function() {
            // stub for instances to fill out
            // returns nodes array
            return [];
        },

        getRoot: function() {
            // stub for instances to fill out
            // returns the root node of the accordion
            return null;
        },

        onStart: function() {
            // stub for instances to fill out
            return null;
        },

        toggle: function(/*int*/index) {
            // toggles the content area of the given section in or out of view
            var section = this.nodes[index];

            // node is closed, open it
            if( !this.isOpen(section.skin) ) {
								section.body.style.height = section.body.scrollHeight + "px";
                this.open(section.skin);

                // if only one section is allowed to be open, close all the other sections
                if ( !this.multiOpen ) {
                    for( var i = 0, l = this.nodes.length; i < l; i++ ) {
                        if( index !== i ) this.close(this.nodes[i].skin);
                    }
                }
            }  // node is open, close it
						else this.close(section.skin);
			  },

        isOpen: function(/*DOMNode*/n) {
						// returns true if the section is currently open
            return (!iwk.hasClass(n, themeCfg.css.closed));
        },

        open: function(/*DOMNode*/n) {
						// opens the given accordion section by removing the closed CSS class
            this.resizeSection.listen = false;
            iwk.removeClass(n, themeCfg.css.closed);
            this.resizeSection.listen = true;
        },

        close: function(/*DOMNode*/n) {
						// closes the given accordion section by adding the closed CSS class
            this.resizeSection.listen = false;
            iwk.addClass(n, themeCfg.css.closed);
            this.resizeSection.listen = true;
        },

        resizeSection: function(/*Event*/index) {
            // resize the accordion if the content changes
						// this is triggered when any of the control's or skin's markup is altered
            if ( this.resizeSection.listen ) { // if we are currently listening for changes
                this.resizeSection.listen = false;
                if ( index != null ) {
                    var section = this.nodes[index];
										section.body.style.height = section.body.scrollHeight + "px";
                }
                this.resizeSection.listen = true;
            }
        },

        destroy: function() {
            // destroy all the click handlers and skin object
            for( var i in this.nodes ) {
                this.nodes[i].body.onclick = null;
                delete this.nodes[i];
            }
        }
    };

})(ibmwebkit);