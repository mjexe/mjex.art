class Character {
	constructor(char, x, y, size, parent, color, bg) {
		this.parent = parent;
		color = color || 0xc0c0c0;
		bg = bg || 0x000099;
		size /= 0.586
		this.text = new PIXI.Text(char[0], {fontFamily: 'VCR OSD Mono', fontSize: size, fill: color});
		this.text.position.set(x, y);
		this.text.calculateBounds();
		this.back = new PIXI.Graphics().beginFill(bg).drawRect(x, y, this.text._bounds.maxX + 1, this.text._bounds.maxY + 1).endFill();
		this.parent.addChild(this.back, this.text);

		this.width = this.text._bounds.maxX; this.height = this.text._bounds.maxY;
		this.x = x; this.y = y;
		this.size = size;
		this.color = color;
		this.bg = bg;
	}

	set(char, x, y, size, color, bg) {
		char = char == null ? this.text.text : char;
		x = x == null ? this.x : x;
		y = y == null ? this.y : y;
		size = size == null ? this.size : size / 0.586;
		color = color == null ? this.color : color;
		bg = bg == null ? this.bg : bg;

		this.parent.removeChild(this.text, this.back);
		this.text = new PIXI.Text(char[0], {fontFamily: 'VCR OSD Mono', fontSize: size, fill: color});
		this.text.position.set(x, y);
		this.text.calculateBounds();
		this.back = new PIXI.Graphics().beginFill(bg).drawRect(x, y, this.text._bounds.maxX + 1, this.text._bounds.maxY + 1).endFill();
		this.parent.addChild(this.back, this.text);

		this.width = this.text._bounds.maxX; this.height = this.text._bounds.maxY;
		this.x = x; this.y = y;
		this.size = size;
		this.color = color;
		this.bg = bg;
	}
}



class Display {
	constructor(cols, rows, size, parent) {
		this.parent = parent;
		this.cols = cols; this.rows = rows;
		this.size = size;
		this.length = size / 0.714285714;
		this.width = cols * size;
		this.height = rows * this.length;

		console.log(rows * this.length);

		this.container = new PIXI.Container();
		this.container.position.set((window.innerWidth / 2) - (this.width / 2), (window.innerHeight / 2) - (this.height / 2));
		this.parent.addChild(this.container);

		this.grid = [];
		for(let y = 0; y < this.rows; y++) {
			this.grid[y] = [];
			for(let x = 0; x < this.cols; x++) this.grid[y][x] = new Character(' ', x * this.size, y * this.length, size, this.container);
		}

		this.menus = {
			main: {
				text: [
					['     mjex     ', 13, 3, 0x000099, 0xc0c0c0],
					['              ', 13, 4],
					['     art      ', 13, 5],
					['     music    ', 13, 6],
					['     photos   ', 13, 7],
					['     videos   ', 13, 8],
					['     webdev   ', 13, 9],
					['     about    ', 13, 10],
					['              ', 13, 11],
					['______________', 13, 12],
					[' ▲▼           ', 13, 13],
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

				pointerAnchor: {x: 16, y: 5},
			}
		}
	}

	resize(size) {
		let length = size / 0.714285714;
		for(let y = 0; y < this.rows; y++) for(let x = 0; x < this.cols; x++) this.grid[y][x].set(null, x * size, y * length, size, null, null);

		this.container.position.set((window.innerWidth / 2) - (this.width / 2), (window.innerHeight / 2) - (this.height / 2));
	}

	set(char, x, y, bg, color) {
		this.grid[y][x].set(char[0], null, null, null, bg, color);
	}

	setline(char, x, y, bg, color) {
		if(char == '--callback') {chcache.push([char, x])}
		else {
			char = char.length + x > this.width ? char.substring(0, this.dim.width - x) : char;
			for(let i = 0; i < char.length; i++) chcache.push([char[i], x + i, y, bg, color]);
		}
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
		else crt.set(chcache[ci][0], chcache[ci][1], chcache[ci][2], chcache[ci][3], chcache[ci][4]);
		ci++;
		if(ci == chcache.length) {chcache = []; ci = 0};
	}
}, 15);



Mousetrap.bind('up', () => crt.movePointer('up'));
Mousetrap.bind('down', () => crt.movePointer('down'));
Mousetrap.bind('enter', () => console.log(crt.getSelection()));
