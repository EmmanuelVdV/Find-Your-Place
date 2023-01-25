let w = document.body.clientWidth;
let h = document.body.clientHeight;
let attempts;
let maxAttempts = 200;

let shapes = [];
let grid = [];
let cellSize = 2;
let gridCols = w / cellSize;
let gridRows = h / cellSize;

let nMaxShapes = (gridCols * gridRows) / 1000;

let drawBorders = false;
let maxHatch = 8;

let selectSingularity = false; // has the Singularity been identified ?
let isSingularity = false; // is the current Shape the Singularity ?

function setup() {
  createCanvas(w, h);
  noFill();
  stroke(255);
  rectMode(CENTER);
  randomSeed(fxrand() * 10000);
  initGrid();
}

function draw() {
  background(0);
  shapes.forEach(s => s.render());

  if (attempts < maxAttempts) {
    shapes.forEach(s => {
      let dir = Math.round(random() * 3);
      s.grow(dir);
    });
    attempts++;
  } else {
    console.log("stop");
    noLoop();
  }
}

function initGrid() {

  attempts = 0;

  // initialisation of the cell grid
  for (let i = 0; i < gridCols; i++) {
    grid[i] = [];
    for (let j = 0; j < gridRows; j++) {
      grid[i][j] = 0; // all cells are "free"
    }
  }


  for (let s = 0; s < nMaxShapes; s++) {
    // let c = Math.round((1-random()) * (gridCols - 1));
    // let r = Math.round((1-random()) * (gridRows - 1));

    let c = Math.round(Math.min(random(), random()) * (gridCols - 1));
    let r = Math.round(Math.max(random(), random()) * (gridRows - 1));

    if (!selectSingularity && c > 10 && c < (gridCols - 10) && r > 10 && r < (gridRows - 10)) { // selection of Singularity
      isSingularity = random() > 0.98 ? true : false;
      if (isSingularity) selectSingularity = true;
    }

    if (grid[c][r] == 0) {
      let shape = new Shape(s + 1, c, r, isSingularity);
      shapes.push(shape); // create shape if cell is free
    }

    isSingularity = false;
  }
}

function keyTyped() {
  if (key === 'p' || key === 'P') {
    saveCanvas('FindYourPlace-' + getTimeStamp(), 'png');
  } else if (key === 's' || key === 'S') {

    // SVG rendering and saving
    let drawSVG = SVG().addTo('body').size(w, h);
    let groups = [drawSVG.group().addClass('singularity'), drawSVG.group().addClass('other')]; // groups to handle Singularity and the rest
    shapes.forEach(s => s.renderSVG(drawSVG, groups));
    drawSVG.rect(w,h).stroke({color: '#000000'}).back();

    let svg = drawSVG.svg();
    let blob = new Blob([svg], { type: "image/svg+xml" });

    let dl = document.createElement("a");
    dl.download = "FindYourPlace-" + getTimeStamp() + ".svg";
    dl.href = URL.createObjectURL(blob);
    dl.dataset.downloadurl = ["image/svg+xml", dl.download, dl.href].join(':');
    dl.style.display = "none";
    document.body.appendChild(dl);

    dl.click();

    document.body.removeChild(dl); // remove download element

    let elements = document.body.getElementsByTagName("svg"); // remove SVG element
    document.body.removeChild(elements[0]);
  }

}



