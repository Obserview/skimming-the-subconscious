// === Skipping Stone Memory - Accurate Skipping Physics ===
// Responsive full screen, elliptical stone, realistic skipping, Earthtone font

if (!document.body || !document.head) {
  console.error("Error: <head> or <body> tag is missing in the HTML file.");
  alert("Please ensure your HTML file contains <head> and <body> tags.");
}

let stone;
let skipping = false;
let words = ["miku", "lost", "echo", "what if", "sleepy", "hungry", "tired", "回家", "never gonna give you up", "wish", "shit", "拉磨", "alcohol", "吃"];
let flashes = [];
let prepTime = 0;
let startTime;

function preload() {
  earthtone = loadFont;
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent(document.body);
  stone = new Stone();
  textFont(earthtone);
  textSize(24);
  noCursor();
}

function draw() {
  background(0);

  if (!skipping) {
    fill(255);
    noStroke();
    textAlign(CENTER);
    text("Hold mouse to prepare, release to throw", width / 2, height / 5);
  }

  stone.update();
  stone.display();

  for (let i = flashes.length - 1; i >= 0; i--) {
    flashes[i].update();
    flashes[i].display();
    if (flashes[i].finished()) {
      flashes.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (!skipping) stone.reset();
}

function mousePressed() {
  if (!skipping) {
    startTime = millis();
  }
}

function mouseReleased() {
  if (!skipping) {
    prepTime = constrain(millis() - startTime, 100, 4000);
    stone.throw(prepTime);
    skipping = true;
  }
}

class Stone {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = width * 0.2;
    this.y = height * 0.8;
    this.vx = 0;
    this.vy = 0;
    this.radiusX = 20;
    this.radiusY = 10;
    this.gravity = 0.6;
    this.bounceFactor = 0.6;
    this.skipsRemaining = 0;
    this.state = "ready";
    this.osc = 0;
  }

  throw(power) {
    let jumpPower = map(power, 100, 4000, 6, 18);
    this.vx = jumpPower;
    this.vy = -jumpPower * 0.4;
    this.skipsRemaining = int(map(power, 100, 4000, 3, 12));
    this.state = "fly";
  }

  update() {
    if (this.state === "ready") {
      this.osc += 0.08;
    } else if (this.state === "fly") {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;

      if (this.y >= height * 0.8 && this.vy > 0 && this.skipsRemaining > 0) {
        this.vy *= -this.bounceFactor;
        this.flashWord();
        this.skipsRemaining--;
      }

      if (this.x > width || this.skipsRemaining <= 0) {
        this.reset();
        skipping = false;
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.state === "ready" ? sin(this.osc) * 0.4 : 0);
    fill(255);
    noStroke();
    ellipse(0, 0, this.radiusX * 2, this.radiusY * 2);
    pop();
  }

  flashWord() {
    let word = random(words);
    let fx = this.x + random(-30, 30);
    let fy = this.y - random(20, 60);
    flashes.push(new FlashText(word, fx, fy));
  }
}

class FlashText {
  constructor(word, x, y) {
    this.word = word;
    this.x = x;
    this.y = y;
    this.alpha = 255;
  }

  update() {
    this.alpha -= 20;
  }

  display() {
    fill(255, this.alpha);
    textAlign(CENTER);
    text(this.word, this.x, this.y);
  }

  finished() {
    return this.alpha <= 0;
  }
}
