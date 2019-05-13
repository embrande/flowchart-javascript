// expects a canvas with a flowchart-stage id
// expects a object call after it with JSON and the following layout:
/*


	flowchart([
		{
			"name": "", // needs to be unique with underscores
			"text": {
				"title": "",
				"subtitle": "",
				"link": "", // if need to link the whole box
				"body": "",
				"email": "" // url of email
			}
			"parent_name": {
				"p_1": "" //needs to be the unique name of the parent icon - if not found will display as it's own landmark under the section it's labelled under - theoretically can be infinitel ist
			}, // what it will be dependant on
			"section": {
				"name": ""
			}, // This is how you assign this to different sections. If empty, it becomes the section
			"icon_name": "", // needs to be in the filing system
			"unique_rgb_color": "", // this is the RGB of the line leading to it - ONLY UTELIZED IF IT IS A PARENT
			"unique_rgb_color_child": "" // this will override rgb color of the parent line
		}
	]);



*/



var flowchartDataController = (function(){



});



var flowchartUIController = (function(){

});





var flowchartAppController = (function(dCon, UICon){


	return {
		init: function(){

		}
	}

})(flowchartDataController, flowchartUIController);