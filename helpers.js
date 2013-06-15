function comparer(value1, value2) {
  return (value1.x === value2.x && value1.y === value2.y);
}

function arrayContains(array, value, cmpfunc) {
   for (var i = 0; i != array.length; i++) {
     if (cmpfunc(array[i], value) == true) {
       return true;
     }
   }
   return false;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function binToColor(value) {
  if (value == 2) { return 159; }
  if (value == 3) { return 59; }

  return value == 1 ? 0 : 255;
}

   
function newImage(rows, cols) {
  var result = new Array();

  for(var r = 0; r != rows; r++) {
    result[r] = new Array();
    for(var c = 0; c != cols; c++) {
      result[r][c] = 0;
    }
  }

  return result;
}

function clone(pixels) {
  var result = new Array();
  var rows   = pixels.length;
  var cols   = pixels[0].length;

  for(var r = 0; r != rows; r++) {
    result[r] = new Array();
    for(var c = 0; c != cols; c++) {
      result[r][c] = pixels[r][c];
    }
  }

  return result;
}
