let colors = {
	lightgray: 0xc0c0c0,
	lightblue: 0x000099,
}

let schemes = {
	normal: [colors.lightgray, colors.lightblue],
}




class Character {
	constructor(char, x, y, size, parent, color, bg, alpha) {
		this.parent = parent;
		color = color|| schemes.normal[0];
		bg = bg || schemes.normal[1];
		alpha = alpha || 0;
		size /= 0.586
		this.text = new PIXI.Text(char[0], {fontFamily: 'VCR OSD Mono', fontSize: size, fill: color});
		this.text.position.set(x, y);
		this.text.calculateBounds();
		this.text.zIndex = 100;
		this.back = new PIXI.Graphics().beginFill(bg, alpha).drawRect(x, y, this.text._bounds.maxX + 1, this.text._bounds.maxY + 1).endFill();
		this.back.zIndex = 0;
		this.parent.addChild(this.back, this.text);

		this.width = this.text._bounds.maxX; this.height = this.text._bounds.maxY;
		this.x = x; this.y = y;
		this.size = size;
		this.color = color;
		this.bg = bg;
		this.alpha = alpha;
		this.mask = false;
	}

	set(char, x, y, size, df, color, bg, alpha, mask) {
		char = char == null ? this.text.text : char;
		x = x == null ? this.x : x;
		y = y == null ? this.y : y;
		size = size == null ? this.size : size / 0.586;

		df = df == null ? this.df : df;
		if(df) {
			color = color == null ? schemes.normal[0] : color;
			bg = bg == null ? schemes.normal[0] : bg;
			alpha = alpha || 0;
			mask = mask == null ? false : false;
		} else {
			color = color == null ? this.color : color;
			bg = bg == null ? this.bg : bg;
			alpha = alpha || this.alpha;
			mask = mask == null ? this.mask : (mask || false);
		}

		this.parent.removeChild(this.text, this.charmask, this.back);
		this.text = new PIXI.Text(char[0], {fontFamily: 'VCR OSD Mono', fontSize: size, fill: color});
		this.text.position.set(x, y);
		this.text.calculateBounds();
		this.back = new PIXI.Graphics().beginFill(bg, alpha).drawRect(x, y, this.text._bounds.maxX + 1, this.text._bounds.maxY + 1).endFill();

		if(mask) {
			this.text.style.fill = 0x000000;
			let composite = new PIXI.Container();
			let whitebox = new PIXI.Graphics().beginFill(0xffffff).drawRect(x, y, this.text._bounds.maxX + 1, this.text._bounds.maxY + 1).endFill();
			composite.addChild(whitebox, this.text);
			
			this.charmask = new PIXI.Sprite.from(app.renderer.generateTexture(composite));
			this.charmask.position.set(x, y);

			this.back.mask = this.charmask;
			this.parent.addChild(this.charmask, this.back);
		} else {
			this.parent.addChild(this.back, this.text);
		}


		this.width = this.text._bounds.maxX; this.height = this.text._bounds.maxY;
		this.x = x; this.y = y;
		this.size = size;
		this.df = df;
		this.color = color;
		this.bg = bg;
		this.alpha = alpha;
		this.mask = mask;
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

		this.container = new PIXI.Container();
		this.bg = new PIXI.Graphics().beginFill(schemes.normal[1]).drawRect(this.container.x, this.container.y, this.width, this.height).endFill();
		this.container.addChild(this.bg);
		this.container.backgroundColor = schemes.normal[1];
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
					['     mjex     ', 13, 3, false, schemes.normal[0], schemes.normal[0], 100, true],
					['              ', 13, 4,  true],
					['     art      ', 13, 5,  true],
					['     music    ', 13, 6,  true],
					['     photos   ', 13, 7,  true],
					['     videos   ', 13, 8,  true],
					['     webdev   ', 13, 9,  true],
					['     about    ', 13, 10, true],
					['              ', 13, 11, true],
					['______________', 13, 12, true],
					['  ▼           ', 13, 13, true],
					['--callback', x => setTimeout(() => this.createPointer('main'), 500)],
				],

				items: [
					{text: 'art',    action: x => this.clm(y => this.loadMenu('art'))},
					{text: 'music',  action: x => this.clm(y => this.loadMenu('music'))},
					{text: 'photos', action: 'photo'},
					{text: 'videos', action: 'video'},
					{text: 'webdev', action: 'web'},
					{text: 'about',  action: 'about'},
				],

