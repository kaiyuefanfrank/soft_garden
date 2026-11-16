// Soft Garden — adapted from the supplied ART 74 drawing tool template.
// The template's setup/draw, 1–0 key mapping, clear and save functions are retained.
let choice = '1';
let screenbg = '#fcfaf4';
let gardenCanvas;
const brushNames = ['Pencil','Petal','Leaf','Grass','Rain','Sunshine','Flower','Cloud','Dots','Eraser'];
let lastStampX = -999, lastStampY = -999;

function setup() {
  gardenCanvas = createCanvas(760, 540);
  gardenCanvas.parent('canvas-holder');
  background(screenbg);
  const container = document.getElementById('brushes');
  brushNames.forEach((name, i) => {
    const key = String((i + 1) % 10);
    const b = document.createElement('button');
    b.textContent = key + ' · ' + name;
    b.dataset.key = key;
    b.addEventListener('click', () => selectBrush(key));
    container.appendChild(b);
  });
  document.getElementById('clear').addEventListener('click', clear_print);
  document.getElementById('save').addEventListener('click', saveme);
  selectBrush('1');
}

function draw() {
  // Draw only while the pointer is held over the actual canvas.
  if (mouseIsPressed && mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    newkeyChoice(choice);
  } else {
    lastStampX = -999;
    lastStampY = -999;
  }
}

function selectBrush(key) {
  if (!'1234567890'.includes(key)) return;
  choice = key;
  lastStampX = -999;
  document.querySelectorAll('#brushes button').forEach(b => b.classList.toggle('active', b.dataset.key === key));
  document.getElementById('current').textContent = 'Brush: ' + brushNames[key === '0' ? 9 : Number(key) - 1];
}

function newkeyChoice(toolChoice) {
  const x = mouseX, y = mouseY;
  // Space stamps out so dragging produces intentional marks instead of a solid blob.
  const spacing = toolChoice === '4' ? 7 : toolChoice === '9' ? 9 : 17;
  if (toolChoice !== '1' && toolChoice !== '0' && dist(x,y,lastStampX,lastStampY) < spacing) return;
  push();
  if (toolChoice === '1') { // graphite pencil
    stroke(83,103,89,180); strokeWeight(2); line(pmouseX,pmouseY,x,y);
  } else if (toolChoice === '2') { // petal
    translate(x,y); rotate(random(-0.7,0.7)); noStroke(); fill(226,153,169,170);
    ellipse(0,0,13,24); fill(247,196,200,140); ellipse(2,-3,7,15);
  } else if (toolChoice === '3') { // leaf
    translate(x,y); rotate(random(-0.8,0.8)); noStroke(); fill(113,161,116,205);
    ellipse(0,0,13,27); stroke(74,125,84,160); strokeWeight(1); line(0,-11,0,11);
  } else if (toolChoice === '4') { // grass
    stroke(105,155,102,170); strokeWeight(1.8);
    line(x,y+7,x-4,y-random(7,18)); line(x,y+7,x+5,y-random(8,16));
  } else if (toolChoice === '5') { // rain
    stroke(112,167,197,170); strokeWeight(2.3); line(x-2,y-7,x+3,y+7);
  } else if (toolChoice === '6') { // sunshine
    stroke(239,188,91,170); strokeWeight(2);
    for (let a=0;a<TWO_PI;a+=PI/4) line(x+cos(a)*4,y+sin(a)*4,x+cos(a)*14,y+sin(a)*14);
    noStroke(); fill(244,202,105,200); circle(x,y,8);
  } else if (toolChoice === '7') { // small flower
    noStroke(); fill(226,164,184,210);
    for (let a=0;a<TWO_PI;a+=TWO_PI/5) ellipse(x+cos(a)*9,y+sin(a)*9,13,13);
    fill(239,194,97); circle(x,y,11);
  } else if (toolChoice === '8') { // cloud
    noStroke(); fill(199,211,217,175);
    ellipse(x-10,y+3,22,15); ellipse(x+2,y-3,26,21); ellipse(x+14,y+4,22,14);
  } else if (toolChoice === '9') { // pollen / dots
    noStroke(); fill(random([[237,190,110],[209,156,175],[147,180,147],[165,190,213]]));
    circle(x+random(-5,5),y+random(-5,5),random(3,9));
  } else if (toolChoice === '0') { // background-colored eraser
    noStroke(); fill(screenbg); circle(x,y,28);
    stroke(screenbg); strokeWeight(28); line(pmouseX,pmouseY,x,y);
  }
  pop();
  lastStampX=x; lastStampY=y;
}

function clear_print() { background(screenbg); }
function saveme() { saveCanvas(gardenCanvas, 'soft-garden-' + year() + month() + day(), 'png'); }
function keyPressed() {
  if ('1234567890'.includes(key)) selectBrush(key);
  else if (key === 'x' || key === 'X') clear_print();
  else if (key === 'p' || key === 'P') saveme();
}
