// expects a canvas with a flowchart-stage id
// expects a object call after it with JSON and the following layout:
/*


	flowchart([
		{
			"name": "", // needs to be unique with underscores
			"text": {
				"title": "",
				"subtitle": "",
				"topic": "",
				"audience": "",
				"overview": "",
				"link": "", // if need to link the whole box
				"message": "",
				"email": "" // url of email
			}
			"parent_name": {
				"p_1": "" //needs to be the unique name of the parent icon - if not found will display as it's own landmark under the section it's labelled under - theoretically can be infinitel ist
			}, // what it will be dependant on
			"sibling_name": "", // Parent uses this to draw a line with a sibling
			"section": {
				"name": ""
			}, // This is how you assign this to different sections. If empty and no parent, it becomes a section. If a parent 1 is listed and this isn't then p_1 becomes the section
			"level": "", // This is only for a parent. This forces an object to 
			"icon_name": "", // needs to be in the filing system
			"unique_hex_color": "", // this is the RGB of the line leading to it - ONLY UTELIZED IF IT IS A PARENT
			"unique_hex_color_child": "" // this will override rgb color of the parent line
		},
		{
			"name": "",
			"text": {
				"title": "Sophmore",
				"subtitle": "",
				"topic": "",
				"audience": "",
				"overview": "",
				"link": "",
				"message": "",
				"email": ""
			}
			"parent_name": {
				"p1": ""
			},
			"sibling_name": "",
			"section": {
				"name": ""
			},
			"level": "",
			"icon_name": "",
			"unique_hex_color": "",
			"unique_hex_color_child": ""
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