class Display {
	constructor(width, height, element) {
		this.dim = {width: width, height: height}
		this.element = element;
		// this.element[0].style.fontSize = this
		this.element[0].style.width = this.dim.width + 'ch';
		this.element[0].style.height = this.dim.height + 'em';
	}

	clearline(line) {this.element[0].children[line].textContent = '\xa0'.repeat(this.dim.width)}

	cls(character) {
		this.element.empty();
		let char = '<i>' + (character[0] || '\xa0') + '</i>';
		let line = '<div>' + char.repeat(this.dim.width) + '</div>';
		this.element[0].innerHTML = line.repeat(this.dim.height);
	}

	set(char, x, y) {
		char = char.replace(/\s+/g, '\xa0');
		let string = char[0].length + x > this.dim.width ? char[0].substring(0, this.dim.width - x) : char[0];
		let temp = this.element[0].children[y].textContent;
		this.element[0].children[y].children[x].textContent = char;
	}

	setline(string, x, y) {
		string = string.length + x > this.dim.width ? string.substring(0, this.dim.width - x) : string;
		let temp = this.element[0].children[y].textContent;

		for(let i = 0; i < string.length; i++) chcache.push([string[i], x + i, y]);
	}

	multiset(payload) {payload.forEach((line) => this.setline(line[0], line[1], line[2]))}
}

let chcache = [];
let ci = 0;
let charloop = setInterval(() => {
	if(chcache.length > 0) {
		menu.set(chcache[ci][0], chcache[ci][1], chcache[ci][2]);
		ci++;
		if(ci == chcache.length) {chcache = []; ci = 0};
	}
}, 0)
