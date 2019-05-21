// expects a canvas with a flowchart-stage id
// expects a object call after it with JSON and the following layout:
/*

	//As of now, the parent needs to be before the children
	flowchart([
		{
			"name": "", // needs to be unique with underscores
			"text": {
				"title": "", // Parent uses this as it's label
				"subtitle": "",
				"type": "",
				"audience": "",
				"overview": "", // Message overview or parent description
				"link": "", // if need to link the whole box
				"message": "",
				"email": "" // url of email
			},
			"parent_name": {
				"p_1": "" //needs to be the unique name of the parent icon - if not found will display as it's own landmark under the section it's labelled under - theoretically can be infinitel ist
			}, // what it will be dependant on
			"sibling_name": "", // Parent uses this to draw a line with a sibling
			"section": {
				"name": ""
			}, // This is how you assign this to different sections. If empty and no parent, it becomes a section. If a parent 1 is listed and this isn't then p_1 becomes the section
			"level": "", // This is only for a parent - will be ignored if a parent is defined. This forces an object to be on a specific level. Naturally new parents go on a new level
			"icon": "", // needs to be in the filing system
			"unique_hex_color": "", // this is the RGB of the line leading to it - ONLY UTELIZED IF IT IS A PARENT
			"unique_hex_color_child": "" // this will override rgb color of the parent line
		},
		{
			"name": "",
			"text": {
				"title": "",
				"subtitle": "",
				"type": "",
				"audience": "",
				"overview": "",
				"link": "",
				"message": "",
				"email": ""
			},
			"parent_name": {
				"p1": ""
			},
			"sibling_name": "",
			"section": {
				"name": ""
			},
			"level": "",
			"icon": "",
			"unique_hex_color": "",
			"unique_hex_color_child": ""
		}
	]);



*/



var flowchartDataController = (function(){

	var FlowchartArrayMember = function(){
		// Define based on a parent system
	}

	var flowchartData = {
		positioning: {
			x:0,
			y:0
		},
		parentStructure: [

		]
	};

	return {
		furthestXPoint: function(){

		},
		furthestYPoint: function(){

		},
		measureNewX: function(){

		},
		measureNewY: function(){

		},
		pObj: function(name){
			// Get X position based on furthest X point
			// Get Y position based on furthest Y point
			var currentFlowItem = {"name": name, "posY": 0, "posX": 0, "children": []};
			flowchartData.parentStructure.push(currentFlowItem);
			return currentFlowItem;
		}
	}

})();



var flowchartUIController = (function(){

	var DOMStrings = {
		"canvasID": "flowchart-stage",
		"context": "2d",
		"parentSize": 75
	};

	return {
		getDOMstrings: function(){
			return DOMStrings;
		},
		getCanvas: function(){
			var c = document.getElementById(DOMStrings.canvasID),
				c_graph = c.getContext(DOMStrings.context);

			return {
				"c": c,
				"c_graph": c_graph
			};
		},
		addParent: function(canvas, obj){
			var img = obj.img;

			var imgAdded = (function(canvas, imgUrl, posY, posX){
				var img = new Image();
					img.src = imgUrl;
					img.canvas_ref = canvas;
				img.onload = function(e){
					/***

						Replace below with x and y positions once I have that in the OBJ

					****/
					canvas.drawImage(img, 10, 0, DOMStrings.parentSize, DOMStrings.parentSize);
				}
				
			})(canvas, img);

		},
		addChild: function(canvas, obj, parent){

		},
		addToCanvas: function(canvas, obj, type){
			// Take the object and add it to the canvas based on type - object should have type / locations / name / etc
			

			var addText = function(canvas_ref, type){
				if(type == 'parent'){
					canvas_ref.font = "30px BentonSans";
					canvas_ref.fillText(copy, 85, 50);
					var text_width = this.canvas_ref.measureText(copy).width;
				}else{
					canvas_ref.font = "22px BentonSans";
					canvas_ref.fillText(copy, 85, 50);
					var text_width = canvas_ref.measureText(copy).width;
				}
				return text_width;
			};

		}
	}

})();





var flowchartAppController = (function(dCon, UICon){

	// var strings = UICon.getDOMstrings();
	var canvas, objToAdd;

	var loopData = function(flowchart){
		flowchart.forEach(function(e){
			if(e.parent_name.p1 == "" || e.parent_name.p1 == undefined){
				// Parents
				// Measure new location of parent - store furthest x and y
				// Add parent to canvas based on sibling
				// objToAdd = dCon.pObj(e.name);
				UICon.addParent(canvas, e.icon);
			}else{
				// Children
			}
		});
	};

	var canvasInit = function(){
		canvas = UICon.getCanvas().c_graph;
	}


	return {
		init: function(flowVar){
			canvasInit();
			loopData(flowVar);
		},
		addParent: function(){

		},
		addChild: function(){

		}
	}

})(flowchartDataController, flowchartUIController);



window.onload = function(){
	flowchartAppController.init(flowchartStage);
}