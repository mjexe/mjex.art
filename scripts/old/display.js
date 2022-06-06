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

		this.currentMenu;
		this.pointer;

		this.menus = {
			main: {
				text: [
					['     mjex     ', 13, 2, 'white', 'darkblue'],
					['              ', 13, 3],
					['     art      ', 13, 4],
					['     music    ', 13, 5],
					['     photos   ', 13, 6],
					['     videos   ', 13, 7],
					['     webdev   ', 13, 8],
					['     about    ', 13, 9],
					['              ', 13, 10],
					['______________', 13, 11],
					[' ▲▼           ', 13, 12],
					['--callback', x => setTimeout(() => this.createPointer('main'), 500)],
				],

				items: [
					{text: 'art',    type: 'local', action: 'art'},
					{text: 'music',  type: 'local', action: 'music'},
					{text: 'photos', type: 'local', action: 'photo'},
					{text: 'videos', type: 'local', action: 'video'},
					{text: 'webdev', type: 'local', action: 'web'},
					{text: 'about',  type: 'local', action: 'art'},
				],

				pointerAnchor: {x: 16, y: 4},
			}
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
		// let temp = this.element[0].children[y].textContent;
		this.element[0].children[y].children[x].textContent = char;
		this.element[0].children[y].children[x].style.background = bg || '';
		this.element[0].children[y].children[x].style.color = color || '';
	}

	setline(string, x, y, bg, color) {
		if(string == '--callback') {chcache.push([string, x])}
		else {
			string = string.length + x > this.dim.width ? string.substring(0, this.dim.width - x) : string;
			for(let i = 0; i < string.length; i++) chcache.push([string[i], x + i, y, bg, color]);
		}
	}

	setlineF(string, x, y, bg, color) {
		string = string.length + x > this.dim.width ? string.substring(0, this.dim.width - x) : string;
		let temp = this.element[0].children[y].textContent;

		for(let i = 0; i < string.length; i++) this.set(string[i], x + i, y, bg, color);
	}

	multiset(payload) {payload.forEach((line) => this.setline(line[0], line[1], line[2], line[3], line[4]))}


	loadMenu(menu) {this.multiset(this.menus[menu].text); this.currentMenu = menu}

	createPointer(menu) {
		menu = menu || this.currentMenu;
		this.pointer = new MenuPointer(this.menus[menu].pointerAnchor.x, this.menus[menu].pointerAnchor.y, this.menus[menu].items.length);
		this.pointerUpdate();
	}

	movePointer(direction) {
		switch(direction) {
			case 'up': this.pointer.up(); break;
			case 'down': this.pointer.down(); break;
		}

		this.pointerUpdate();
	}

	pointerUpdate() {
		for(let i = 0; i < this.pointer.range; i++) {
			if(i == this.pointer.pos) this.set('>', this.pointer.anchor.x, this.pointer.anchor.y + i)
			else this.set(' ', this.pointer.anchor.x, this.pointer.anchor.y + i);
		}
	}
	
	getSelection(menu) {
		menu = menu || this.currentMenu;
		return this.menus[menu].items[this.pointer.pos];
	}

	select(menu) {
		menu = menu || this.currentMenu;
	}
}



class MenuPointer {
	constructor(x, y, range) {
		this.anchor = {x: x, y: y};
		this.range = range;
		this.pos = 0;
	}

	up() {if(this.pos > 0) this.pos--}
	down() {if(this.pos < this.range - 1) this.pos++}
}





let chcache = [];
let ci = 0;
let charloop = setInterval(() => {
	if(chcache.length > 0) {
		if(chcache[ci][0] === '--callback') chcache[ci][1]()
		else menu.set(chcache[ci][0], chcache[ci][1], chcache[ci][2], chcache[ci][3], chcache[ci][4]);
		ci++;
		if(ci == chcache.length) {chcache = []; ci = 0};
	}
}, 10)






Mousetrap.bind('up', () => menu.movePointer('up'));
Mousetrap.bind('down', () => menu.movePointer('down'));
Mousetrap.bind('enter', () => console.log(menu.getSelection()));
