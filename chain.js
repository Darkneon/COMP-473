function Graph() {
  this.edges = new Array();
  this.nodes = new Array();
  this.start = new Object();
  this.count = 0;

  this.resetVisited = function() {
    for (var i = 0; i != this.nodes.length; i++) {
      this.nodes[i].visited = false;
    }
  }

  this.hasNode = function(node) {
    for (var i = 0; i != this.nodes.length; i++) {
      if (this.nodes[i] == node) { return true; }
    }
    return false;
  }

  this.hasEdge = function(from, to) {
    for (var i = 0; i != this.edges.length; i++) {
      if (this.edges[i][0] == from && this.edges[i][1] == to) { return true; }
    }
    return false;
  }


  this.addNode = function(node) {
    if (node === null) { return; }

    if (this.hasNode(node) == false) {
      node.id = this.count;
      this.count += 1;
      this.nodes.push(node);
    }
  }

  this.addEdge = function(from, to) {
    if (this.hasEdge(from, to) == false) {
      this.addNode(from);
      this.addNode(to);
      this.edges.push([from, to]);
    }
  }

  this.getNode = function(r, c) {
    for (var i = 0; i != this.nodes.length; i++) {
        if (this.nodes[i].row === r && this.nodes[i].col === c) {            
            return this.nodes[i];
        }
    }

    return null;
  }

  this.getTo = function(node) {
    var to = {};
    for (var i = 0; i != this.edges.length; i++) {
      if (this.edges[i][0] == node) {
        if (this.edges[i][1] === null) { return null; }

        return this.edges[i][1].id; 
      }
    }
  }

  this.getNeighbours = function(node) {
    var result = new Array();
    for (var i = 0; i != this.edges.length; i++) {            
        if (this.edges[i][0] === node) {
            result.push(this.edges[i][1]);
        }
    }
    return result;
  }
}

var PrettyPrinter = {
  startX: 100
};

PrettyPrinter.points = function(points, x, y) {
  drawText(x , y, "black", "Points:");
  
  if (points.length === 0) {
    drawText(x , y + 5, "black", "No points found");
  }
  else {
    for(var i = 0; i != points.length; i++) {
      drawText(x , (y + i) * 25, "black", ["At (", points[i].col, ",", points[i].row, ")"].join(" "));
    }
  }
}

PrettyPrinter.chain = function(chaincode, level, i, x, y) {

    if (typeof(level) === "undefined") { level = 0; }
    if (typeof(i) === "undefined") { i = 0; }
    if (i >= chaincode.nodes.length) { return; }

    if ( chaincode.nodes[i].visited == false) {
      drawText(x, y, "black", chaincode.nodes[i].dirvalue + "-");                
      chaincode.nodes[i].visited = true;
      
      var around = chaincode.getNeighbours(chaincode.nodes[i]);

      if (around.length > 1) { 
          for (var nn = 0; nn != around.length; nn++) {
              if (around[nn] === null) { continue; } 

              i = around[nn].id;
              y += 3;
              if (i === null) { continue; }
              PrettyPrinter.chain(chaincode, level + 1 , i,x, y);  
          }   
      }
      else {
              i = chaincode.getTo(chaincode.nodes[i]);   
              x += 1.8;   
              if (i === null) { return; }                          
              PrettyPrinter.chain(chaincode, level, i, x ,y);  
      }
                  
    }
    
}

function nextdir(pixels, r, c, lastdir) {
  //avoid recreating the object on each call
  if (typeof(CACHE.dirs) === "undefined") {
    CACHE.dirs = [
      [ 0,  1],  //0
      [-1,  1],  //1
      [-1,  0],  //2
      [-1, -1],  //3
      [ 0, -1],  //4
      [ 1, -1],  //5
      [ 1,  0],  //6
      [ 1,  1]   //7
    ];
  }

  var result = { dir: -1, numpaths: 0, dirvalue: -1 };
  var paths  = 0;

  var dirs = [2,4,6,0];
  for (var i = 0; i != dirs.length; i++) {
    if (pixels[ r + CACHE.dirs[dirs[i]][0] ][ c + CACHE.dirs[dirs[i]][1] ] == 1) {
      if (paths === 0) {         
        result.dir      = CACHE.dirs[dirs[i]];
        result.dirvalue = dirs[i];          
      }
      paths += 1;
    }
  }      

  dirs = [3,5,7,1];
  for (var i = 0; i != dirs.length; i++) {
    if (pixels[ r + CACHE.dirs[dirs[i]][0] ][ c + CACHE.dirs[dirs[i]][1] ] == 1) {
      if (paths === 0) {         
        result.dir      = CACHE.dirs[dirs[i]];
        result.dirvalue = dirs[i];          
      }
      paths += 1;
    }
  }    

  result.numpaths = paths;
  return result;
}

function findParent(pixels, row, col) {
    for(var r = -1; r <= 1; r++) {
        for(var c = -1; c <= 1; c++) {
            if (pixels[row + r][col + c] === 2) {
                return {"row": row + r, "col": col + c};
            }
        }
    }

    return null;
}

function chain(pixels, endpoint) {            
  var chaincode = new Graph();
  var tmppixels = clone(pixels);
  var r = endpoint.row;
  var c = endpoint.col;
  var from = {};
  var to   = {};

  chaincode.start = endpoint;
  tmppixels[r][c] = 2;
  from = {row: r, col: c, dirvalue: 0};

  var next = nextdir(tmppixels, r, c, 0);
  r += next.dir[0];
  c += next.dir[1];
  tmppixels[r][c] = 2;         
  to = {row: r, col: c, dirvalue: next.dirvalue };

  chaincode.addEdge(from, to);

  while (findBlack(tmppixels) !== null) {
    
    next = nextdir(tmppixels, r, c, next.dirvalue);
    
    if (next.dirvalue === -1) { 
        chaincode.addEdge(to, null);
        var unvisited = findBlack(tmppixels);
        if (unvisited !== null) {            

          next = {dir: [0, 1], dirvalue: 0, numpaths: 1};
          r = unvisited.row;
          c = unvisited.col;     
          var p = findParent(tmppixels, r, c);
          if (p !== null) {
            from = chaincode.getNode(p.row, p.col);
          }
        }
        else {
            break;
        } 
    }
    else {
        from = to;
        r   += next.dir[0];
        c   += next.dir[1];
    }

    tmppixels[r][c] = 2;    
    to = {row: r, col: c, dirvalue: next.dirvalue };  
    chaincode.addEdge(from, to);
  }      

  return chaincode;
}