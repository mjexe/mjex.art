class RadialMenu {
	constructor(container) {
		this.container = $(container)[0];
		this.panel = [];

		this.generate();

		container.bind("DOMSubtreeModified", () => {
			this.generate();
		});
	}

	generate() {
		for(let i = 0; i < this.container.children.length; i++) {
			this.panel[i] = new Panel(this.container.children[i], {
				points: [
					{x: '50%', y: '50%'},
					{x: rand(0, 100) + '% ', y: rand(0, 100) + '% '},
					{x: rand(0, 100) + '% ', y: rand(0, 100) + '% '},
				]
			});

			let w = (TAU / this.container.children.length);
			this.panel[i].setAngle(w * i, w);
			this.panel[i].apply();
		}
	}

	hover(panel, spread) {
		let count      = this.container.children.length - 1;
		let w          = (TAU / this.container.children.length);
		let angle      = 0;
		let size       = 0;
		let antispread = TAU - spread;

		for(let i = 0; i < this.container.children.length; i++) {
			if(i < panel) {
				angle = ((antispread / count) * i) + ((w / count) * panel);
				size  = antispread / count;

				// angle = ((w - (spread / count)) * i);
				// size  = w - (spread / count);

				// angle = w * i;
				// size  = w;
			} else if(i == panel) {
				angle = ((antispread / count) * i) + ((w / count) * panel);
				size  = spread;
			} else if(i > panel) {
				angle = (((antispread / count) * (i - 1)) + spread) + ((w / count) * panel);
				size  = antispread / count;

				// angle = ((w - (spread / (count - 1))) * i) + (spread / 2);
				// size  = w - (spread / (count - 1));

				// angle = w * i;
				// size  = w;
			}

			this.panel[i].setAngle(angle, size);
			this.panel[i].apply();
		}
	}

	update() {
		for(let i = 0; i < this.container.children.length; i++) {
			if(this.panel[i].checkMouse()) {
				if(this.pos != i) {
					this.hover(i, TAU / 5);
				}

				this.pos = i;

				// if(this.panel[i].background != '') this.panel[i].tempbg = this.panel[i].background;
				// this.panel[i].background = '';
			} else {
				// this.hover(0, TAU / this.container.children.length);
				// if(typeof this.panel[i].tempbg != 'undefined') this.panel[i].background = this.panel[i].tempbg;
			}
		}
	}
}



class Panel {
	constructor(element, data) {
		this.element = element;

		this.background = typeof data.background != 'undefined' ? data.background : chroma(rand(0, 360, 0), rand(0.2, 0.5, 2), 0.37, 'hsl').hex();

		this.point = typeof data.points != 'undefined' ? data.points : [
			{x: 0, y: 0},
			{x: 0, y: 0},
			{x: 0, y: 0},
		];
	}

	apply() {
		this.element.style.background = this.background;

		let path = 'polygon(';
		this.point.forEach((e, i) => path += e.x + ' ' + e.y + (i < this.point.length - 1 ? ', ' : ''));
		path += ')';

		this.element.style.clipPath = path;
	}

	setAngle(angle, w) {
		this.angle1 = angle % TAU;
		this.angle2 = (angle + w) % TAU;
		let length = width > height ? width * 100 : height * 100;

		this.point[1].x = (((center.x + (length * Math.cos(this.angle1))) / width) * 100) + '%';
		this.point[1].y = (((center.y + (length * Math.sin(this.angle1))) / height) * 100) + '%';

		this.point[2].x = (((center.x + (length * Math.cos(this.angle2))) / width) * 100) + '%';
		this.point[2].y = (((center.y + (length * Math.sin(this.angle2))) / height) * 100) + '%';

		this.apply();
	}

	checkMouse() {
		// console.log(mouseangle, this.angle1);
		return mouseangle > this.angle1 && mouseangle < this.angle2;
	}
}
