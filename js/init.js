;(function(iwk) {
	var protos = ibmUI.prototypes;
	// initialize the navigation UI element based on the theme configuration
	if( themeCfg.navigation.type === "scroller" ) {
		ibmUI.create(protos.scroller,				// create an instance of the scroller as a navigation element
					"theme-id-nav", 				// the id of the page navigation unordered list
					{								// initialization object
						content:"theme-page",		// the root id of the page content area
						outer:"theme-id-nav-outer",	// the id of the root outer div of the navigation
						inner:"theme-id-nav-inner",	// the id of the inner div of the navigation
						left:"theme-id-nav-left",	// the id of the left navigation link
						right:"theme-id-nav-right",	// the id of the right navigation link
						noneTxt: "(no pages)"		// text to display if there are no pages
					}
				);
	} else if ( themeCfg.navigation.type === "carousel" ) {
		ibmUI.create(protos.carousel, 				// create an instance of the carousel to use as a navigation element
					"theme-id-nav", 				// the id of the page navigation unordered list
					{								// initialization object
						content:"theme-page",		// the root id of the page content area
						outer:"theme-id-nav-outer",	// the id of the root outer div of the navigation
						inner:"theme-id-nav-inner",	// the id of the inner div of the navigation
						left:"theme-id-nav-left",	// the id of the left navigation link
						right:"theme-id-nav-right",	// the id of the right navigation link
						noneTxt: "(no pages)",		// text to display if there are no pages
						change: function(i) {		// change to the page which is in index i of the carousel items
							top.location.href = "?uri=nm:oid:" + this.items[i].id;
						}
					}
				);
	} else if ( themeCfg.navigation.type === "drilldown" ) {
		ibmUI.create(protos.drilldown,				// create an instance of the drilldown to use as a navigation element
					"theme-id-nav-outer",			// the id of the div surrounding the navigation unordered lists
					{
						onDrill: function() {		// set the height of the navigation div to the size of the navigation unordered list
							this.domNode.style.height = iwk.byId("theme-id-nav").offsetHeight + "px";
						}							// this is necessary because the navigation slider below sets a height on this.domNode so it must
					}								// be adjusted as the domNode is displaying different levels with varying numbers of children
				);
	}
	
	// initialize the UI element to toggle the masthead in and out of view if configured
	if( themeCfg.navigation.toggle === true ) {
		ibmUI.create(protos.slider,					// create an instance of the slider element
					"theme-id-toggle-nav", 			// the id of the link or button which will toggle the masthead
					{								// initialization object
						area:"theme-id-nav-outer"	// the id of the area to be toggled (the navigation)
					}
				);
	}

	// initialize the layout UI element based on the layout template assigned to the page
	if( themeCfg.layout.templateURI.indexOf("mobileCarousel") >= 0 ) {
		ibmUI.create(protos.carouselLayout, 			// create an instance of the carouselLayout layout
					"theme-id-layout", 					// the id of the layout navigation unordered list on the page
					{									// initialization object
						content:"theme-page",			// the root id of the page layout
						outer:"theme-id-layout-outer",	// the id of the root outer div of the navigation
						inner:"theme-id-layout-inner",	// the id of the inner div of the navigation
						left:"theme-id-layout-left",	// the id of the left navigation link
						right:"theme-id-layout-right"	// the id of the right navigation link
					}
				);
	} else if( themeCfg.layout.templateURI.indexOf("mobileSelect") >= 0 ) {
		var container = iwk.layout.getContainers()[0];
		ibmUI.create(protos.zoom, 								// create an instance of the zoom UI element as a layout
					"theme-page", 								// the id of the content area to tile
					{											// initialization object
						content:container,						// the main container for the layout
						items:iwk.layout.getControls(container),// the items for a tile layout should be the layout controls
						cls: "theme-tile-anim"
					}
				);
	} else if( themeCfg.layout.templateURI.indexOf("mobileAccordion") >= 0 ) {
		ibmUI.create(protos.accordionLayout, 		// create an instance of the accordionLayout layout
					themeCfg.layout.rootId, 		// the root id of the page layout
					{}								// empty initialization object
				);
	} else if( themeCfg.layout.templateURI.indexOf("mobileSwap") >= 0 ) {
		// Two elements are created here, a layout widget and a navigation widget
		// The latter tells the former to swap portlets when the user navigates
		// anim[ation] choices are theme-anim-fade, theme-anim-switch, or theme-anim-turn
		ibmUI.create(protos.swap, 							// create an instance of the swap to use as a layout
					themeCfg.layout.rootId, 				// the root id of the page layout
					{										// initialization object
						evt:"theme-content-layout-evt",		// the name of the event to subscribe
						anim:"theme-anim-fade",				// the name of the CSS3 animation class to use when swapping
						root:iwk.layout.getContainers()[0],	// a reference to the root layout container DOM node
						items:iwk.layout.getControls()		// a list of all the controls on the page to swap through
					}
				);
		ibmUI.create(protos.carousel, 					// create an instance of the carousel to navigate the layout
					"theme-id-layout", 					// the id of the layout navigation unordered list on the page
					{									// initialization object
						evt:"theme-content-layout-evt",	// the name of the event to publish when the user navigates, set this equal to the one subscribed to by the layout
						outer:"theme-id-layout-outer",	// the id of the root outer div of the navigation
						inner:"theme-id-layout-inner",	// the id of the inner div of the navigation
						left:"theme-id-layout-left",	// the id of the left navigation link
						right:"theme-id-layout-right",	// the id of the right navigation link
						change: function(i) {			// publish an event to tell the layout to swap controls to index i
							iwk.publish(this.evt, {next:i});
						}
					}
				);
	}
})(ibmwebkit);