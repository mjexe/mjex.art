/*

Created by Max on 10/17/18.

Redistribution is allowed only if some change is made to the code, be creative.

*/

class Text {
	constructor(text, size) {
		this.text = text;
		this.size = size;

		this.origPoints = font.textToPoints(this.text, 0, 0, this.size, {sampleFactor: 1});
		this.bounds = font.textBounds(this.text, 0, 0, size);

		this.points = [];
		
		for(let i = 0; i < this.origPoints.length; i++) {			
			let rotated = rotundo(this.bounds.w / 2, 0, this.origPoints[i].x, this.origPoints[i].y, PI / 36);

			rotated.x += (width / 2) - (this.bounds.w / 2);
			rotated.y += (height / 2) - (this.bounds.h / 4);
			
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

			rotated.x += (width / 2) - (this.bounds.w / 2);
			rotated.y += (height / 2) - (this.bounds.h / 4);
			
			this.points[i] = {x: rotated.x, y: rotated.y};
		}
	}
}


class Vehicle {
	constructor(pos, target) {
		this.pos = createVector(pos.x, pos.y);
		this.target = createVector(target.x, target.y);

		this.transitioning = false;
		this.transitionTarget = createVector();

		this.vel = p5.Vector.random2D();

		this.maxSpeed = 6;
		this.maxForce = 5;
	}

	update() {
		this.pos.add(this.vel);
	}

	behaviors() {
		let target = this.target;

		if(this.transitioning) {
			if(dist(this.pos.x, this.pos.y, this.transitionTarget.x, this.transitionTarget.y) < 3) {
				this.transitioning = false;
			} else {
				target = this.transitionTarget;
			}
		} else {}

		let force = this.enact(target, 'arrive');
		
		let mouse = createVector(mouseX, mouseY);
		let mouseForce = this.enact(mouse, 'attract');

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


	enact(target, type) {
		let desired = p5.Vector.sub(target, this.pos);
		let d = desired.mag();
		let speed = this.maxSpeed;

		switch(type) {
			case 'arrive':
				speed = map(d, 0, 10, 0, this.maxSpeed);
				desired.setMag(speed);
				break;
			//
				
			case 'swoop':
				speed = map(d, 0, 100, 0, this.maxSpeed);
				desired.setMag(speed);
				break;
			//

			case 'flee':
				desired = p5.Vector.sub(target, this.pos);
				desired.mult(-1);
				break;
			//

			case 'attract':
				desired.mult(1);
				break;
			//
		}

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
	font = loadFont('fonts/highway-gothic.ttf');
}

function setup() {
	// if(windowWidth > 1000) {
	// 	width = windowWidth / 2;
	// 	height = windowHeight / 2;
	// }

	width = windowWidth;
	height = windowHeight;

	logo = new Text('mjex', getTextSize(true), -PI / 36);

	$('#logo-container #overlay .fake-canvas').width(floor(logo.bounds.w * (21 / 20))).height(floor(logo.bounds.h / 3));

	$('#overlay').css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 1000);
	
	setTimeout(function() {
		$('#button-thing').css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 2000);
	}, 1000);

	// animateThemeColor();

	canvas = createCanvas(width, height);
	canvas.parent('logo');

	for(let i = 0; i < logo.points.length; i++) {
		// let tempPos = createTempPos();
		let tempPos = createVector(width / 2, height * (15 / 10));

		vehicle[i] = new Vehicle({x: tempPos.x, y: tempPos.y}, {x: logo.points[i].x, y: logo.points[i].y});
		vehicle[i].pos.x += vehicle[i].target.x;
		vehicle[i].applyForce(createVector((vehicle[i].target.x / 10), -(vehicle[i].target.x / 10)));
	}
	
	pixelDensity(3);
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
}


