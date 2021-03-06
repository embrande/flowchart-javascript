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



/*

	Check-list:
		
		Line color

		Allow a description on parent / sibling object

		Move around location of page UI

		Email style support (remove native styling and prefer imported html's style)

		Key of table's emblems and line items

		Table of content location click
			key press support
			TOC text press

		Filter flowchart



		Accessibility support

*/


var flowchartDataController = (function(){

	var FlowchartArrayMember = function(obj, io){
		this.firstOrNot = io;
		this.name = obj.name;
		this.icon = obj.icon;
		this.icon_width = obj.IMGWidth;
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
		},
		pinpoints: function(type){
			//creates pinpoints of middle of each side of the icon for line drawing
			var icon_half = this.icon_width / 2;
			var icon_buffer = 25;

			this.pinpoint = {};
				this.pinpoint.top = {};
					this.pinpoint.top.x = this.X + icon_half;
					this.pinpoint.top.y = this.Y - icon_buffer;
				this.pinpoint.left = {};
					this.pinpoint.left.x = this.X - icon_buffer;
					this.pinpoint.left.y = this.Y + icon_half;
				this.pinpoint.right = {};
					this.pinpoint.right.x = this.X + this.icon_width + icon_buffer;
					this.pinpoint.right.y = this.Y + icon_half;
				this.pinpoint.bottom = {};
					this.pinpoint.bottom.x = this.X + icon_half;
					this.pinpoint.bottom.y = this.Y + this.icon_width + icon_buffer;
		},
		currentPinpoints: function(x, y, type){
			var icon_half = this.icon_width / 2;
			this.currPin = {};

			if(type == "child"){
				this.currPin.x = x;
				this.currPin.y = y;
			}else if(type == "sibling"){
				this.currPin.x = x;
				this.currPin.y = y;
			}
		},
		previousPinpoint: function(x, y, type){
			var icon_half = this.icon_width / 2;

			this.prevPin = {};

			if(type == "child"){
				this.prevPin.x = x;
				this.prevPin.y = y;
			}else if(type == "sibling"){
				this.prevPin.x = x;
				this.prevPin.y = y;
			}
		}
	};

	var flowchartData = {
		distanceX: 1000,
		distanceY: 350,
		distanceChildY: 450,
		distanceParentY: 200,
		globalY: 50,
		globalX: 50,
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
				objFeatures;

			//run through each object in the data and reassign their coordinates
			flowchartData.objects.forEach(function(e){
				if(e.parent !== "" && e.parent !== undefined){
					//child level
					objFeatures = that.childObj(e);
					that.parentStructureCombine(e, objFeatures);
					that.increaseParentY(e.parent);

					// set pinpoints for drawing
					var prevName = that.lookForParentPrevName(e.parent, "pName");
					that.setParentPrevName(e.parent, e.name, "pName");
					that.previousXYForPreviousPinpoint(
						e, prevName, "child", "bx", "by"
					);
					that.currentXYForPinpoints(
						e, "child", "tx", "ty"
					);
				}else{
					if(e.sibling_name !== ""){

						// parent sibling structure
						objFeatures = that.siblingObj(e);
						that.parentStructureCombine(e, objFeatures);
						that.increaseSiblingX(e.sibling_name);

						// set pinpoints for drawing
						var prevName = that.lookForParentPrevName(e.sibling_name, "prevName");
						that.setParentPrevName(e.sibling_name, e.name, "prevName");
						that.previousXYForPreviousPinpoint(
							e, prevName, "sibling", "rx", "ry"
						);
						that.currentXYForPinpoints(
							e, "sibling", "lx", "ly"
						);
					}else{
						objFeatures = that.parentObj(e);
						that.parentStructureCombine(e, objFeatures);
					}
				}
			});
		},
		lookForParentPrevName: function(parentName, methodName){
			// get parent
			// return parent parentLowestChild name
			var returnParent = flowchartData.parentStructure[parentName][methodName];
			return returnParent;
		},
		setParentPrevName: function(parent, newPrev, methodName){
			// take parent in parent structure and set objPrevName to the current name
			flowchartData.parentStructure[parent][methodName] = newPrev;
		}, 
		parentStructureCombine: function(e, objFeatures){
			// Creates XY coordinates
			// Adds pinpoints to object image for line drawing
			// Adds to parent structure

			this.objectManipulate(e, objFeatures.x, objFeatures.y);
			var lrbtObject = this.lrbt(e, objFeatures.px, objFeatures.py, objFeatures.objPName, objFeatures.objPrevName);
			this.addToParentStructure(lrbtObject);
		},
		addToParentStructure: function(obj){
			// take in name and add it to the flowchardata's parent structure
			// this is so we can begin incrementing furthest x and y values to store in the objects
			
			var name = obj["name"],
				thisObj = obj;

			// flowchartData.parentStructure[name] = {};
			if(!flowchartData.parentStructure.hasOwnProperty(name)){
				flowchartData.parentStructure[name] = {};
			}
			delete thisObj.name;

			for(key in thisObj){
				flowchartData.parentStructure[name][key] = obj[key]; 
			}
		},
		previousXYForPreviousPinpoint: function(e, parent, type, x, y){
			var parentX = flowchartData.parentStructure[parent][x],
				parentY = flowchartData.parentStructure[parent][y];
			this.prevPin(e, parentX, parentY, type);
		},
		currentXYForPinpoints: function(e, type, x, y){
			var X = flowchartData.parentStructure[e.name][x],
				Y = flowchartData.parentStructure[e.name][y];
			e.currentPinpoints(X, Y, type);
		},
		parentObj: function(obj){
			var x, y,
				objName = obj.name;

			y = flowchartData.globalY;
			x = flowchartData.globalX;
			py = y + flowchartData.distanceParentY;
			px = x + flowchartData.distanceX;

			flowchartData.globalY = this.increaseY(flowchartData.globalY, flowchartData.distanceParentY);

			return {
				name: objName,
				objPName: objName, // parent name
				objPrevName: objName,
				x: x,
				y: y,
				py: py,
				px: px
			}
			
		},
		siblingObj: function(obj){
			var x, y,
				objName = obj.name,
				siblingName = obj.sibling_name;

			y = this.getXY(siblingName, "y");
			x = this.getXY(siblingName, "px");
			py = y + flowchartData.distanceParentY;

			if(y > flowchartData.globalY){
				flowchartData.globalY = this.increaseY(flowchartData.globalY, flowchartData.distanceParentY);
			}

			return {
				name: objName,
				objPName: objName, // parent name
				objPrevName: objName, // previous name
				x: x,
				y: y,
				py: py
			}
		},
		childObj: function(obj){
			var x, 
				y, 
				objName = obj.name,
				parentName = obj.parent;

			y = this.getXY(parentName, "py");
			x = this.getXY(parentName, "x");

			if(y >= flowchartData.globalY){
				flowchartData.globalY = this.increaseY(flowchartData.globalY, flowchartData.distanceChildY);
			}else{
				// console.log(obj.name + "'s Y is not larger than the globalY");
			}

			return {
				name: objName,
				objPName: objName, // parent name
				objPrevName: objName,
				x: x,
				y: y
			}

		},
		lrbt: function(e, objPx, objPy, objPName, objPrevName){
			return {
				name: e.name,
				x: e.X,
				y: e.Y,
				px: objPx,
				py: objPy,
				pName: objPName,// parent name
				prevName: objPrevName,
				tx: e.pinpoint.top.x,
				ty: e.pinpoint.top.y,
				rx: e.pinpoint.right.x,
				ry: e.pinpoint.right.y,
				bx: e.pinpoint.bottom.x,
				by: e.pinpoint.bottom.y,
				lx: e.pinpoint.left.x,
				ly: e.pinpoint.left.y
			}
		},
		increaseParentY: function(p){
			var parent = p;
			flowchartData.parentStructure[parent]["py"] = flowchartData.parentStructure[parent]["py"] + flowchartData.distanceChildY;
		},
		increaseSiblingX: function(s){
			var sibling = s;
			flowchartData.parentStructure[sibling]["px"] = flowchartData.parentStructure[sibling]["px"] + flowchartData.distanceX;
		},
		objectManipulate: function(obj, x, y){
			obj.coordinates(x, y);
			obj.pinpoints();
		},
		prevPin: function(e, x, y, type){
			e.previousPinpoint(x, y, type);
		},
		getXY: function(parentName, dir){

			// If parentName is null - outputs global Y
			// If a child - outputs the direction of X or Y based on it's added x or y in the heirarchy

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
		increaseY: function(y, d){
			y = y + d;
			return y;
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
		"parent_font": "BentonSans",
		"parent_font_size": 56,
		"child_title_font": "BentonSans",
		"child_title_size": 24,
		"child_font": "BentonSans",
		"child_font_size": 18,
		"paragraph_font": "BentonSans",
		"paragraph_font_size": 12,
		"container": 300, // container width for the content - by pixels
		"line_color": "000000",
		"stroke": 5
	};

	var spacing = {
		"objectSpacing": 34,
		"headerSpacing": 25,
		"paragraphSpacing": 18
	};

	var drag = {
		bool:false
	};

	var menus = [];




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

			wordWidth = Math.floor(textWidth(canvas, e, DOMStrings['paragraph_font_size'], DOMStrings['paragraph_font']));
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


	var textWidth = function(canvas_ref, txt, fontSize, type){
		var copy = txt,
			text_width;
			
		// canvas_ref.font = DOMStrings[type];
		// text_width = canvas_ref.measureText(copy).width;
		var text_width = new fabric.Text(copy, {
			'fontSize': fontSize
		});
		return text_width.width;
	};

	var objSize = function(canvas_ref, obj, fontSize, type){
		var objTextWidth, objImageWidth;
		
		obj.TextWidth = textWidth(canvas_ref, obj.text.title, DOMStrings[fontSize], type);
		obj.IMGWidth = DOMStrings.parentSize;

		return obj;
	};

	var imgAdd = function(canvas_ref, imgUrl, posX, posY){

		fabric.Image.fromURL(imgUrl, function(img){
			img.set({
				'left': posX, 
				'top': posY,
				'lockMovementX': true,
				'lockMovementY': true,
				'lockScalingX': true,
				'lockScalingY': true,
				'lockRotation': true,
				'hasControls': false,
				'hasBorders': false,
				'selectable': false,
				'hoverCursor': 'arrow'
			});
			img.scaleToWidth(DOMStrings.parentSize);

			canvas_ref.add(img);
		});
		
	};

	var textAdd = function(canvas_ref, copy, fontsFamily, fonts, x, y, parentOrNot){
		var text = new fabric.Text(copy,{
			'left': x,
			'top': y,
			'fontSize': fonts,
			'lockMovementX': true,
			'lockMovementY': true,
			'lockScalingX': true,
			'lockScalingY': true,
			'lockRotation': true,
			'hasControls': false,
			'hasBorders': false,
			'selectable': false,
			'hoverCursor': 'arrow'
		});

		if(parentOrNot){
			text.isParent = parentOrNot;
		}

		canvas_ref.add(text);
	};

	var textAddSelectable = function(canvas_ref, copy, link, fontsFamily, fonts, x, y, email){
		var text = new fabric.Text(copy,{
			'left': x,
			'top': y,
			'fontSize': fonts,
			'lockMovementX': true,
			'lockMovementY': true,
			'lockScalingX': true,
			'lockScalingY': true,
			'lockRotation': true,
			'hasControls': false,
			'hasBorders': false,
			'selectable': true, 
			'font-family': "BentonSans",
			'underline': true,
			'hoverCursor': 'pointer'
		});

		text.on('selected', function(){
			// following relys on jquery and lightweight javascript
			$.featherlight(link, {

			});

			canvas_ref.discardActiveObject();
		});

		canvas_ref.add(text);
	};

	var writeMessageToCanvas = function(canvas_ref, message, link, x, y){
		var pArray = paragraphToArray(canvas_ref, message);
		var ySpacing = y;
		var overflow = false;

		pArray.forEach(function(ob) {
			// Write ob to  canvas
			// maybe writeParagraph(ob, x, y)
			if((ySpacing - y) <= (DOMStrings['container'] / 2)){
				textAdd(canvas_ref, ob, DOMStrings['paragraph_font'], DOMStrings['paragraph_font_size'], x, ySpacing);
				ySpacing = ySpacing + spacing['paragraphSpacing'];
			}else{
				overflow = true;
			}
		});

		if(overflow === true){
			textAdd(canvas_ref, "...", DOMStrings['paragraph_font'], DOMStrings['paragraph_font_size'], x, ySpacing);
				
		}

		ySpacing = ySpacing + spacing['paragraphSpacing'];
		textAddSelectable(canvas_ref, "See message", link, DOMStrings['paragraph_font'], DOMStrings['child_font_size'], x, ySpacing);
	};

	var linesToCanvas = function(c, px, py, cx, cy){

		var line = makeLine([px,py,cx,cy]);
		c.add(line);

		var circle1 = new fabric.Circle({
			radius: 15,
			fill: '#4FC3F7',
			left: cx - 15,
			top: cy - 15,
			opacity: 0.7,
			stroke: 'blue',
			strokeWidth: 3,
			strokeUniform: true,
			selectable: false,
			'hoverCursor': 'arrow'
		});

		var circle2 = new fabric.Circle({
			radius: 15,
			fill: '#4FC3F7',
			left: px - 15,
			top: py - 15,
			opacity: 0.7,
			stroke: 'blue',
			strokeWidth: 3,
			strokeUniform: true,
			selectable: false,
			'hoverCursor': 'arrow'
		});

		c.add(circle1);
		c.add(circle2);


		function makeLine(coords){
			return new fabric.Line(coords, {
				fill: DOMStrings.line_color,
				stroke: DOMStrings.line_color,
				strokeWidth: DOMStrings.stroke,
				selectable: false,
				evented: false
			});
		}
	};

	var renderCanvas = function(canvas_ref){
		canvas_ref.renderAll();
	};

	var zInandO = function(canvas, opt){
		var delta = opt.e.deltaY;
		var pointer = canvas.getPointer(opt.e);
		var zoom = canvas.getZoom();

		zoom = zoom + delta/200;

		if (zoom > 10){zoom = 10}
		if (zoom < 0.4){zoom = .4}
		canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
		opt.e.preventDefault();
		opt.e.stopPropagation();
	};


	var mMove = function(canvas, event, eventThis){
		var e = event.e;
		if(drag.bool == true){
			eventThis.viewportTransform[4] += e.clientX - eventThis.lastPosX;
			eventThis.viewportTransform[5] += e.clientY - eventThis.lastPosY;
			eventThis.requestRenderAll();
			eventThis.lastPosX = e.clientX;
			eventThis.lastPosY = e.clientY;

			var zoom = canvas.getZoom();

			canvas.zoomToPoint({
				x: event.e.offsetX,
				y: event.e.offsetY
			}, zoom);

			event.e.preventDefault();
			event.e.stopPropagation();
		}
	};

	var reset = function(canvas){
		canvas.viewportTransform[4] = 50;
		canvas.viewportTransform[5] = 50;
		canvas.zoomToPoint({
			x: 0,
			y: 0
		}, 1.0); 
	};

	var mBarContainer = function(can, dir){
		// var menuItem = "<div id='canvas-menu-" + dir + "'><div>Menu</div</div>";
		// var menuAccess = document.createElement('nav');
		// 	menuAccess.setAttribute('aria-labelledby', 'mainMenuLabel');
		// var menuLabel = document.createElement('h2');
		// 	menuLabel.id = "mainMenuLabel";
		// 	menuLabel.innerHTML = "Interactive timeline navigation";
		// 	menuLabel.classList.add('visuallyHidden');
		var menuContainer = document.createElement('div');
			menuContainer.classList.add("canvas-menu-" + dir);
			menuContainer.classList.add("canvas-menu-container");
			menuContainer.classList.add("canvas-menu-closed");
		var menuButtonContainer = document.createElement('div');
			menuButtonContainer.id = "canvas-menu-button";
		var menuButtonInner = document.createElement('button');
			menuButtonInner.innerHTML = "&equiv;";
			menuButtonInner.classList.add("canvas-menu-button-inner");
		var menuUL = document.createElement('ul');
			menuUL.classList.add('canvas-menu-ul');
			var menuLIReset = document.createElement('li');
				var menuLIResetAHref = document.createElement('a');
				menuLIResetAHref.innerHTML = 'Reset';
				menuLIReset.append(menuLIResetAHref);
			var menuLIMenu = document.createElement('li');
				var menuLIMenuAHref = document.createElement('a');
				menuLIMenuAHref.innerHTML = 'Menu';
				menuLIMenu.append(menuLIMenuAHref);
		
		menuUL.append(menuLIMenu);
		menuUL.append(menuLIReset);

		menuContainer.append(menuUL);
		menuButtonContainer.append(menuButtonInner);
		menuContainer.append(menuButtonContainer);

		menuLIResetAHref.addEventListener('click', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();
			reset(can);
		});
		menuLIMenuAHref.addEventListener('click', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();
			menuFunc(menuLIMenu, can);
		});

		menuButtonInner.addEventListener('click', function(e){
			this.parentNode.parentNode.classList.toggle('canvas-menu-closed');
		});

		parent = document.getElementById(can.pNode.id);
		parent.insertAdjacentElement('beforeend', menuContainer);
	};

	var menuFunc = function(menuObj, can){

		var subMenu = document.createElement("ul");
			subMenu.id = ("menuSubMenu");
		for(var i in menus){
			var subMenuLi = document.createElement("li");
				var subMenuA = document.createElement("a");
					subMenuA.alt = "Menu option: " + i;
				//parent name
 				subMenuA.innerHTML = menus[i][0]["name"];
			var subSubMenu = document.createElement("ul");
			subMenuA.addEventListener('click', function(e){
				e.preventDefault();
				e.stopImmediatePropagation();
				subMenuFunc(this.innerHTML, can);
			});
			subMenuLi.append(subMenuA);
			subMenu.append(subMenuLi);
			for(var ii = 1; ii < menus[i].length; ii++){
				var subSubMenuLi = document.createElement("li");
				var subSubMenuA = document.createElement('a');
					subSubMenuA.alt = "Sub menu option - " + menus[i][ii]["name"];
					subSubMenuA.innerHTML = menus[i][ii]["name"];

				subSubMenuA.addEventListener('click', function(e){
					e.preventDefault();
					e.stopImmediatePropagation();
					subMenuFunc(this.innerHTML, can);
				});

				subSubMenuLi.append(subSubMenuA);
				subSubMenu.append(subSubMenuLi);
				subMenuLi.append(subSubMenu);
			}
		}

		menuObj.append(subMenu);
	};

	var subMenuFunc = function(textCopy, can){
		var parents = can._objects.filter(word => word.isParent != undefined);
		var selected = parents.filter(parent => parent.text === textCopy);
		
		console.log(can.zoomToPoint);
		
		can.viewportTransform[4] = -(selected[0].left) + 200;
		can.viewportTransform[5] = -(selected[0].top) + 200;
		can.zoomToPoint({
			x: -(selected[0].left) + 200,
			y: -(selected[0].top) + 200
		}, 1.0); 
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
				c3Y = c2Y + spacing.paragraphSpacing,
				c4Y = c3Y + spacing.paragraphSpacing;

			// write image
			this.drawImage(c, o.icon, o.X, o.Y);

			if(o.parent == ""){
				// don't attempt to write out a message if is a parent// write subtitle
				// write title
				this.drawText(c, o.title, DOMStrings["parent_font"], DOMStrings["parent_font_size"], fontX, titleY, true);


				// create parent and sibling structure for menu
				if(o.sibling_name == ""){
					menus[o.name] = [];
					menus[o.name].push({name: o.title, type: "parent"});
				}else{
					menus[o.sibling_name].push({name: o.title, type: "sibling"});

				}


			}else{
				// write title
				this.drawText(c, o.title, DOMStrings["child_title_font"], DOMStrings["child_title_size"], fontX, titleY, false);

				// write subtitle
				this.drawText(c, o.subtitle, DOMStrings["child_font"], DOMStrings["child_font_size"], fontX, subTitleY, false);

				// write subtext (type, audience, overview, etc)
				this.drawText(c, "Overview: " + o.overview, DOMStrings["paragraph_font"], DOMStrings["paragraph_font_size"], fontX, c1Y, false);
				this.drawText(c, "Audience: " + o.audience, DOMStrings["paragraph_font"], DOMStrings["paragraph_font_size"], fontX, c2Y, false);
				this.drawText(c, "Method: " + o.type, DOMStrings["paragraph_font"], DOMStrings["paragraph_font_size"], fontX, c3Y, false);

				//write message
				this.writeMessage(c, o.message, o.link, fontX, c4Y);

				
			}

			if(o.prevPin == undefined){

			}else{
				var linePX = o.prevPin.x,
					linePY = o.prevPin.y,
					lineCX = o.currPin.x,
					lineCY = o.currPin.y;

				this.drawLines(c, linePX, linePY, lineCX, lineCY);
			}
		},
		writeMessage: function(c, m, l, x, y){
			writeMessageToCanvas(c, m, l, x, y);
		},
		drawText: function(c, co, ff, f, x, y, t){
			// create method that counts every certain word and breaks the texts
			textAdd(c, co, ff, f, x, y, t);
		},
		drawImage: function(c, i, x, y){
			imgAdd(c, i, x, y);
		},
		drawLines: function(c, px, py, cx, cy){
			linesToCanvas(c, px, py, cx, cy);
		},
		renderFabricCanvas: function(c){
			renderCanvas(c);
		},
		getObjSize(c, o, ts, t){
			var objAddedDimensions;
			// get object size on canvas
			objAddedDimensions = objSize(c, o, ts, t);

			return objAddedDimensions;
		},
		zoomInAndOut(c, e){
			if(e.e.ctrlKey === true){
				zInandO(c, e);
			}
		},
		mDown(c,e,et){
			var evt = e.e;
			if(evt.altKey === true){
				drag.bool = true;
			    et.selection = false;
			    et.lastPosX = evt.clientX;
			    et.lastPosY = evt.clientY;
				c.on('mouse:move', function(e){mMove(c,e,this)});
			}
		},
		mUp(et){
   	 		drag.bool = false;
			et.selection = true;
		},
		menuCreate(c,d){
			mBarContainer(c,d);
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
				objectsToAdd = UICon.getObjSize(canvas, e, "parent_font_size", "parent_font");
				objectsToAdd.isParent = true;
				//create flow item - add to object
				dCon.createFlowItem(objectsToAdd);
			}else{
				// Children
				//get text or image size - distinguiush type for larger text
				objectsToAdd = UICon.getObjSize(canvas, e, "child_font_size", "child_font");
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

	var canvasControls = function(){
		canvas.on('mouse:wheel', function(e){UICon.zoomInAndOut(canvas,e)});
		canvas.on('mouse:down', function(e){UICon.mDown(canvas,e, this);});
		
		canvas.on('mouse:up', function(e){
			var m = UICon.mUp(this);
		});
	};

	var menuCreation = function(direction){UICon.menuCreate(canvas,direction)};


	return {
		init: function(id, flowVar){
			canvasInit(id);
			loopData(flowVar);
			parentStructure();
			drawItems();
			renderCanvas();
			canvasControls();
		},
		addParent: function(){

		},
		addChild: function(){

		},
		createMenu: function(direction){
			menuCreation(direction);
		}
	}

})(flowchartDataController, flowchartUIController);




// dom ready support
var domIsReady = (function(domIsReady) {
   var isBrowserIeOrNot = function() {
      return (!document.attachEvent || typeof document.attachEvent === "undefined" ? 'not-ie' : 'ie');
   }

   domIsReady = function(callback) {
      if(callback && typeof callback === 'function'){
         if(isBrowserIeOrNot() !== 'ie') {
            document.addEventListener("DOMContentLoaded", function() {
               return callback();
            });
         } else {
            document.attachEvent("onreadystatechange", function() {
               if(document.readyState === "complete") {
                  return callback();
               }
            });
         }
      } else {
         console.error('The callback is not a function!');
      }
   }

   return domIsReady;
})(domIsReady || {});

(function(document, window, domIsReady, undefined) {
   domIsReady(function() {
   		/*
   			*****
   				Main function call
   			*****
   		*/
		flowchartAppController.init("flowchart-stage", flowchartStage);
		flowchartAppController.createMenu('top');
   });
})(document, window, domIsReady);

