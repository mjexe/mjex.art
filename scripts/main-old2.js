class Text {
	constructor(text, size, rotation) {
		this.text = text;

		this.origPoints = font.textToPoints(this.text, 0, 0, size, {sampleFactor: 1});
		this.bounds = font.textBounds(this.text, 0, 0, size);

		this.points = [];
		
		for(let i = 0; i < this.origPoints.length; i++) {			
			let rotated = rotundo(this.bounds.w / 2, 0, this.origPoints[i].x, this.origPoints[i].y, PI / 36);

			rotated.x += (windowWidth / 2) - (this.bounds.w / 2);
			rotated.y += (windowHeight / 2) - (this.bounds.h / 4);
			
			this.points[i] = {x: rotated.x, y: rotated.y};
		}
		
		this.renderMode = 'normal';
	}

	render() {
		stroke(255, 255, 255, 200);

		let mode = this.renderMode;
		this.points.forEach(function(e, i) {

			switch(mode) {
				case 'normal':
					point(e.x, e.y);
					break;
				//

				case 'wavy':
					let xTemp = e.x;
					let yTemp = e.y + (3 * sin(((millis() / 20) + e.x) / 10));
		
					point(xTemp, yTemp);
					break;
				//
			}
		});
	}

	regenerate(text, size) {
		this.text = text;

		this.origPoints = font.textToPoints(this.text, 0, 0, size, {sampleFactor: 1});
		this.bounds = font.textBounds(this.text, 0, 0, size);

		this.points = [];
		
		for(let i = 0; i < this.origPoints.length; i++) {			
			let rotated = rotundo(this.bounds.w / 2, 0, this.origPoints[i].x, this.origPoints[i].y, PI / 36);

			rotated.x += (windowWidth / 2) - (this.bounds.w / 2);
			rotated.y += (windowHeight / 2) - (this.bounds.h / 4);
			
			this.points[i] = {x: rotated.x, y: rotated.y};
		}
	}
}


class Melter {
	constructor(x, y, length, duration) {
		this.pos = createVector(x, y);
		this.length = length;
		this.duration = duration;

		this.start = millis();
		this.time = 0;
	}

	render() {
		strokeWeight(1);

		for(let i = 0; i < this.length * (this.time / this.duration); i++) {
			let maxAlpha = 15;
			let ratio = (maxAlpha - (maxAlpha * (i / this.length)));

			stroke(255, 255, 255, ratio - (ratio * (this.time / this.duration)));
			point(this.pos.x, this.pos.y + i);
		}

		this.time = millis() - this.start;
	}
}


class Vehicle {
	constructor(pos, target) {
		this.pos = createVector(pos.x, pos.y);
		this.target = createVector(target.x, target.y);

		this.vel = p5.Vector.random2D();

		this.maxSpeed = 6;
		this.maxForce = 5;
	}

	update() {
		this.pos.add(this.vel);
	}

	behaviors() {
		let force;

		if(mouseIsPressed) {
			force = this.swoop(createVector(this.target.x, this.target.y + random(0, 200)));
			force.mult(1);
		} else {
			force = this.arrive(this.target);
			force.mult(1);
		}
		
		let mouse = createVector(mouseX, mouseY);
		let mouseForce = this.attract(mouse);

		mouseForce.mult(3);

		this.applyForce(force);

		// if(mouseIsPressed) {
		// 	this.applyForce(mouseForce);
		// }
	}

	applyForce(force) {
		this.vel.add(force);
	}


	arrive(target) {
		let desired = p5.Vector.sub(target, this.pos);
		let d = desired.mag();
		let speed = this.maxSpeed;

		speed = map(d, 0, 10, 0, this.maxSpeed);

		desired.setMag(speed);

		let steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.maxForce);