function keyPressed() {
	switch(keyCode) {
		case 38:
			$('#button-thing .text')[0].innerHTML = 'show more';
			scrollDude(0);
			break;
		//

		case 40:
			$('#button-thing .text')[0].innerHTML = 'hide';
			scrollDude($("#about-container").outerHeight());
			break;
		//

		case 68:
			regenerateLogo('douk');
			setTimeout(x => regenerateLogo('nouk'), 1000);
			setTimeout(x => regenerateLogo('kem'), 2000);
			setTimeout(x => regenerateLogo('mjex'), 3500);

			break;
		//

		case 70:
			regenerateLogo('respects');
			setTimeout(x => regenerateLogo('paid'), 2000);
			setTimeout(x => regenerateLogo('mjex'), 3500);
			
			break;
		//

		case 72:
			regenerateLogo('haich');
			setTimeout(x => regenerateLogo('mjex'), 2000);

			break;
		//

		case 74:
			regenerateLogo('j');
			setTimeout(x => regenerateLogo('mjex'), 2000);

			break;
		//

		case 79:
			regenerateLogo('oj');
			setTimeout(x => regenerateLogo('mjex'), 2000);

			break;
		//

		case 87:
			regenerateLogo('wots');
			setTimeout(x => regenerateLogo('better'), 1000);
			setTimeout(x => regenerateLogo('mjex'), 2500);

			break;
		//
	}
}



function windowResized() {
	resizeCanvas($('#logo-container').width(), $('#logo-container').height());

	regenerateLogo();
	$('#logo-container #overlay').width(floor(logo.bounds.w * (21 / 20))).height(floor(logo.bounds.h / 4));

	if(windowWidth != $('body').width()) {
		// window.location.reload(true);
	}
}


function rotundo(xCenter, yCenter, x, y, angle) {
	let c = cos(angle);
	let s = sin(angle);

	let xNew = c * (x - xCenter) + s * (y - yCenter) + xCenter;
	let yNew = (c * (y - yCenter) - s * (x - xCenter) + yCenter) * (5 / 8);

	return {x: xNew, y: yNew};
}

function regenerateLogo(text, size) {
	if(typeof size == 'undefined') size = getTextSize();
	logo = new Text(logo.text, size, -PI / 36);

	if(typeof text != 'undefined') {
		logo.regenerate(text);
	} else {
		logo.regenerate(logo.text);
	}
	
	if(vehicle.length > logo.points.length) {
		truck.push(vehicle.splice(logo.points.length, vehicle.length - logo.points.length));

		for(let i = 0; i < truck[truck.length - 1].length; i++) {
			let tempPos = createTempPos();

			truck[truck.length - 1][i].target = createVector(tempPos.x, tempPos.y);
		}

		for(let i = 0; i < logo.points.length; i++) {
			vehicle[i].target = createVector(logo.points[i].x, logo.points[i].y);

			// vehicle[i].transitioning = true;
			// vehicle[i].transitionTarget = createVector(random(width), random(height));
		}
	} else if(vehicle.length < logo.points.length) {
		for(let i = 0; i < vehicle.length; i++) {
			vehicle[i].target = createVector(logo.points[i].x, logo.points[i].y);
		}

		if(vehicle.length == 0) {
			for(let i = 0; i < logo.points.length; i++) {
				let tempPos = createTempPos();
					
				vehicle[i] = new Vehicle({x: tempPos.x, y: tempPos.y}, {x: logo.points[i].x, y: logo.points[i].y});
			}
		} else {
			for(let i = vehicle.length - 1; i < logo.points.length; i++) {
				tempPos = {x: vehicle[floor(random(vehicle.length))].pos.x, y: vehicle[floor(random(vehicle.length))].pos.y};

				vehicle[i] = new Vehicle({x: tempPos.x, y: tempPos.y}, {x: logo.points[i].x, y: logo.points[i].y});
			}
		}
	} else {
		truck.push(vehicle);
		vehicle = [];

		for(let i = 0; i < logo.points.length; i++) {
			let tempPos = createTempPos();
			vehicle[i] = new Vehicle({x: tempPos.x, y: tempPos.y}, {x: logo.points[i].x, y: logo.points[i].y});
		}
	}

	return text;
}

function getTextSize(preload) {
	if(preload) {
		if(windowWidth < windowHeight) {
			return windowWidth / 4;
		} else {
			return windowHeight / 5;
		}
	} else {
		if(width < height) {
			return width / 4;
		} else {
			return height / 5;
		}
	}
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
