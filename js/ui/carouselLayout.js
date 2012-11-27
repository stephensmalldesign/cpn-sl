// A layout widget that shows one portlet at a time.  A carousel is used to navigation from one portlet to the previous or next on the page.
;(function(iwk) {
	
	// create a slide navigation UI prototype for the layout controls
	var layout = ibmUI.prototypes.carouselLayout = ibmUI.copy(ibmUI.prototypes.carousel);
	
	layout.onStart = function() {
		// set the width of the layout components to the page width 
		//		so controls can slide in and out of view
		var containers = iwk.layout.getContainers();
		var controls = iwk.layout.getControls();
		// the container must be wide enough to hold all the controls horizontally
		//		note there is only one container in a carousel layout template
		var containerW = this.content.offsetWidth * controls.length + "px";
		// the controls should be as wide as the content area
		var controlW = this.content.offsetWidth + "px";
		if(containers.length <= 0) {
			console.error("This page does not have a layout!");
			return;
		}
		// set the widths on the DOM nodes
		this.container = containers[0];
		this.container.style.width = containerW;
		for(var i = 0, l = controls.length; i < l; i++) {
			controls[i].style.width = controlW;
		}
	};
	
	layout.change = function(i) {
		// shift the content area to reveal a different control
		// i: the index of the control to show
		var w = this.content.offsetWidth;
		this.container.style.left = -1 * i * w + "px";
	};
	
	layout.noneTxt = "(no portlets)";
		
})(ibmwebkit);