		return steer;
	}

	swoop(target) {
		let desired = p5.Vector.sub(target, this.pos);
		let d = desired.mag();
		let speed = this.maxSpeed;

		speed = map(d, 0, 100, 0, this.maxSpeed);
		if(d < 500) {
		}


		desired.setMag(speed);

		let steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.maxForce);

		return steer;
	}

	flee(target) {
		let desired = p5.Vector.sub(target, this.pos);
		let d = desired.mag();

		if(d < random(100, 200)) {
			let desired = p5.Vector.sub(target, this.pos);
			desired.mult(-1);
	
			let steer = p5.Vector.sub(desired, this.vel);
			steer.limit(this.maxForce);
	
			return steer;
		} else {
			return createVector(0, 0)
		}
	}

	attract(target) {
		let desired = p5.Vector.sub(target, this.pos);
		let d = desired.mag();

		if(d < random(175, 200)) {
			let desired = p5.Vector.sub(target, this.pos);
			desired.mult(1);
	
			let steer = p5.Vector.sub(desired, this.vel);
			steer.limit(this.maxForce);
	
			return steer;
		} else {
			return createVector(0, 0)
		}
	}

	seek(target) {
		let desired = p5.Vector.sub(target, this.pos);
		desired.setMag(this.maxSpeed);

		let steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.maxForce);

		return steer;
	}

	render() {
		stroke(255, 255, 255, 200);
		point(this.pos.x, this.pos.y);
	}
}



let canvas,
	fakeCanvas,
	logo,
	font,
	particle = [],
	vehicle = [];
//


function preload() {
	font = loadFont('/fonts/highway-gothic.ttf');
}

function setup() {
	let tempWidth,
		tempHeight;
	//

	if(windowWidth < windowHeight) {
		logo = new Text('mjex', windowWidth / 4, -PI / 36);
	} else {
		logo = new Text('mjex', windowWidth / 8, -PI / 36);
	}

	$('#fake-canvas').width(floor(logo.bounds.w * (22 / 20))).height(floor(logo.bounds.w / 4));

	$('#container .header .links').css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 1000);;

	// animateThemeColor();
	
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('logo');
	

	logo.points.forEach(function(e, i) {
		let tempPos = createVector();
		switch(floor(random(4))) {
			case 0:
				tempPos.x = random(-width, width * 2);
				tempPos.y = random(-height, -1);
				break;
			//
			
			case 1:
				tempPos.x = random(width + 1, width * 2);
				tempPos.y = random(-height, height * 2);
				break;
			//

			case 2:
				tempPos.x = random(-width, width * 2);
				tempPos.y = random(height + 1, height * 2);
				break;
			//

			case 3:
				tempPos.x = random(-width, - 1);
				tempPos.y = random(-height, height * 2);
				break;
			//
		}

		vehicle.push(new Vehicle({x: tempPos.x, y: tempPos.y}, {x: e.x, y: e.y}));
	});

	pixelDensity(4);
}

function draw() {
	clear();
	// background(0);

	if(vehicle.length == logo.points.length) {
		vehicle.forEach(function(e, i) {
			e.behaviors();
			e.update();
	
			if(dist(e.pos.x, e.pos.y, e.target.x, e.target.y) < 3) {
				e.pos.y += 2 * sin(((frameCount) + e.pos.x) / 10);
			}
	
			e.render();
		});
	} else {
		vehicle = [];

		logo.points.forEach(function(e, i) {
			let tempPos = createTempPos();
			
			vehicle[i] = new Vehicle({x: tempPos.x, y: tempPos.y}, {x: e.x, y: e.y});
		});
	}
}



function windowResized() {
	window.location.reload(true);
}


function rotundo(xCenter, yCenter, x, y, angle) {
	let c = cos(angle);
	let s = sin(angle);

	let xNew = c * (x - xCenter) + s * (y - yCenter) + xCenter;
	let yNew = (c * (y - yCenter) - s * (x - xCenter) + yCenter) * (5 / 8);

	return {x: xNew, y: yNew};
}


function getGradientColor() {
	let r = granimInstance.currentColors[0][0];
	let g = granimInstance.currentColors[0][1];
	let b = granimInstance.currentColors[0][2];

	return "#" + (((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
}
