function A(pixels, x, y) {
  var around = [
    { x: -1, y: 0},
    { x: -1, y: 1},
    { x:  0, y: 1},
    { x:  1, y: 1},
    { x:  1, y: 0},
    { x:  1, y: -1},
    { x:  0, y: -1},
    { x: -1, y: -1},
  ];

  var result = 0;
  for(var i = 0; i != around.length - 1; i++) {
    if (pixels[x + around[i].x][y + around[i].y] != 1 && pixels[x + around[i + 1].x][y + around[i + 1].y] == 1) {
      result += 1;
    }
  }

  if (pixels[x + around[around.length - 1].x][y + around[around.length - 1].y] != 1 && pixels[x + around[0].x][y + around[0].y] == 1) {
    result += 1;
  }

  return result;
}

function B(pixels, x, y) {
  var result = 0;
  for(var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      if (i !== 0 && j !== 0) {
        if (pixels[x + i][y + j] === 1) { result += 1; }
      }
    }
  }
  return result;
}

function isWhite(pixels, x, y) {
  var WHITE = 0;
  var MAX_X = pixels[0].length;
  var MAX_Y = pixels.length;
  return x < 0 || x >= MAX_X || y < 0 || y >= MAX_Y || pixels[x][y] == WHITE; 
}

function findBlack(pixels) {
  var rows = pixels.length;
  var cols = pixels[0].length;

  for (var r = 0; r != rows; r++) {
    for (var c = 0; c != cols; c++) {
      if (pixels[r][c] === 1) { return {row: r, col: c}; }
    } 
  }

  return null;
}

function connectivity(pixels, r, c) {
  var i = 0;
  var N = 0;

  if (pixels[r][c+1]   >= 1 && pixels[r-1][c+1] == 0) N++;
  if (pixels[r-1][c+1] >= 1 && pixels[r-1][c]   == 0) N++;
  if (pixels[r-1][c]   >= 1 && pixels[r-1][c-1] == 0) N++;
  if (pixels[r-1][c-1] >= 1 && pixels[r][c-1]   == 0) N++;
  if (pixels[r][c-1]   >= 1 && pixels[r+1][c-1] == 0) N++;
  if (pixels[r+1][c-1] >= 1 && pixels[r+1][c]   == 0) N++;
  if (pixels[r+1][c]   >= 1 && pixels[r+1][c+1] == 0) N++;
  if (pixels[r+1][c+1] >= 1 && pixels[r][c+1]   == 0) N++;

  return N;
}

function fill(pixels) {
  var result = new Array();
  for (var h = 0; h != pixels.length; h++) {
    result[h] = new Array();
    for (var w = 0; w != pixels[0].length; w++) {
      result[h][w] = 0;
    }
  }

  for (var r = 1; r != pixels.length - 1; r++) {
    for (var c = 1; c != pixels[0].length - 1; c++) {
      var a = pixels[r - 1][c - 1];
      var b = pixels[r - 1][c - 0];
      var d = pixels[r - 0][c + 1];
      var f = pixels[r - 0][c + 1];
      var h = pixels[r - 0][c - 1];

      if ( (pixels[r][c] + (b * f) * (h + d) + (h * d) * (b + f)) != 0) {
        result[r][c] = 1;
      }  
    }
  }

  return result;
}

function zero(pixels, r, c, indexes) {
  var around = [
    { x: -1, y: 0},
    { x: -1, y: 1},
    { x:  0, y: 1},
    { x:  1, y: 1},
    { x:  1, y: 0},
    { x:  1, y: -1},
    { x:  0, y: -1},
    { x: -1, y: -1} 
  ];

  var result = 1;
  for(var i = 0; i != indexes.length; i++) {
    var color = pixels[r + around[indexes[i]].x][c + around[indexes[i]].y];
    if (color > 1 ) { color = 0; }
    result *= color;
  }
  return result;
}

