// A layout widget that shows each portlet as a section of an accordion.
;(function(iwk) {

    // create an accordian layout UI prototype
    var layout = ibmUI.prototypes.accordionLayout = ibmUI.copy(ibmUI.prototypes.accordion);

    layout.getRoot = function() {
        // return the root layout container
        return iwk.layout.getContainers()[0];
    };

    layout.getNodes = function() {
        // compile an array of all the layout controls
        var ret = [];
        // gather all the layout controls
        var controls = iwk.layout.getControls();

        // loop through the containers to find the title and body of each acordion section
        for( var i = 0, cl = controls.length; i < cl; i++ ) {
            // find the relevant nodes for the accordion section
            var skin = controls[i].querySelector('[data-container="true"]');
            var title = controls[i].querySelector('[data-title="true"]');
            var body = controls[i].querySelector('[data-container-body="true"]');

            // add this accordion section to the node list for the layout
            var section = { skin:skin, handle:title, body:body };
            ret.push(section);
        }
        return ret;
    };

})(ibmwebkit);