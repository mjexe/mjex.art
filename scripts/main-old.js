class Text {
	constructor(text) {
		this.text = text;

		this.points = font.textToPoints(this.text, 0, 0, 150, {sampleFactor: 1});
		this.bounds = font.textBounds(this.text, 0, 0, 150);
	}

	render() {
		stroke(255);

		this.points.forEach(function(e, i) {
			point(e.x, e.y);
		});
	}
}

class Melter {
	constructor(x, y, traceLength, step) {
		this.origin = createVector(x, y);
		this.pos = createVector(x, y);
		this.traceLength = traceLength;
		this.step = step;
	}

	update() {}

	render() {
		for(let i = 0; i < this.step && i + this.pos.y < this.traceLength; i++) {
			stroke(255, 255, 255, 255 - (255 * ((this.pos.y - this.origin.y) / this.traceLength)));
			point(this.pos.x, this.pos.y);
			this.pos.y++;
		}
	}
}



let canvas,
	logo,
	font,
	logoText,
	particle = [];
//


function preload() {
	font = loadFont('/fonts/highway-gothic.ttf');
}

function setup() {
	canvas = createCanvas(414, 200);
	canvas.parent('logo');

	logo = new Text('mjex');

}

function draw() {
	clear();

	translate((width / 2) - (logo.bounds.w / 2), 105);

	
	if(frameCount % 5) {
		for(let i = 0; i < 50; i++) {
			let tempPoint = logo.points[floor(random(logo.points.length))];
			particle.push(new Melter(tempPoint.x, tempPoint.y, floor(random(15, 25)), 4));
		}
	}

	particle.forEach(function(e, i) {
		if(e.pos.y > height) {
			particle.splice(i, 1);
		} else {
			e.update();
			e.render();
		}
	});

}

function setGradient(x, y, w, h, color1, color2, axis) {}
