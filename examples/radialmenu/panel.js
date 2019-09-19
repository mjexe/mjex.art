class RadialMenu {
	constructor(container) {
		this.container = $(container)[0];
		this.panel = [];

		for(let i = 0; i < this.container.children.length; i++) {
			this.panel[i] = new Panel(this.container.children[i], {
				// background: i == 0 ? '#440000' : '',
				points: [
					{x: '50%', y: '50%'},
					{x: rand(0, 100) + '% ', y: rand(0, 100) + '% '},
					{x: rand(0, 100) + '% ', y: rand(0, 100) + '% '},
				]
			});

			let w = (PI_2 / this.container.children.length);
			this.panel[i].setAngle(w * i, w);
			this.panel[i].apply();
			console.log(toDegrees(width * i), toDegrees(width + (width * i)));
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
		let angle1 = angle - (w / 2);
		let angle2 = angle + (w / 2);
		let length = width > height ? width * 2 : height * 2;

		this.point[1].x = (((center.x + (length * Math.cos(angle1))) / width) * 100) + '%';
		this.point[1].y = (((center.y + (length * Math.sin(angle1))) / height) * 100) + '%';

		this.point[2].x = (((center.x + (length * Math.cos(angle2))) / width) * 100) + '%';
		this.point[2].y = (((center.y + (length * Math.sin(angle2))) / height) * 100) + '%';

		this.apply();
	}
}
