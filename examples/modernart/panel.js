class RadialMenu {
	constructor(container) {
		this.container = $(container)[0];
		this.panel = [];

		for(let i = 0; i < this.container.children.length; i++) {
			this.panel[i] = new Panel(this.container.children[i], {
				points: [
					{x: '50%', y: '50%'},
					{x: rand(0, 100) + '% ', y: rand(0, 100) + '% '},
					{x: rand(0, 100) + '% ', y: rand(0, 100) + '% '},
				]
			});
		}

		console.log(this.container.children);
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

		this.apply();
	}

	apply() {
		this.element.style.background = this.background;

		let path = 'polygon(';
		this.point.forEach((e, i) => path += e.x + ' ' + e.y + (i < this.point.length - 1 ? ', ' : ''));
		path += ')'

		this.element.style.clipPath = path;
	}
}
