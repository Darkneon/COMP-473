var PIXEL_SIZE = 7;    

function clear(context) { 
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid(context, color, stepx, stepy) {
  context.strokeStyle = color;
  context.lineWidth = 0.5;
  
  for(var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, context.canvas.height);
    context.stroke();
    context.fillStyle = 'black'; 
  }
  
  for(var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
    context.beginPath();
    context.moveTo(0, i);
    context.lineTo( context.canvas.width,i);
    context.stroke();
  }
}

function display(context, pixels, offsetX, offsetY) {
  if (typeof(offsetX) === 'undefined') { offsetX = 0;  }
  if (typeof(offsetY) === 'undefined') { offsetY = 50; }
  
  offsetX = Math.floor(offsetX / PIXEL_SIZE);
  offsetY = Math.floor(offsetY / PIXEL_SIZE);

  var rows = pixels.length;
  var cols = pixels[0].length;
  for (var r = 0; r != rows; r++) {
    for (var c = 0; c != cols; c++) {
      color = binToColor(pixels[r][c]);
      drawPixel(context, offsetX + c, offsetY + r, color);  
    }    
  }

}

function drawPixel(context, x, y, r, g, b) {
  if (typeof(r) === "undefined") { r = 0; }
  if (typeof(g) === "undefined") { g = r; }
  if (typeof(b) === "undefined") { b = r; }

  context.fillStyle = rgbToHex(r, g, b);        
  context.fillRect(x * PIXEL_SIZE, 
                   y * PIXEL_SIZE, 
                       PIXEL_SIZE, 
                       PIXEL_SIZE 
                  ); 
}

function drawText(context, x, y, color, value) {
  context.fillStyle = color;
  context.font = 'bold 12pt sans-serif';
  context.fillText(value, x * PIXEL_SIZE, y * PIXEL_SIZE);
}

