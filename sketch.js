// Following The Coding Train Instructed by Daniel Shiffman

var slotWidthScale = 1.2, 
    slotHeightScale = 1.2, 
    pegWidthScale = 0.1, 
    pegHeightScale = 1.8;
    boxHeightScale = 3;        // multiples of the chip diameter

var fontScale = 0.02;        // multiples of the canvas size
var inputXScale = 0.5;        // multiples of the canvas size
var inputWidthScale = 8;        // multiples of the font size
var inputHeightScale = 0.5;        // multiples of the font size
var buttonXScale = 0.75;        // multiples of the canvas size
var buttonWidthScale = 8;        // multiples of the font size
var buttonHeightScale = 3;        // multiples of the font size

var fps = 60;        // frames per second
var timeInterval = 5;         // seconds between two balls' departures

var leftChips = [], 
    rightChips = [], 
    pegs = [], 
    boxEdges = [];

var leftOutput = 0, 
    rightOutput = 0; 

var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine = Engine.create(), 
    world = engine.world;

var canvasSize;
var fontSize; 
var d, w, n1, n2;
var diameter;

function setup() {
  frameRate(fps);
  canvasSize = min(windowWidth, windowHeight);
  fontSize = fontScale*canvasSize;
  createCanvas(canvasSize, canvasSize + 9*fontSize);
  colorMode(HSB);
  stroke(255);   
  
  dInput = createInput();
  dInput.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  dInput.position(inputXScale*width, width);
  wInput = createInput();
  wInput.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  wInput.position(inputXScale*width, width + 1.6*fontSize);
  leftInput = createInput();
  leftInput.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  leftInput.position(inputXScale*width, width + 3.2*fontSize);
  rightInput = createInput();
  rightInput.size(inputWidthScale*fontSize,2*inputHeightScale*fontSize);
  rightInput.position(inputXScale*width, width + 4.8*fontSize);
  
  startButton = createButton("Start");
  startButton.size(buttonWidthScale*fontSize,buttonHeightScale*fontSize);
  startButton.position(buttonXScale*width, width);
  startButton.mouseClicked(startGame);
  stopButton = createButton("Stop");
  stopButton.size(buttonWidthScale*fontSize,buttonHeightScale*fontSize);
  stopButton.position(buttonXScale*width, width + 3*fontSize);
  stopButton.mouseClicked(stopGame);
  continueButton = createButton("Continue");
  continueButton.size(buttonWidthScale*fontSize,buttonHeightScale*fontSize);
  continueButton.position(buttonXScale*width, width + 6*fontSize);
  continueButton.mouseClicked(continueGame);
}

function startGame() {
  leftChips = [];
  rightChips = [];
  pegs = [];
  boxEdges = [];
  
  d = int(dInput.value());
  w = int(wInput.value());
  n1 = int(leftInput.value());
  n2 = int(rightInput.value());
  
  if (isNaN(d) || d < 1) {
      alert("Please enter a valid integer d of minimum 1 for the slot distance between the two inputs.");
  }
  else if (isNaN(w) || w < 2*d + 2 || w % 2 != 0) {
      alert("Please enter a valid even integer w of minimum 2*d + 2 for the number of open slots at the bottom.");
  }
  else if (isNaN(n1) || n1 < 0) {
      alert("Please enter a valid integer n1 of minimum 0 for the number of chips starting at the left input.");
  }
  else if (isNaN(n2) || n2 < 0) {
      alert("Please enter a valid integer n2 of minimum 0 for the number of chips starting at the right input.");
  }
  else {
    loop();

    engine = Engine.create(); 
    world = engine.world; 
    world.gravity.y = 1; 
    
    diameter = min(width/(1+(w-d-1)*slotHeightScale+(w-d)*pegHeightScale+boxHeightScale+pegWidthScale), width/(w*slotWidthScale+(w+1)*pegWidthScale));
    
    for (var i=1; i<=w-d; i++) {
      for (var j=1; j<=d+i+1; j++) {
        var x = (width-diameter*(i-2*j+d+2)*(slotWidthScale+pegWidthScale))/2;
        var y = ((2*i-2)*slotHeightScale+(2*i-1)*pegHeightScale+2)*diameter/2;
        pegs.push(new Peg(x, y, pegWidthScale*diameter, pegHeightScale*diameter));
      }
    }
    
    boxEdges.push(new BoxEdge(width/2-w*(slotWidthScale+pegWidthScale)*diameter/2, width-(pegWidthScale+boxHeightScale/2)*diameter, pegWidthScale*diameter, boxHeightScale*diameter));
    boxEdges.push(new BoxEdge(width/2, width-(pegWidthScale+boxHeightScale/2)*diameter, pegWidthScale*diameter, boxHeightScale*diameter));
    boxEdges.push(new BoxEdge(width/2+w*(slotWidthScale+pegWidthScale)*diameter/2, width-(pegWidthScale+boxHeightScale/2)*diameter, pegWidthScale*diameter, boxHeightScale*diameter));    
    boxEdges.push(new BoxEdge(width/2, width-pegWidthScale*diameter/2, (w*slotWidthScale+(w+1)*pegWidthScale)*diameter, pegWidthScale*diameter));
  }
}

