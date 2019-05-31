// expects a canvas with a flowchart-stage id
// expects a object call after it with JSON and the following layout:
// for now - this requires fabric.js
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
		this.isParent = obj.isParent;
		this.firstOrNot = io;
		this.name = obj.name;
		this.icon = obj.icon;
		this.level = obj.level;
		this.parent = obj.parent_name;
		this.section = obj.section;
		this.sibling_name = obj.sibling_name;
		this.title = obj.text.title;
		this.subtitle = obj.text.subtitle;
		this.audience = obj.text.audience;
		this.email = obj.text.email;
		this.link = obj.text.link;
		this.message = obj.text.message;
		this.overview = obj.text.overview;
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
		distanceX: 500,
		distanceY: 300,
		distanceChildY: 300,
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
		"context": "2d",
		"parentSize": 75,
		"parent_font": "22px BentonSans",
		"child_font": "18px BentonSans",
		"paragraph_font": "12px BentonSans",
		"container": 200, // container width for the content - by pixels
		"line_color": "000000",
	};

	var spacing = {
		"objectSpacing": 34,
		"headerSpacing": 25,
		"paragraphSpacing": 18
	};




	// Takes in canvas and font returns it based on container
	var paragraphToArray = function(canvas, p){

		var messageArray, 
			sentenceArray = [],
			sentenceTmp = "", 
			wordWidth,
			that = this,
			sentenceWidth = 0;

		messageArray = p.split(' ');

		// takes paragraph and breaks it apart into an array by container width
		messageArray.forEach(function(e){

			wordWidth = Math.floor(textWidth(canvas, e, "paragraph_font"));
			sentenceWidth = sentenceWidth + wordWidth;
			sentenceTmp += e + " ";

			if(DOMStrings.container <= sentenceWidth){
				sentenceArray.push(sentenceTmp);
				// clear out for next sentence
				sentenceTmp = "";
				sentenceWidth = 0;
			}

		});

		return sentenceArray;
	};


	var textWidth = function(canvas_ref, txt, type){
		var copy = txt,
			text_width;
			
		// canvas_ref.font = DOMStrings[type];
		// text_width = canvas_ref.measureText(copy).width;
		var text_width = new fabric.Text(copy);

		return text_width.width;
	};

	var objSize = function(canvas_ref, obj, type){
		var objTextWidth, objImageWidth;
		
		obj.TextWidth = textWidth(canvas_ref, obj.text.title, type);
		obj.IMGWidth = DOMStrings.parentSize;

		return obj;
	};

	var imgAdd = function(canvas_ref, imgUrl, posX, posY){

		fabric.Image.fromURL(imgUrl, function(img){
			img.set({
				'left': posX, 
				'top': posY
			});
			img.scaleToWidth(DOMStrings.parentSize);
			console.log(img);
			canvas_ref.add(img);
		});
		
	};

	var textAdd = function(canvas_ref, copy, fonts, x, y){
		var text = new fabric.Text(copy,{
			left: x,
			top: y
		});
		canvas_ref.add(text);
	};

	var writeMessageToCanvas = function(canvas_ref, message, x, y){
		pArray = paragraphToArray(canvas_ref, message);
		pArray.forEach(function(ob) {
			// Write ob to  canvas
			// maybe writeParagraph(ob, x, y)
		});
	};

	var renderCanvas = function(canvas_ref){
		canvas_ref.renderAll();
	};






	return {
		getDOMstrings: function(){
			return DOMStrings;
		},
		getCanvas: function(cID){
			
			var c = window.__canvas = new fabric.Canvas(cID),
				parent = document.getElementById(cID).parentElement.parentElement;
			c.pNode = parent;

			return {
				"c": c
			};
		},
		drawToCanvas: function(c, ob){

			var pArray,
				o = ob,
				X = o.X,
				Y = o.Y,
				fontX = X + o.img_width + spacing.objectSpacing,
				titleY = Y + ( spacing.objectSpacing * 1.5),
				subTitleY = titleY + spacing.headerSpacing,
				c1Y = subTitleY + spacing.objectSpacing,
				c2Y = c1Y + spacing.paragraphSpacing,
				c3Y = c2Y + spacing.paragraphSpacing;

			// write image
			this.drawImage(c, o.icon, o.X, o.Y);

			// write title
			this.drawText(c, o.title, DOMStrings["parent_font"], fontX, titleY);


			if(o.isParent){
				// don't attempt to write out a message if is a parent
			}else{
				// write subtitle
				this.drawText(c, o.subtitle, DOMStrings["child_font"], fontX, subTitleY);

				// write subtext (type, audience, overview, etc)
				this.drawText(c, "Overview: " + o.overview, DOMStrings["paragraph_font"], fontX, c1Y);
				this.drawText(c, "Audience: " + o.audience, DOMStrings["paragraph_font"], fontX, c2Y);
				this.drawText(c, "Method: " + o.type, DOMStrings["paragraph_font"], fontX, c3Y);

				//write message
				this.writeMessage(c, o.message, X, Y);
				
			}

		},
		writeMessage: function(c, m, x, y){
			writeMessageToCanvas(c, m, x, y);
		},
		drawText: function(c, co, f, x, y){
			// create method that counts every certain word and breaks the texts
			textAdd(c, co, f, x, y);
		},
		drawImage: function(c, i, x, y){
			imgAdd(c, i, x, y);
		},
		renderFabricCanvas: function(c){
			renderCanvas(c);
		},
		getObjSize(c, o, t){
			var objAddedDimensions;
			// get object size on canvas
			objAddedDimensions = objSize(c, o, t);

			return objAddedDimensions;
		}
	}

})();





var flowchartAppController = (function(dCon, UICon){

	// var strings = UICon.getDOMstrings();
	var canvas, objectsToAdd;

	var loopData = function(flowchart){
		flowchart.forEach(function(e){
			if(e.parent_name == "" || e.parent_name == undefined){
				//get text or image size - distinguish type for larger text
				objectsToAdd = UICon.getObjSize(canvas, e, "parent_font");
				objectsToAdd.isParent = true;
				//create flow item - add to object
				dCon.createFlowItem(objectsToAdd);
			}else{
				// Children
				//get text or image size - distinguiush type for larger text
				objectsToAdd = UICon.getObjSize(canvas, e, "child_font");
				objectsToAdd.isParent = false;
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

	var canvasInit = function(id){
		var canvasInitializedReturn = UICon.getCanvas(id),
			c = canvasInitializedReturn.c;
		canvas = c;

		if(c == null){
			alert("Your browser does not support this tool.");
		}

		c.parent = c.pNode;
		c.setWidth(c.pNode.offsetWidth);
		c.setHeight(c.pNode.offsetHeight);
		fabric.Object.prototype.objectCaching = true;
	};

	var renderCanvas = function(){
		UICon.renderFabricCanvas(canvas);
	};


	return {
		init: function(id, flowVar){
			canvasInit(id);
			loopData(flowVar);
			parentStructure();
			drawItems();
			renderCanvas();
		},
		addParent: function(){

		},
		addChild: function(){

		}
	}

})(flowchartDataController, flowchartUIController);



window.onload = function(){
	flowchartAppController.init("flowchart-stage", flowchartStage);
}