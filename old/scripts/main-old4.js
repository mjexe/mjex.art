class Text {
	constructor(text, size) {
		this.text = text;
		this.size = size;

		this.origPoints = font.textToPoints(this.text, 0, 0, this.size, {sampleFactor: 1});
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

	regenerate(text) {
		this.text = text;

		this.origPoints = font.textToPoints(this.text, 0, 0, this.size, {sampleFactor: 1});
		this.bounds = font.textBounds(this.text, 0, 0, this.size);

		this.points = [];
		
		for(let i = 0; i < this.origPoints.length; i++) {			
			let rotated = rotundo(this.bounds.w / 2, 0, this.origPoints[i].x, this.origPoints[i].y, PI / 36);

			rotated.x += (windowWidth / 2) - (this.bounds.w / 2);
			rotated.y += (windowHeight / 2) - (this.bounds.h / 4);
			
			this.points[i] = {x: rotated.x, y: rotated.y};
		}
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
		let force = this.arrive(this.target);
		
		let mouse = createVector(mouseX, mouseY);
		let mouseForce = this.attract(mouse);

		force.mult(1);
		mouseForce.mult(3);

		this.applyForce(force);

		if(mouseIsPressed) {
			this.applyForce(mouseForce);
		}

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
	vehicle = [],
	truck = [];
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
		let tempPos = createTempPos();

		vehicle.push(new Vehicle({x: tempPos.x, y: tempPos.y}, {x: e.x, y: e.y}));
	});

	pixelDensity(4);
}

function draw() {
	clear();
	// background(0);

	vehicle.forEach(function(e, i) {
		e.behaviors();
		e.update();

		if(dist(e.pos.x, e.pos.y, e.target.x, e.target.y) < 3) {
			e.pos.y += 2 * sin(((frameCount) + e.pos.x) / 10);
		}

		e.render();
	});

	truck.forEach(function(e, i) {
		if(e.length > 0) {
			e.forEach(function(elem, index) {
				if(dist(elem.pos.x, elem.pos.y, elem.target.x, elem.target.y) > 3) {
					elem.behaviors();
					elem.update();
					elem.render();
				} else {
					truck.splice(i, 1);
				}
			});
		} else {
			truck.splice(i, 1);
		}
	});

	if(vehicle.length != logo.points.length) {
		truck.push(vehicle);
		vehicle = [];

		for(let i = 0; i < truck[truck.length - 1].length; i++) {
			let tempPos = createTempPos();

			truck[truck.length - 1][i].target = createVector(tempPos.x, tempPos.y);
		}
		
		for(let i = 0; i < logo.points.length; i++) {
			let tempPos = createTempPos();
			vehicle[i] = new Vehicle({x: vehicle[floor(random(vehicle.length))].pos.x, y: vehicle[floor(random(vehicle.length))].pos.y}, {x: logo.points[i].x, y: logo.points[i].y});
		}
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

function createTempPos() {
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

	return tempPos;
}


function getGradientColor() {
	let r = granimInstance.currentColors[0][0];
	let g = granimInstance.currentColors[0][1];
	let b = granimInstance.currentColors[0][2];

	return "#" + (((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
}
