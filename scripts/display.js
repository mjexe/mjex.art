let colors = {
	lightgray: 0xc0c0c0,
	lightblue: 0x000099,
}

let schemes = {
	normal: [colors.lightgray, colors.lightblue],
}


class Character {
	constructor(data) {
		this.parent = data.parent;
		this.char = data.char;
		this.x = data.x;
		this.y = data.y;
		this.size = data.size / 0.586;
		this.color = data.color;
		this.bg = data.bg;
		this.alpha = data.alpha;
		this.mask = data.mask;
		// data gathering

		this.set(data);
	}

	set(data) {
		this.char  = data.char || this.char;
		this.x     = typeof data.x == 'undefined' ? this.x : data.x;
		this.y     = typeof data.y == 'undefined' ? this.y : data.y;
		this.size  = typeof data.size == 'undefined' ? this.size : data.size / 0.586;
		this.color = typeof data.color == 'undefined' ? this.color : data.color;
		this.bg    = typeof data.bg == 'undefined' ? this.bg : data.bg;
		this.alpha = typeof data.alpha == 'undefined' ? this.alpha : data.alpha;
		this.mask  = typeof data.mask == 'undefined' ? this.mask : data.mask;
		// data gathering

		this.parent.removeChild(this.text, this.charmask, this.back);
		// remove the old graphics

		if(this.mask) {
			this.text = new PIXI.Text(this.char[0], {fontFamily: 'VCR OSD Mono', fontSize: this.size, fill: 0x00000});
			this.text.position.set(this.x, this.y);
			this.text.calculateBounds();
			// create black text

			this.width = this.text._bounds.maxX;
			this.height = this.text._bounds.maxY;
			// set width and height variables to text bounds

			this.back = new PIXI.Graphics()
				.beginFill(this.bg, 100)
				.drawRect(this.x, this.y, this.width + 1, this.height + 1);
			// create rectangle that matches text bounds

			let whitebox = new PIXI.Graphics()
				.beginFill(0xffffff)
				.drawRect(this.x, this.y, this.text._bounds.maxX + 1, this.text._bounds.maxY + 1);
			// create white background for text
			
			let composite = new PIXI.Container();
			composite.addChild(whitebox, this.text);
			// create composite of white box and text

			this.charmask = new PIXI.Sprite.from(app.renderer.generateTexture(composite));
			this.charmask.position.set(this.x, this.y);
			// render the composite to a texture and create a sprite out of it

			// set use the composite sprite as a mask for the real background
			this.back.mask = this.charmask;
			this.parent.addChild(this.charmask, this.back);
		} else {
			this.text = new PIXI.Text(this.char[0], {fontFamily: 'VCR OSD Mono', fontSize: this.size, fill: this.color});
			this.text.position.set(this.x, this.y);
			this.text.calculateBounds();
			// create black text

			this.width = this.text._bounds.maxX;
			this.height = this.text._bounds.maxY;
			// set width and height variables to text bounds

			this.back = new PIXI.Graphics()
				.beginFill(this.bg, this.alpha)
				.drawRect(this.x, this.y, this.width + 1, this.height + 1);
			// create a new background object

			this.parent.addChild(this.back, this.text);
			// add background and text to the parent container
		}
	}
}


