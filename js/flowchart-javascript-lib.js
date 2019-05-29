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
			"sibling_name": "", // Parent uses this to draw a line with a sibling - children siblings unavailable at this time
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
		this.X;
		this.Y;
	}

	FlowchartArrayMember.prototype = {
		coordinates: function(x,y){
			this.X = x;
			this.Y = y;
		}
	};

	var flowchartData = {
		distanceX: 300,
		distanceY: 300,
		distanceChildY: 100,
		globalY: 0,
		parentStructure: [],
		objects: []
	};

	return {
		createFlowItem: function(obj){
			var flowItemObject;

			// if the object isn't empty
				//create a new array object
			if(flowchartData.objects.length > 0){
				flowItemObject = new FlowchartArrayMember(obj, 1);
			}else{
				flowItemObject = new FlowchartArrayMember(obj, 0);
			}

			flowchartData.objects.push(flowItemObject);

			return flowItemObject;
		},
		parentStructure: function(){
			var that = this,
				objStructure;

			//run through each object in the data and reassign their coordinates
			flowchartData.objects.forEach(function(e){
				if(e.parent !== "" && e.parent !== undefined){
					//child level
					objStructure = that.childObj(e);
					that.objectManipulate(objStructure);
				}else{
					if(e.sibling_name !== ""){
						// parent sibling
					}else{
						objStructure = that.parentObj(e);
						that.objectManipulate(objStructure);
					}
				}
			});
		},
		addToParentStructure: function(name, x, y){
			// take in name and add it to the flowchardata's parent structure
			// this is so we can begin incrementing furthest x and y values to store in the objects

			flowchartData.parentStructure[name] = {
				"y": y,
				"x": x
			};
		},
		parentObj: function(obj){
			var x, y;

			y = this.getXY(null, "y");
			x = 0;

			this.increaseGlobalY(flowchartData.distanceY);

			return {
				obj: obj,
				name: obj.name,
				x: x,
				y: y
			}
			
		},
		childObj: function(obj){
			var x, 
				y, 
				parentName = obj.parent;

			y = this.getXY(parentName, "y") + flowchartData.distanceChildY;
			x = this.getXY(parentName, "x");

			this.increaseGlobalY(flowchartData.distanceChildY);

			return {
				obj: obj,
				name: parentName,
				x: x,
				y: y
			}

		},
		objectManipulate: function(obj){
			var x = obj.x,
				y = obj.y;

			this.addToParentStructure(obj.name, x, y);
			obj.obj.coordinates(x, y);
		},
		getXY: function(parentName, dir){
			var direction = dir;
			var previous = parentName;

			if(previous == null){
				// x positioning based on 
				return flowchartData.globalY;
			}else{
				// new parent x positioning by the global direction
				return flowchartData.parentStructure[previous][direction];
			}
		},
		increaseGlobalY: function(d){
			var fData = flowchartData;
			fData.globalY = fData.globalY + d;
		},
		getObjects: function(){
			return flowchartData.objects;
		},
	}

})();



var flowchartUIController = (function(){

	var DOMStrings = {
		"canvasID": "flowchart-stage",
		"context": "2d",
		"parentSize": 75,
		"parent_font": "30px BentonSans",
		"child_font": "22px BentonSans",
		"paragraph_font": "14px BentonSans",
		"container": "150px",
		"line_color": "000000"
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
		drawToCanvas: function(canvas, obj, type){
			// Take the object and add it to the canvas based on type - object should have type / locations / name / etc
			var messageArray, 
				sentenceArray, 
				wordWidth,
				that = this,
				sentenceWidth = 0;

			// write title
			// write subtitle
			// write subtext (type, audience, overview, etc)

			// write message
			messageArray = obj.message.split(' ');
			messageArray.forEach(function(e){
				wordWidth = Math.floor(that.textWidth(canvas, e, "paragraph_font"));
				sentenceWidth = sentenceWidth + wordWidth;
				console.log(sentenceWidth);
			});

		},
		drawText: function(canvas, copy){
			// create method that counts every certain word and breaks the texts
		},
		textWidth: function(canvas_ref, txt, type){
			var copy = txt,
				text_width;
				
			canvas_ref.font = DOMStrings[type];
			text_width = canvas_ref.measureText(copy).width;

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
	var canvas, objectsToAdd;

	var loopData = function(flowchart){
		flowchart.forEach(function(e){
			if(e.parent_name == "" || e.parent_name == undefined){
				// console.log(e.text.title);
				//get text or image size - distinguish type for larger text
				objectsToAdd = UICon.objSize(canvas, e, "parent_font");
				//create flow item - add to object
				dCon.createFlowItem(objectsToAdd);
			}else{
				// Children
				//get text or image size - distinguiush type for larger text
				objectsToAdd = UICon.objSize(canvas, e, "child_font");
				//create flow item - add to object
				dCon.createFlowItem(objectsToAdd);
			}
		});
	};

	var parentStructure = function(){
		dCon.parentStructure();
	};

	var drawItems = function(){
		var objects = dCon.getObjects();
		objects.forEach(function(e){
			UICon.drawToCanvas(canvas, e);
		});
	};

	var canvasInit = function(){
		canvas = UICon.getCanvas().c_graph;
	};


	return {
		init: function(flowVar){
			canvasInit();
			loopData(flowVar);
			parentStructure();
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