				scheme: 'normal',
				pointerAnchor: {x: 16, y: 5},
				directionAnchor: {x: 14, y: 13},
			},

			art: {
				text: [
					['       art        ', 11, 5,  false, schemes.normal[0], schemes.normal[0], 100, true],
					['                  ', 11, 6,  true],
					['       deviantart ', 11, 7,  true],
					['       back       ', 11, 8,  true],
					['                  ', 11, 9,  true],
					['__________________', 11, 10, true],
					['  ▼               ', 11, 11, true],
					['--callback', x => setTimeout(() => this.createPointer('art'), 500)],
				],
	
				items: [
					{text: 'deviantart', action: x => location.href = '//www.deviantart.com/mjexe'},
					{text: 'back',       action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerAnchor: {x: 16, y: 7},
				directionAnchor: {x: 12, y: 11},
			},

			music: {
				text: [
					['       music      ', 11, 4,  false, schemes.normal[0], schemes.normal[0], 100, true],
					['                  ', 11, 5,  true],
					['       bandcamp   ', 11, 6,  true],
					['       soundcloud ', 11, 7,  true],
					['       spotify    ', 11, 8,  true],
					['       back       ', 11, 9,  true],
					['                  ', 11, 10, true],
					['__________________', 11, 11, true],
					['  ▼               ', 11, 12, true],
					['--callback', x => setTimeout(() => this.createPointer('music'), 500)],
				],
	
				items: [
					{text: 'bandcamp', action: x => location.href = '//www.deviantart.com/mjexe'},
					{text: 'soundcloud', action: x => location.href = '//www.deviantart.com/mjexe'},
					{text: 'spotify', action: x => location.href = '//www.deviantart.com/mjexe'},
					{text: 'back',       action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerAnchor: {x: 16, y: 6},
				directionAnchor: {x: 12, y: 12},
			},
		}
	}

	resize(size) {
		let length = size / 0.714285714;
		for(let y = 0; y < this.rows; y++) for(let x = 0; x < this.cols; x++) this.grid[y][x].set(null, x * size, y * length, size, null, null, null, null, null);
		
		this.size = size;
		this.length = size / 0.714285714;
		this.width = this.cols * size;
		this.height = this.rows * this.length;

		this.container.position.set((window.innerWidth / 2) - (this.width / 2), (window.innerHeight / 2) - (this.height / 2));
		this.bg.width = this.width; this.bg.height = this.height;
	}

	set(char, x, y, df, color, bg, alpha, mask) {this.grid[y][x].set(char[0], null, null, null, df, color, bg, alpha, mask)}

	setline(char, x, y, df, color, bg, alpha, mask) {
		if(char == '--callback') {chcache.push([char, x])}
		else {
			char = char.length + x > this.width ? char.substring(0, this.dim.width - x) : char;
			for(let i = 0; i < char.length; i++) chcache.push([char[i], x + i, y, df, color, bg, alpha, mask]);
		}
	}

	multiset(payload) {payload.forEach((line) => this.setline(line[0], line[1], line[2], line[3], line[4], line[5], line[6], line[7]))}

	loadMenu(menu) {this.multiset(this.menus[menu].text); this.currentMenu = menu; location.hash = menu == 'main' ? '' : menu}

	cls(callback) {
		this.erasePointer();
		for(let y = 0; y < this.rows; y++) for(let x = 0; x < this.cols; x++) chcache.push([' ', x, y, true, schemes.normal[0], schemes.normal[1], null]);
		if(typeof callback != 'undefined') callback();
	}

	clm(callback) {
		this.erasePointer();
		let scheme = this.menus[this.currentMenu].scheme;
		this.menus[this.currentMenu].text.forEach((e) => {
			for(let i = 0; i < e[0].length; i++) {
				if(e[0] != '--callback') {
					chcache.push([' ', e[1] + i, e[2], true, null, null, null, null]);
				}
			}
		});
		if(typeof callback != 'undefined') callback();
	}


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
			if(i == this.pointer.pos) {
				if(this.menus[this.currentMenu].items[this.pointer.pos].text == 'back') this.set('◄', this.pointer.anchor.x, this.pointer.anchor.y + i);
				else if(this.menus[this.currentMenu].items[this.pointer.pos].text == 'next') this.set('»', this.pointer.anchor.x, this.pointer.anchor.y + i);
				else if(this.menus[this.currentMenu].items[this.pointer.pos].text == 'prev') this.set('«', this.pointer.anchor.x, this.pointer.anchor.y + i);
				else this.set('►', this.pointer.anchor.x, this.pointer.anchor.y + i);
			} else this.set(' ', this.pointer.anchor.x, this.pointer.anchor.y + i);
		}

		let arrowAnchor = this.menus[this.currentMenu].directionAnchor;
		if(this.pointer.pos == 0) {
			this.set(' ', arrowAnchor.x, arrowAnchor.y);
			this.set('▼', arrowAnchor.x + 1, arrowAnchor.y);
		} else if(0 > this.pointer.pos || this.pointer.pos < this.pointer.range - 1) {
			this.set('▲', arrowAnchor.x, arrowAnchor.y);
			this.set('▼', arrowAnchor.x + 1, arrowAnchor.y);
		} else if(this.pointer.pos == this.pointer.range - 1) {
			this.set('▲', arrowAnchor.x, arrowAnchor.y);
			this.set(' ', arrowAnchor.x + 1, arrowAnchor.y);
		}
	}

	erasePointer() {
		for(let i = 0; i < this.pointer.range; i++) this.set(' ', this.pointer.anchor.x, this.pointer.anchor.y + i);
		this.pointer = undefined;
	}
	
	getSelection(menu) {
		menu = menu || this.currentMenu;
		return this.menus[menu].items[this.pointer.pos];
	}

	select(menu) {
		menu = menu || this.currentMenu;
		this.menus[menu].items[this.pointer.pos].action();
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
		else crt.set(chcache[ci][0], chcache[ci][1], chcache[ci][2], chcache[ci][3], chcache[ci][4], chcache[ci][5], chcache[ci][6], chcache[ci][7]);
		ci++;
		if(ci == chcache.length) {chcache = []; ci = 0};
	}
}, 10);



Mousetrap.bind('up', () => crt.movePointer('up'));
Mousetrap.bind('down', () => crt.movePointer('down'));
Mousetrap.bind('enter', () => crt.select());
