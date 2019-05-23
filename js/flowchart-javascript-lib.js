// expects a canvas with a flowchart-stage id
// expects a object call after it with JSON and the following layout:
/*

	//As of now, the parent needs to be before the children
	// As of now, the first sibling needs to be before the second sibling
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
			"parent_name": "",
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

	var FlowchartArrayMember = function(obj, io){
		this.firstOrNot = io;
		this.name = obj.name;
		this.icon = obj.icon;
		this.level = obj.level;
		this.parent = obj.parent_name;
		this.section = obj.section;
		this.sibling_name = obj.sibling_name;
		this.title = obj.text.title;
		this.subtitle = obj.text.title;
		this.audience = obj.text.audience;
		this.email = obj.text.email;
		this.link = obj.text.link;
		this.message = obj.text.message;
		this.overview = obj.text.message;
		this.type = obj.text.type;
		this.unique_hex_color = obj.unique_hex_color;
		this.unique_hex_color_child = obj.unique_hex_color_child;
		this.img_width = obj.IMGWidth;
		this.text_width = obj.TextWidth;

		this.dataFlow();
	}

	FlowchartArrayMember.prototype = {
		dataFlow: function(){
			// If new tier parent get furthest Y get X position of its parent
			// If sibling parent get furthest X of it's sibling (parent) get Y position of sibling
			// Return its X and Y position

			var flowItemReturn;

			if(this.firstOrNot > 0){
				if(this.parent == ""){
					// -> If is a parent
					if(this.sibling_name !== ""){
						// -> If it is a parent and has a sibling
						// Make sure sibling exist
							// If not console an error of missing sibling name
						// Get Y of it's sibling
						// Get furthest x of it's sibling' child
					}else{
						// If it is a parent with no sibling
						// Get furthest X position
						// Y position is 0

					}
				}else{
					// -> Child element
					// -> Not a parent because it has a parent
					// Get furthest Y position of Parent
					// Get X Position of parent
				}
			}else{
				
			}
		}
	};

	var flowchartData = {
		positioning: {
			x:0,
			y:0
		},
		parentStructure: [

		],
		objs: []
	};

	return {
		createFlowItem: function(obj){
			var flowItemObject, parentStructureItems;

			if(flowchartData.parentStructure.length > 0){
				flowItemObject = new FlowchartArrayMember(obj, 1);
				parentStructureItems = this.pObj(flowItemObject.name, "second");
			}else{
				flowItemObject = new FlowchartArrayMember(obj, 0);
				parentStructureItems = this.pObj(flowItemObject.name, "first");
			}

			flowchartData.parentStructure.push(parentStructureItems);
			flowchartData.objs.push(flowItemObject);

			console.log(flowchartData.parentStructure);

			return flowItemObject;
		},
		pObj: function(name, type){
			// Get X position based on furthest X point
			// Get Y position based on furthest Y point
			if(type == "first"){
				var currentFlowItem = {
					"name": name,
					"posY": 0, 
					"posX": 0, 
					"furthestY": -1, 
					"furthestX": -1, 
					"children": []
				};
			}
			return currentFlowItem;
		},
		getDrawing: function(){

		}
	}

})();



var flowchartUIController = (function(){

	var DOMStrings = {
		"canvasID": "flowchart-stage",
		"context": "2d",
		"parentSize": 75,
		"parent_font": "30px BentonSans",
		"child_font": "22px BentonSans"
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
			var img = obj.icon;

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
				// if(type == 'parent'){
				// 	canvas_ref.font = "30px BentonSans";
				// 	canvas_ref.fillText(copy, 85, 50);
				// 	var text_width = this.canvas_ref.measureText(copy).width;
				// }else{
				// 	canvas_ref.font = "22px BentonSans";
				// 	canvas_ref.fillText(copy, 85, 50);
				// 	var text_width = canvas_ref.measureText(copy).width;
				// }
				// return text_width;
			};

		},
		textWidth: function(canvas_ref, txt, type){
			var copy = txt;
			if(type == 'parent'){
				canvas_ref.font = DOMStrings.parent_font;
				var text_width = canvas_ref.measureText(copy).width;
			}else{
				canvas_ref.font = DOMStrings.parent_font;
				var text_width = canvas_ref.measureText(copy).width;
			}
			return text_width;
		},
		objSize: function(canvas_ref, obj, type){
			var objTextWidth, objImageWidth;
			
			obj.TextWidth = this.textWidth(canvas_ref, obj.text.title, type);
			obj.IMGWidth = DOMStrings.parentSize;

			return obj;
		}
	}

})();





var flowchartAppController = (function(dCon, UICon){

	// var strings = UICon.getDOMstrings();
	var canvas, objToAdd;

	var loopData = function(flowchart){
		flowchart.forEach(function(e){
			if(e.parent_name == "" || e.parent_name == undefined){
				// console.log(e.text.title);
				objToAdd = UICon.objSize(canvas, e, "parent");
				dCon.createFlowItem(objToAdd);
			}else{
				// Children
			}
		});
	};

	var drawItems = function(){
		var mapItems = dCon.getDrawing();
		// Map items and draw to canvas
	};

	var canvasInit = function(){
		canvas = UICon.getCanvas().c_graph;
	};


	return {
		init: function(flowVar){
			canvasInit();
			loopData(flowVar);
			drawItems();
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