class Display {
	constructor(data) {
		this.cols = data.cols;
		this.rows = data.rows;
		this.size = data.size;
		this.parent = data.parent;
		// data input

		this.length = this.size / 0.714285714;
		this.width = this.cols * this.size;
		this.height = this.rows * this.length;
		// calculations

		this.container = new PIXI.Container();
		this.bgCont = new PIXI.Container();
		this.imgCont = new PIXI.Container();
		this.charCont = new PIXI.Container();
		// create containers for display graphics

		this.container.addChild(this.bgCont, this.imgCont, this.charCont);
		// adds the subcontainers to the main container

		this.bg = new PIXI.Graphics()
			.beginFill(schemes.normal[1])
			.drawRect(this.container.x, this.container.y, this.width, this.height);
		this.bgCont.addChild(this.bg);
		// create CRT background

		this.container.position.set((width / 2) - (this.width / 2), (height / 2) - (this.height / 2));
		// center the main container
		
		this.parent.addChild(this.container);
		// add container to main stage

		this.grid = [];
		for(let y = 0; y < this.rows; y++) {
			this.grid[y] = [];
			for(let x = 0; x < this.cols; x++) this.grid[y][x] = new Character({
				char: ' ',
				x: x * this.size,
				y: y * this.length,
				size: this.size,
				color: schemes.normal[0],
				bg: schemes.normal[1],
				alpha: 0,
				mask: false,
				parent: this.charCont,
			});
		}


		this.menus = {
			main: {
				text: [
					{line: '     mjex     ', x: 13, y: 3,  data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '              ', x: 13, y: 4,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     art      ', x: 13, y: 5,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     music    ', x: 13, y: 6,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     photos   ', x: 13, y: 7,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     videos   ', x: 13, y: 8,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     webdev   ', x: 13, y: 9,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     about    ', x: 13, y: 10, data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '              ', x: 13, y: 11, data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '______________', x: 13, y: 12, data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼           ', x: 13, y: 13, data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer('main'), 500)},
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
					{line: '       art        ', x: 11, y: 5,  data: {color: 0xff0000, bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', x: 11, y: 6,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       deviantart ', x: 11, y: 7,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       back       ', x: 11, y: 8,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', x: 11, y: 9,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', x: 11, y: 10, data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', x: 11, y: 11, data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer('art'), 500)},
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
					{line: '       music      ', x: 11, y: 4,  data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', x: 11, y: 5,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       bandcamp   ', x: 11, y: 6,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       soundcloud ', x: 11, y: 7,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       spotify    ', x: 11, y: 8,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       back       ', x: 11, y: 9,  data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', x: 11, y: 10, data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', x: 11, y: 11, data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', x: 11, y: 12, data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer('music'), 500)},
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
		this.size = size;
		this.length = size / 0.714285714;
		this.width = this.cols * size;
		this.height = this.rows * this.length;

		for(let y = 0; y < this.rows; y++) {
			for(let x = 0; x < this.cols; x++) {
				this.grid[y][x].set({
					x: x * this.size,
					y: y * this.length,
					size: this.size,
				});
			}
		}

		this.container.position.set((window.innerWidth / 2) - (this.width / 2), (window.innerHeight / 2) - (this.height / 2));
		this.bg.width = this.width;
		this.bg.height = this.height;
		// this.container.width = this.width;
		// this.container.height = this.height;
	}

	set(data) {this.grid[data.y][data.x].set(data.data)}

	setline(data) {
		if(typeof data.callback != 'undefined') {chcache.push(data)}
		else {
			for(let i = 0; i < data.line.length; i++) {
				let tempdata = {
					char: data.line[i],
					x: data.x + i,
					y: data.y,
					data: data.data
				};
				
				chcache.push(tempdata);
			};
		}
	}

	multiset(payload) {payload.forEach((line) => this.setline(line))}

	loadMenu(menu) {this.multiset(this.menus[menu].text); this.currentMenu = menu; location.hash = menu == 'main' ? '' : menu}

	clm(callback) {
		this.erasePointer();
		this.menus[this.currentMenu].text.forEach((e) => {
			if(typeof e.callback == 'undefined') {
				for(let i = 0; i < e.line.length; i++) {
					chcache.push({
						char: ' ',
						x: e.x + i,
						y: e.y,
						data: {
							color: 0xff0000,
							bg: schemes.normal[1],
							alpha: 0,
							mask: false
						}
					});
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
				if(this.menus[this.currentMenu].items[this.pointer.pos].text == 'back') {
					this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: '◄'}});
				} else if(this.menus[this.currentMenu].items[this.pointer.pos].text == 'next') {
					this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: '»'}});
				} else if(this.menus[this.currentMenu].items[this.pointer.pos].text == 'prev') {
					this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: '«'}});
				} else {
					this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: '►'}});
				}
			} else {
				this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: ' '}});
			}
		}

		let arrowAnchor = this.menus[this.currentMenu].directionAnchor;
		if(this.pointer.pos == 0) {
			this.set({x: arrowAnchor.x, y: arrowAnchor.y, data: {char: ' '}});
			this.set({x: arrowAnchor.x + 1, y: arrowAnchor.y, data: {char: '▼'}});
		} else if(0 > this.pointer.pos || this.pointer.pos < this.pointer.range - 1) {
			this.set({x: arrowAnchor.x, y: arrowAnchor.y, data: {char: '▲'}});
			this.set({x: arrowAnchor.x + 1, y: arrowAnchor.y, data: {char: '▼'}});
		} else if(this.pointer.pos == this.pointer.range - 1) {
			this.set({x: arrowAnchor.x, y: arrowAnchor.y, data: {char: '▲'}});
			this.set({x: arrowAnchor.x + 1, y: arrowAnchor.y, data: {char: ' '}});
		}
	}

	erasePointer() {
		for(let i = 0; i < this.pointer.range; i++) this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: ' '}});;
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



Mousetrap.bind('up', () => crt.movePointer('up'));
Mousetrap.bind('down', () => crt.movePointer('down'));
Mousetrap.bind('enter', () => crt.select());

let chcache = [];
let ci = 0;
let charloop = setInterval(() => {
	if(chcache.length > 0) {
		if(typeof chcache[ci].callback != 'undefined') chcache[ci].callback()
		else {
			let data = chcache[ci];
			crt.set({
				x: data.x,
				y: data.y,
				data: {
					char: data.char,
					color: data.data.color,
					bg: data.data.bg,
					alpha: data.data.alpha,
					mask: data.data.mask
				}
			});
		}
		ci++;
		if(ci == chcache.length) {chcache = []; ci = 0};
	}
});