function stopGame() {
  noLoop();
}

function continueGame() {
  loop();
}

function draw() {
  background(0);
  fontSize = fontScale*width;  
  leftOutput = 0; 
  rightOutput = 0;
  
  if (frameCount % (timeInterval*fps) == 0 && leftChips.length < n1) {
        leftChips.push(new Chip((width-d*(slotWidthScale+pegWidthScale)*diameter)/2, diameter/2, diameter));
    }
    else if (frameCount % (timeInterval*fps) == 0 && rightChips.length < n2) {
        rightChips.push(new Chip((width+d*(slotWidthScale+pegWidthScale)*diameter)/2, diameter/2, diameter));
    }
  
  Engine.update(engine);
  for (var i1 = 0; i1 < leftChips.length; i1++) {
    leftChips[i1].show();
    if (leftChips[i1].body.position.x>width/2-w*(slotWidthScale+pegWidthScale)*diameter/2 && leftChips[i1].body.position.x<width/2 && leftChips[i1].body.position.y>width-(pegWidthScale+pegHeightScale)*diameter && leftChips[i1].body.position.y<width-pegWidthScale*diameter) {
        leftOutput++;
    }
    else if (leftChips[i1].body.position.x<width/2+w*(slotWidthScale+pegWidthScale)*diameter/2 && leftChips[i1].body.position.x>width/2 && leftChips[i1].body.position.y>width-(pegWidthScale+pegHeightScale)*diameter && leftChips[i1].body.position.y<width-pegWidthScale*diameter) {
        rightOutput++;     
    }
  }
  for (var i2 = 0; i2 < rightChips.length; i2++) {
    rightChips[i2].show();
    if (rightChips[i2].body.position.x>width/2-w*(slotWidthScale+pegWidthScale)*diameter/2 && rightChips[i2].body.position.x<width/2 && rightChips[i2].body.position.y>width-(pegWidthScale+boxHeightScale)*diameter && rightChips[i2].body.position.y<width-pegWidthScale*diameter) {
        leftOutput++;
    }
    else if (rightChips[i2].body.position.x<width/2+w*(slotWidthScale+pegWidthScale)*diameter/2 && rightChips[i2].body.position.x>width/2 && rightChips[i2].body.position.y>width-(pegWidthScale+boxHeightScale)*diameter && rightChips[i2].body.position.y<width-pegWidthScale*diameter) {
        rightOutput++;     
    }
  }
  for (var j = 0; j < pegs.length; j++) {
    pegs[j].show();
  }
  for (var k = 0; k < boxEdges.length; k++) {
    boxEdges[k].show();
  }
  
  line(0,width,width,width);
  fill(255);
  textSize(fontSize);
  text("The slot distance between the two inputs:", 0, width + 1.4*fontSize);
  text("The (even) number of open slots at the bottom:", 0, width + 2.8*fontSize);
  text("The number of chips starting at the left input:", 0, width + 4.2*fontSize);
  text("The number of chips starting at the right input:", 0, width + 5.6*fontSize);
  text("The number of chips ending at the left output: "+leftOutput, 0, width + 7.0*fontSize);
  text("The number of chips ending at the right output: "+rightOutput, 0, width + 8.4*fontSize);
}