function skeleton(pixels) {
      var rows = pixels.length;
      var cols = pixels[0].length;

      var result = new Array();
      for(var r = 0; r != rows; r++) {
        result[r] = new Array();
        for(var c = 0; c != cols; c++) {
          result[r][c] = pixels[r][c];
        }
      }

      for(var r = 1; r != rows - 1; r++) {
        for(var c = 1; c != cols - 1; c++) {
          console.log("r = " + r + " c = " + c + " A = " + A(pixels, r, c) + " B = " + B(pixels, r, c) + " Z = " + zero(pixels, r, c, [0,2,4]) + " z2 = " + zero(pixels, r, c, [2,4,6]));
          if (A(pixels, r, c) === 1) {
            if ((B(pixels, r, c) >= 2) && (B(pixels, r, c) <= 6) ) {
              if (zero(pixels, r, c, [0,2,4]) === 0 && zero(pixels, r, c, [2,4,6]) === 0) {
                result[r][c] = 0;
              }
            }
          }
        }
      }

      for(var r = 0; r != rows; r++) {
        for(var c = 0; c != cols; c++) {
          pixels[r][c] = result[r][c];
        }
      }
  
      for(var r = 1; r != rows - 1; r++) {
        for(var c = 1; c != cols - 1; c++) {
          if (A(pixels, r, c) ===  1) {
            if ((B(pixels, r, c)) >= 2 && (B(pixels, r, c) <= 6)) {
              if (zero(pixels, r, c, [0,2,6]) === 0 && zero(pixels, r, c, [0,4,6]) === 0) {
                result[r][c] = 0;
              }
            }
          }
        }
      }

      for(var r = 0; r != rows; r++) {
        for(var c = 0; c != cols; c++) {
          pixels[r][c] = result[r][c];
        }
      }

    }

function thnz (oldpixels) {
  var rows = oldpixels.length;
  var cols = oldpixels[0].length;

  var pixels = new Array();
  for(var r = 0; r != rows; r++) {
    pixels[r] = new Array();
    for(var c = 0; c != cols; c++) {
      pixels[r][c] = oldpixels[r][c];
    }
  }

  var k = 0;
  var again = 1;
  var tmp = newImage(rows, cols);
  
  /* Mark and delete */
  while (again)
  {
    again = 0;

    /* Second sub-iteration */
    for (var i = 1; i < rows - 1; i++) {
      for (var j = 1; j < cols - 1; j++) {
        if (pixels[i][j] != 1) { continue; }

        k = nays8(pixels, i, j);
        if ((k >= 2 && k <= 6) && connectivity(pixels, i, j) ==1 ) {
          if (pixels[i][j+1] * pixels[i-1][j] * pixels[i][j-1] == 0 && pixels[i-1][j] * pixels[i+1][j] * pixels[i][j-1] == 0) {
            tmp[i][j] = 1;
            again = 1;
          }
        }

      }
    }

    deleteMarked(pixels, tmp);

    if (again == 0) { break; }

    /* First sub-iteration */
    for (var i = 1; i < rows - 1; i++) {
      for (var j = 1; j < cols - 1; j++) {
        if (pixels[i][j] != 1) { continue; }

        k = nays8(pixels, i, j);

        if ((k >= 2 && k <= 6) && connectivity(pixels, i, j) == 1) {
          if (pixels[i-1][j] * pixels[i][j+1] * pixels[i+1][j] == 0 && pixels[i][j+1] * pixels[i+1][j] * pixels[i][j-1] == 0) {
            tmp[i][j] = 1;
            again = 1;
          }
        }

      }
    }

    deleteMarked(pixels, tmp);
  } //end while

  return pixels;
}

function deleteMarked(pixels, tmp) {
  var rows = pixels.length;
  var cols = pixels[0].length;

  /* Delete pixels that are marked  */
  for (var i = 1; i < rows - 1; i++) {
    for (var j = 1; j < cols - 1; j++) {
      if (tmp[i][j]) {
          pixels[i][j] = 0;
          tmp[i][j]    = 0;
      }
    }
  }
}

function nays8(pixels, r, c) {          
  var k = 0;

  for (var i = r - 1; i <= r + 1; i++) {
    for (var j = c-1; j <= c + 1; j++) {
      if (i != r || c != j)
        if (pixels[i][j] >= 1) { k++; }
    }
  }

  return k;
}
