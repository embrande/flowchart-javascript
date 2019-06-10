var canvas = new fabric.Canvas("draw", {
	isDrawingMode: true,
  freeDrawingCursor: 'none'
});

var cursor = new fabric.StaticCanvas("cursor");

canvas.freeDrawingBrush.width = 20;
canvas.freeDrawingBrush.color = '#ff0000';

var cursorOpacity = .5;
var mousecursor = new fabric.Circle({ 
  left: -100, 
  top: -100, 
  radius: canvas.freeDrawingBrush.width / 2, 
  fill: "rgba(255,0,0," + cursorOpacity + ")", 
  stroke: "black",
  originX: 'center', 
  originY: 'center'
});

cursor.add(mousecursor);

canvas.on('mouse:move', function (evt) {
	var mouse = this.getPointer(evt.e);  
  mousecursor
  	.set({
      top: mouse.y,
      left: mouse.x
    })
    .setCoords()
	  .canvas.renderAll();
});

canvas.on('mouse:out', function () {
  // put circle off screen
  mousecursor
  	.set({
      top: mousecursor.originalState.top,
      left: mousecursor.originalState.left
    })
    .setCoords()
    .canvas.renderAll();
});

//while brush size is changed
document.getElementById("size").oninput = function () {
	var size = this.value;
  mousecursor
  	.center()
  	.set({
      radius: size/2
  	})
    .setCoords()
    .canvas.renderAll();
};

//after brush size has been changed
document.getElementById("size").onchange = function () {
	var size = parseInt(this.value, 10);
  canvas.freeDrawingBrush.width = size;
  mousecursor
  	.set({
      left: mousecursor.originalState.left,
      top: mousecursor.originalState.top,
      radius: size/2
  	})
    .setCoords()
    .canvas.renderAll();
};

//change mousecursor opacity
document.getElementById("opacity").onchange = function () {
	cursorOpacity = this.value;
  var fill = mousecursor.fill.split(",");
  fill[fill.length-1] = cursorOpacity + ")";
  mousecursor.fill = fill.join(",");
};

//change drawing color
document.getElementById("color").onchange = function () {
	canvas.freeDrawingBrush.color = this.value;  
  var bigint = parseInt(this.value.replace("#", ""), 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;  
  mousecursor.fill = "rgba(" + [r,g,b,cursorOpacity].join(",") + ")";
};

//switch drawing mode
document.getElementById("mode").onchange = function () {
	canvas.isDrawingMode = this.checked;
  
  if (!this.checked) {
  	cursor.remove(mousecursor);
  }
  else {
  	canvas.deactivateAll().renderAll();
  	cursor.add(mousecursor);
  }
};