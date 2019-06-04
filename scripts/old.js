let canvas;

function preload() {
}

function setup() {
	canvas = createCanvas(414, 200);
	canvas.parent('logo');
	pixelDensity(2);
	
	textFont('highway_gothicregular');

	frameRate(30);
}

function draw() {
	clear();
	// background(0)

	noStroke();
	fill(255);

	textAlign(CENTER, CENTER);
	textSize(125);

	push();
	translate(width / 2, 50);
	rotate(-PI/24)
	text('mjex', 0, 0);
	pop();

	stroke(255);
	for(let i = 0; i < 10; i++) {
		let xTemp = floor(random(width));
		line(xTemp, 0, xTemp, height);
	}
}
