class Display {
	constructor(width, height, element) {
		this.dim = {width: width, height: height}
		this.element = element;
		this.element[0].style.width = this.dim.width + 'ch';
		// this.element[0].style.height = 'max-content';
		this.element[0].style.height = this.dim.height + 'em';

		this.element.empty();
		let line = '';
		for(let y = 0; y < this.dim.height; y++) {
			let char = ''
			for(let x = 0; x < this.dim.width; x++) char += '<i data-x="' + x + '" data-y="' + y + '">\xa0</i>';
			line += '<div>' + char + '</div>';
		}
		this.element[0].innerHTML = line;

		this.menus = {
			main: [
				['     mjex     ', 13, 3, 'white', 'darkblue'],
				['              ', 13, 4],
				['     art      ', 13, 5],
				['     music    ', 13, 6],
				['     photo    ', 13, 7],
				['     video    ', 13, 8],
				['     web      ', 13, 9],
				['              ', 13, 10],
				['______________', 13, 11],
				[' ▲▼           ', 13, 12],
			],
		}
	}

	clearline(line) {this.element[0].children[line].textContent = '\xa0'.repeat(this.dim.width)}

	cls(character) {
		this.element.empty();
		let line = '';
		for(let y = 0; y < this.dim.height; y++) {
			let char = ''
			for(let x = 0; x < this.dim.width; x++) char += '<i data-x="' + x + '" data-y="' + y + '">' + (character[0] || '\xa0') + '</i>';
			line += '<div>' + char + '</div>';
		}
		this.element[0].innerHTML = line;
	}

	set(char, x, y, bg, color) {
		char = char.replace(/\s+/g, '\xa0');
		let string = char[0].length + x > this.dim.width ? char[0].substring(0, this.dim.width - x) : char[0];
		let temp = this.element[0].children[y].textContent;
		this.element[0].children[y].children[x].textContent = char;
		this.element[0].children[y].children[x].style.background = bg || '';
		this.element[0].children[y].children[x].style.color = color || '';
	}

	setline(string, x, y, bg, color) {
		string = string.length + x > this.dim.width ? string.substring(0, this.dim.width - x) : string;
		let temp = this.element[0].children[y].textContent;

		for(let i = 0; i < string.length; i++) chcache.push([string[i], x + i, y, bg, color]);
	}

	setlineF(string, x, y, bg, color) {
		string = string.length + x > this.dim.width ? string.substring(0, this.dim.width - x) : string;
		let temp = this.element[0].children[y].textContent;

		for(let i = 0; i < string.length; i++) this.set(string[i], x + i, y, bg, color);
	}

	multiset(payload) {payload.forEach((line) => this.setline(line[0], line[1], line[2], line[3], line[4]))}


	loadMenu(menu) {
		this.multiset(this.menus[menu]);
	}
}

let chcache = [];
let ci = 0;
let charloop = setInterval(() => {
	if(chcache.length > 0) {
		menu.set(chcache[ci][0], chcache[ci][1], chcache[ci][2], chcache[ci][3], chcache[ci][4]);
		ci++;
		if(ci == chcache.length) {chcache = []; ci = 0};
	}
}, 0)
