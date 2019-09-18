class RadialMenu {
	constructor(container) {
		this.container = $(container)[0];

		for(let i = 0; i < this.container.children.length; i++) {
			let color = chroma(rand(0, 360, 0), 0.23, 0.37, 'hsl');
			this.container.children[i].style.background = color.hex();

			this.container.children[i].style.clipPath = 'polygon(50% 50%, ' + rand(0, 100) + '% ' + rand(0, 100) + '%, ' + rand(0, 100) + '% ' + rand(0, 100) + '%)'
		}

		console.log(this.container.children);
	}
}
