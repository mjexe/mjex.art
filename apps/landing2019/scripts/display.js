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

		// create character array
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
			// ==========================================================================================================================
			'main': {
				text: [
					{line: '      mjex      ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      youtube   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      itch.io   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      accounts  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      about     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼             ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],

				items: [
					{text: 'youtube',   action: x => window.open('//www.youtube.com/@mjexart')},
					{text: 'itch.io',   action: x => window.open('//mjex.itch.io')},
					{text: 'accounts',   action: x => this.clm(y => this.loadMenu('accounts'))},
					{text: 'about',     action: x => this.clm(y => this.loadMenu('about'))},
				],

				scheme: 'normal',
				pointerOffset: 4,
			},



			// ==========================================================================================================================
			'accounts': {
				text: [
					{line: '     accounts     ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      instagram   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      twitter     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      twitch      ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      github      ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      youtube     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      itch.io     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      back        ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'instagram',  action: x => window.open('https://www.instagram.com/mjexart/')},
					{text: 'twitter',  action: x => window.open('https://www.twitter.com/mjexart/')},
					{text: 'twitch',     action: x => window.open('//www.twitch.tv/mjexart')},
					{text: 'github',     action: x => window.open('//github.com/mjexe')},
					{text: 'youtube',   action: x => window.open('//www.youtube.com/@mjexart')},
					{text: 'itch.io',   action: x => window.open('//mjex.itch.io')},
					{text: 'back',       action: x => this.clm(y => this.loadMenu('main'))},
				],

				scheme: 'normal',
				pointerOffset: 4,
			},



			// ==========================================================================================================================
			'about': {
				text: [
					{line: '           about           ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' max lessard\'s website of ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' links to other sites to   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' make it easier for you to ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' find them even though the ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' interface is difficult    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' to use and doesn\'t work  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' well on some browsers...  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' at least it looks cool.   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' probably gonna remake it. ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '___________________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  back                     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'return', action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerAnchor: {x: 7, y: 15},
				directionAnchor: {x: 0, y: -1},
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
		this.imgCont.width = this.width;
		this.imgCont.height = this.height;
	}

	set(data) {this.grid[data.y][data.x].set(data.data)}

	setline(data) {
		if(typeof data.callback != 'undefined') {chcache.push(data)}
		else {
			for(let i = 0; i < data.line.length; i++) {
				let tempdata = {
					char: data.line[i],
					x: data.x + i,
					y: data[i].y,
					data: data.data
				};
				
				chcache.push(tempdata);
			};
		}
	}

	multiset(data) {
		if(typeof data[0].x == 'undefined') data[0].x = Math.floor(this.cols / 2) - Math.floor(data[0].line.length / 2);
		if(typeof data[0].y == 'undefined') data[0].y = Math.floor(this.rows / 2) - Math.floor(data.length / 2);
		for(let line = 0; line < data.length; line++) {
			if(typeof data[line].callback != 'undefined') {chcache.push(data[line])}
			else {
				for(let i = 0; i < data[line].line.length; i++) {
					let tempdata = {
						char: data[line].line[i],
						x: typeof data[line].x == 'undefined' ? data[0].x + i : data[line].x + i,
						y: typeof data[line].y == 'undefined' ? data[0].y + line : data[line].y,
						data: data[line].data
					};
					
					chcache.push(tempdata);
				};
			}
		}
	}

	loadMenu(menu) {this.multiset(this.menus[menu].text); this.currentMenu = menu; location.hash = menu == 'main' ? '' : menu; document.title = 'mjex' + (menu == 'main' ? '' : ' - ' + menu)}

	clm(callback) {
		if(typeof this.pointer != 'undefined') this.erasePointer();
		let firstline = this.menus[this.currentMenu].text[0];
		this.menus[this.currentMenu].text.forEach((e, index) => {
			if(typeof e.callback == 'undefined') {
				for(let i = 0; i < e.line.length; i++) {
					chcache.push({
						char: ' ',
						x: typeof e.x == 'undefined' ? firstline.x + i : e.x + i,
						y: typeof e.y == 'undefined' ? firstline.y + index : e.y,
						data: {
							color: schemes.normal[0],
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
		let x, y, thismenu = this.menus[menu];

		x = Math.floor(this.cols / 2) - Math.floor(thismenu.text[0].line.length / 2),
		y = Math.floor(this.rows / 2) - Math.floor(thismenu.text.length / 2);
		console.log(menu + ': coordinates')
		console.log('top left: ' + x + ', ' + y);
		console.log('btm left: ' + x + ', ' + (y + (thismenu.text.length - 2)));


		if(typeof thismenu.pointerAnchor == 'undefined') {
			thismenu.pointerAnchor = {
				x: x + thismenu.pointerOffset,
				y: y + 2
			};
		}

		if(typeof thismenu.directionAnchor == 'undefined') {
			thismenu.directionAnchor = {
				x: x + 1,
				y: y + (thismenu.text.length - 2)
			};
		}


		this.pointer = new MenuPointer(thismenu.pointerAnchor.x, thismenu.pointerAnchor.y, thismenu.items.length);
		this.pointerUpdate();
	}

	movePointer(direction) {
		switch(direction) {
			case 'up': this.pointer.up(); break;
			case 'down': this.pointer.down(); break;
		}

		this.pointerUpdate();
	}
	
	pointerGoto(pos) {
		if(pos < 0) this.pointer.pos = 0;
		else if(pos > this.pointer.range) this.pointer.pos = this.pointer.range - 1;
		else if(pos >= 0 && pos < this.pointer.range) this.pointer.pos = pos;
		this.pointerUpdate();
	}

	pointerUpdate() {
		let thismenu = this.menus[this.currentMenu];
		for(let i = 0; i < this.pointer.range; i++) {
			if(i == this.pointer.pos) {
				if(thismenu.items[this.pointer.pos].text == 'back') {
					this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: '◄'}});
				} else if(thismenu.items[this.pointer.pos].text == 'next') {
					this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: '»'}});
				} else if(thismenu.items[this.pointer.pos].text == 'prev') {
					this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: '«'}});
				} else {
					this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: '►'}});
				}
			} else {
				this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: ' '}});
			}
		}

		let arrowAnchor = thismenu.directionAnchor;
		if(arrowAnchor.y >= 0) {
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

		thismenu.items.forEach((e) => this.imgCont.removeChild(e.img));
		if(typeof thismenu.items[this.pointer.pos].img != 'undefined') {
			this.imgCont.addChild(thismenu.items[this.pointer.pos].img);
			thismenu.items[this.pointer.pos].img.width = this.width;
			thismenu.items[this.pointer.pos].img.height = this.height;
		}
	}

	erasePointer() {
		this.menus[this.currentMenu].items.forEach((e) => this.imgCont.removeChild(e.img))
		for(let i = 0; i < this.pointer.range; i++) this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: ' '}});;
		this.pointer = undefined;
	}
	
	getSelection(menu) {
		menu = menu || this.currentMenu;
		return this.menus[menu].items[this.pointer.pos];
	}

	select(item, menu) {
		item = typeof item == 'undefined' ? this.pointer.pos : item;
		menu = menu || this.currentMenu;
		if(typeof this.menus[menu].items[item] != 'undefined') this.menus[menu].items[item].action();
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


function up()     {if(typeof crt.pointer != 'undefined') crt.movePointer('up')}
function down()   {if(typeof crt.pointer != 'undefined') crt.movePointer('down')}
function select() {if(typeof crt.pointer != 'undefined') crt.select()}
function esc()    {if(typeof crt.pointer != 'undefined') crt.select(crt.menus[crt.currentMenu].items.findIndex(item => item.text  == 'back' || item.text  == 'return'))}





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





/*
		this.menus = {
			// ==========================================================================================================================
			'main': {
				text: [
					{line: '     mjex     ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '              ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     art      ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     real     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     music    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     photos   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     videos   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     webdev   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     about    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '              ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '______________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],

				items: [
					{text: 'art',    action: x => this.clm(y => this.loadMenu('art'))},
					{text: 'real',   action: x => this.clm(y => this.loadMenu('real'))},
					{text: 'music',  action: x => this.clm(y => this.loadMenu('music'))},
					{text: 'photos', action: x => this.clm(y => this.loadMenu('photos'))},
					{text: 'videos', action: x => this.clm(y => this.loadMenu('videos'))},
					{text: 'webdev', action: x => this.clm(y => this.loadMenu('webdev'))},
					{text: 'about',  action: x => this.clm(y => this.loadMenu('about'))},
				],

				scheme: 'normal',
				pointerOffset: 3,
			},



			// ==========================================================================================================================
			'art': {
				text: [
					{line: '       art        ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       deviantart ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       twitch     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       about      ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       back       ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'deviantart', action: x => location.href = '//www.deviantart.com/mjexe'},
					{text: 'twitch',     action: x => location.href = '//www.twitch.tv/mjexe'},
					{text: 'about',      action: x => this.clm(y => this.loadMenu('art-about'))},
					{text: 'back',       action: x => this.clm(y => this.loadMenu('main'))},
				],

				scheme: 'normal',
				pointerOffset: 5,
			},

			'art-about': {
				text: [
					{line: '        about art        ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' art live streams every  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' once in a while         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '_________________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  back                   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'return', action: x => this.clm(y => this.loadMenu('art'))},
				],
	
				scheme: 'normal',
				pointerAnchor: {x: 8, y: 11},
				directionAnchor: {x: 0, y: -1},
			},



			// ==========================================================================================================================
			'real': {
				text: [
					{line: '       real       ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       tv heads   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       back   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'real', action: x => location.href = 'https://www.etsy.com/listing/745658601/custom-tv-object-head-cosplay'},
					{text: 'back', action: x => this.clm(y => this.loadMenu('main'))},
				],

				scheme: 'normal',
				pointerOffset: 5,
			},

			'art-about': {
				text: [
					{line: '        about art        ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' art live streams every  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' once in a while         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '_________________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  back                   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'return', action: x => this.clm(y => this.loadMenu('art'))},
				],
	
				scheme: 'normal',
				pointerAnchor: {x: 8, y: 11},
				directionAnchor: {x: 0, y: -1},
			},



			// ==========================================================================================================================
			'music': {
				text: [
					{line: '       music      ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       bandcamp   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       soundcloud ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       spotify    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       back       ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'bandcamp',   action: x => location.href = '//mjex.bandcamp.com'},
					{text: 'soundcloud', action: x => location.href = '//soundcloud.com/mjexe'},
					{text: 'spotify',    action: x => location.href = '//open.spotify.com/artist/68wvgLB5yPfYTdrG7HLuk6?si=XGU6jM59Tt21sUh9phcI_w'},
					{text: 'back',       action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerOffset: 5,
			},



			// ==========================================================================================================================
			'photos': {
				text: [
					{line: '       photos       ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       portfolio    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       instagram    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       deviantart   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       back         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '____________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼             ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
				
				items: [
					{text: 'portfolio',  action: x => location.href = 'https://conewave.art/'},
					{text: 'instagram',  action: x => location.href = 'https://www.instagram.com/mjexart/'},
					{text: 'deviantart', action: x => location.href = 'https://www.deviantart.com/mjexart'},
					{text: 'back',        action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerOffset: 5,
			},



			// ==========================================================================================================================
			'videos': {
				text: [
					{line: '      videos      ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      youtube     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      back        ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'hyperverse', action: x => location.href = '//www.youtube.com/channel/UC-uJ-BtQ-5GE52UhBpZF8UQ'},
					{text: 'back',       action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerOffset: 4,
			},



			// ==========================================================================================================================
			'webdev': {
				text: [
					{line: '      webdev      ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      examples    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      hyperverse  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      old version ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      about       ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      back        ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'examples', action: x => location.href = '/examples'},
					{text: 'hyperverse', action: x => location.href = '//hyperve.rs/'},
					{text: 'old version', action: x => location.href = '/old'},
					{text: 'about',      action: x => this.clm(y => this.loadMenu('webdev-about'))},
					{text: 'back',       action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerOffset: 4,
			},

			'webdev-about': {
				text: [
					{line: '        about webdev       ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' 5+ years of front end web ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' development experience    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '___________________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  back                     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'return', action: x => this.clm(y => this.loadMenu('webdev'))},
				],
	
				scheme: 'normal',
				pointerAnchor: {x: 7, y: 11},
				directionAnchor: {x: 0, y: -1},
			},


			
			// ==========================================================================================================================
			'about': {
				text: [
					{line: '           about           ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' max lessard\'s portfolio  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' of weird projects         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '___________________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  back                     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'return', action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerAnchor: {x: 7, y: 11},
				directionAnchor: {x: 0, y: -1},
			},
		}
	}
=======
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

		// create character array
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
			// ==========================================================================================================================
			'main': {
				text: [
					{line: '      mjex      ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      portfolio ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      youtube   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      socials   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      contact   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      about     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼             ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],

				items: [
					{text: 'portfolio', action: x => window.open('//mjex.work/')},
					{text: 'youtube',   action: x => window.open('//www.youtube.com/channel/UC-uJ-BtQ-5GE52UhBpZF8UQ')},
					{text: 'socials',   action: x => this.clm(y => this.loadMenu('socials'))},
					{text: 'contact',   action: x => location.href = 'https://mjex.work/contact'},
					{text: 'about',     action: x => this.clm(y => this.loadMenu('about'))},
				],

				scheme: 'normal',
				pointerOffset: 4,
			},



			// ==========================================================================================================================
			'socials': {
				text: [
					{line: '      socials     ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      instagram   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      deviantart  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      twitch      ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      about       ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      back        ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'instagram',  action: x => window.open('https://www.instagram.com/mjexart/')},
					{text: 'deviantart', action: x => window.open('https://www.deviantart.com/mjexart')},
					{text: 'twitch',     action: x => window.open('//www.twitch.tv/mjexe')},
					{text: 'about',      action: x => this.clm(y => this.loadMenu('art-about'))},
					{text: 'back',       action: x => this.clm(y => this.loadMenu('main'))},
				],

				scheme: 'normal',
				pointerOffset: 4,
			},



			// ==========================================================================================================================
			'about': {
				text: [
					{line: '           about           ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' max lessard\'s portfolio  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' of weird projects         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '___________________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  back                     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'return', action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerAnchor: {x: 7, y: 11},
				directionAnchor: {x: 0, y: -1},
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
		this.imgCont.width = this.width;
		this.imgCont.height = this.height;
	}

	set(data) {this.grid[data.y][data.x].set(data.data)}

	setline(data) {
		if(typeof data.callback != 'undefined') {chcache.push(data)}
		else {
			for(let i = 0; i < data.line.length; i++) {
				let tempdata = {
					char: data.line[i],
					x: data.x + i,
					y: data[i].y,
					data: data.data
				};
				
				chcache.push(tempdata);
			};
		}
	}

	multiset(data) {
		if(typeof data[0].x == 'undefined') data[0].x = Math.floor(this.cols / 2) - Math.floor(data[0].line.length / 2);
		if(typeof data[0].y == 'undefined') data[0].y = Math.floor(this.rows / 2) - Math.floor(data.length / 2);
		for(let line = 0; line < data.length; line++) {
			if(typeof data[line].callback != 'undefined') {chcache.push(data[line])}
			else {
				for(let i = 0; i < data[line].line.length; i++) {
					let tempdata = {
						char: data[line].line[i],
						x: typeof data[line].x == 'undefined' ? data[0].x + i : data[line].x + i,
						y: typeof data[line].y == 'undefined' ? data[0].y + line : data[line].y,
						data: data[line].data
					};
					
					chcache.push(tempdata);
				};
			}
		}
	}

	loadMenu(menu) {this.multiset(this.menus[menu].text); this.currentMenu = menu; location.hash = menu == 'main' ? '' : menu; document.title = 'mjex' + (menu == 'main' ? '' : ' - ' + menu)}

	clm(callback) {
		if(typeof this.pointer != 'undefined') this.erasePointer();
		let firstline = this.menus[this.currentMenu].text[0];
		this.menus[this.currentMenu].text.forEach((e, index) => {
			if(typeof e.callback == 'undefined') {
				for(let i = 0; i < e.line.length; i++) {
					chcache.push({
						char: ' ',
						x: typeof e.x == 'undefined' ? firstline.x + i : e.x + i,
						y: typeof e.y == 'undefined' ? firstline.y + index : e.y,
						data: {
							color: schemes.normal[0],
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
		let x, y, thismenu = this.menus[menu];

		x = Math.floor(this.cols / 2) - Math.floor(thismenu.text[0].line.length / 2),
		y = Math.floor(this.rows / 2) - Math.floor(thismenu.text.length / 2);
		console.log(menu + ': coordinates')
		console.log('top left: ' + x + ', ' + y);
		console.log('btm left: ' + x + ', ' + (y + (thismenu.text.length - 2)));


		if(typeof thismenu.pointerAnchor == 'undefined') {
			thismenu.pointerAnchor = {
				x: x + thismenu.pointerOffset,
				y: y + 2
			};
		}

		if(typeof thismenu.directionAnchor == 'undefined') {
			thismenu.directionAnchor = {
				x: x + 1,
				y: y + (thismenu.text.length - 2)
			};
		}


		this.pointer = new MenuPointer(thismenu.pointerAnchor.x, thismenu.pointerAnchor.y, thismenu.items.length);
		this.pointerUpdate();
	}

	movePointer(direction) {
		switch(direction) {
			case 'up': this.pointer.up(); break;
			case 'down': this.pointer.down(); break;
		}

		this.pointerUpdate();
	}
	
	pointerGoto(pos) {
		if(pos < 0) this.pointer.pos = 0;
		else if(pos > this.pointer.range) this.pointer.pos = this.pointer.range - 1;
		else if(pos >= 0 && pos < this.pointer.range) this.pointer.pos = pos;
		this.pointerUpdate();
	}

	pointerUpdate() {
		let thismenu = this.menus[this.currentMenu];
		for(let i = 0; i < this.pointer.range; i++) {
			if(i == this.pointer.pos) {
				if(thismenu.items[this.pointer.pos].text == 'back') {
					this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: '◄'}});
				} else if(thismenu.items[this.pointer.pos].text == 'next') {
					this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: '»'}});
				} else if(thismenu.items[this.pointer.pos].text == 'prev') {
					this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: '«'}});
				} else {
					this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: '►'}});
				}
			} else {
				this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: ' '}});
			}
		}

		let arrowAnchor = thismenu.directionAnchor;
		if(arrowAnchor.y >= 0) {
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

		thismenu.items.forEach((e) => this.imgCont.removeChild(e.img));
		if(typeof thismenu.items[this.pointer.pos].img != 'undefined') {
			this.imgCont.addChild(thismenu.items[this.pointer.pos].img);
			thismenu.items[this.pointer.pos].img.width = this.width;
			thismenu.items[this.pointer.pos].img.height = this.height;
		}
	}

	erasePointer() {
		this.menus[this.currentMenu].items.forEach((e) => this.imgCont.removeChild(e.img))
		for(let i = 0; i < this.pointer.range; i++) this.set({x: this.pointer.anchor.x, y: this.pointer.anchor.y + i, data: {char: ' '}});;
		this.pointer = undefined;
	}
	
	getSelection(menu) {
		menu = menu || this.currentMenu;
		return this.menus[menu].items[this.pointer.pos];
	}

	select(item, menu) {
		item = typeof item == 'undefined' ? this.pointer.pos : item;
		menu = menu || this.currentMenu;
		if(typeof this.menus[menu].items[item] != 'undefined') this.menus[menu].items[item].action();
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


function up()     {if(typeof crt.pointer != 'undefined') crt.movePointer('up')}
function down()   {if(typeof crt.pointer != 'undefined') crt.movePointer('down')}
function select() {if(typeof crt.pointer != 'undefined') crt.select()}
function esc()    {if(typeof crt.pointer != 'undefined') crt.select(crt.menus[crt.currentMenu].items.findIndex(item => item.text  == 'back' || item.text  == 'return'))}





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





/*
		this.menus = {
			// ==========================================================================================================================
			'main': {
				text: [
					{line: '     mjex     ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '              ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     art      ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     real     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     music    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     photos   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     videos   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     webdev   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '     about    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '              ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '______________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],

				items: [
					{text: 'art',    action: x => this.clm(y => this.loadMenu('art'))},
					{text: 'real',   action: x => this.clm(y => this.loadMenu('real'))},
					{text: 'music',  action: x => this.clm(y => this.loadMenu('music'))},
					{text: 'photos', action: x => this.clm(y => this.loadMenu('photos'))},
					{text: 'videos', action: x => this.clm(y => this.loadMenu('videos'))},
					{text: 'webdev', action: x => this.clm(y => this.loadMenu('webdev'))},
					{text: 'about',  action: x => this.clm(y => this.loadMenu('about'))},
				],

				scheme: 'normal',
				pointerOffset: 3,
			},



			// ==========================================================================================================================
			'art': {
				text: [
					{line: '       art        ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       deviantart ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       twitch     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       about      ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       back       ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'deviantart', action: x => location.href = '//www.deviantart.com/mjexe'},
					{text: 'twitch',     action: x => location.href = '//www.twitch.tv/mjexe'},
					{text: 'about',      action: x => this.clm(y => this.loadMenu('art-about'))},
					{text: 'back',       action: x => this.clm(y => this.loadMenu('main'))},
				],

				scheme: 'normal',
				pointerOffset: 5,
			},

			'art-about': {
				text: [
					{line: '        about art        ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' art live streams every  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' once in a while         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '_________________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  back                   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'return', action: x => this.clm(y => this.loadMenu('art'))},
				],
	
				scheme: 'normal',
				pointerAnchor: {x: 8, y: 11},
				directionAnchor: {x: 0, y: -1},
			},



			// ==========================================================================================================================
			'real': {
				text: [
					{line: '       real       ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       tv heads   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       back   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'real', action: x => location.href = 'https://www.etsy.com/listing/745658601/custom-tv-object-head-cosplay'},
					{text: 'back', action: x => this.clm(y => this.loadMenu('main'))},
				],

				scheme: 'normal',
				pointerOffset: 5,
			},

			'art-about': {
				text: [
					{line: '        about art        ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' art live streams every  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' once in a while         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '_________________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  back                   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'return', action: x => this.clm(y => this.loadMenu('art'))},
				],
	
				scheme: 'normal',
				pointerAnchor: {x: 8, y: 11},
				directionAnchor: {x: 0, y: -1},
			},



			// ==========================================================================================================================
			'music': {
				text: [
					{line: '       music      ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       bandcamp   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       soundcloud ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       spotify    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       back       ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'bandcamp',   action: x => location.href = '//mjex.bandcamp.com'},
					{text: 'soundcloud', action: x => location.href = '//soundcloud.com/mjexe'},
					{text: 'spotify',    action: x => location.href = '//open.spotify.com/artist/68wvgLB5yPfYTdrG7HLuk6?si=XGU6jM59Tt21sUh9phcI_w'},
					{text: 'back',       action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerOffset: 5,
			},



			// ==========================================================================================================================
			'photos': {
				text: [
					{line: '       photos       ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       portfolio    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       instagram    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       deviantart   ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '       back         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '____________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼             ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
				
				items: [
					{text: 'portfolio',  action: x => location.href = 'https://conewave.art/'},
					{text: 'instagram',  action: x => location.href = 'https://www.instagram.com/mjexart/'},
					{text: 'deviantart', action: x => location.href = 'https://www.deviantart.com/mjexart'},
					{text: 'back',        action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerOffset: 5,
			},



			// ==========================================================================================================================
			'videos': {
				text: [
					{line: '      videos      ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      youtube     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      back        ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'hyperverse', action: x => location.href = '//www.youtube.com/channel/UC-uJ-BtQ-5GE52UhBpZF8UQ'},
					{text: 'back',       action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerOffset: 4,
			},



			// ==========================================================================================================================
			'webdev': {
				text: [
					{line: '      webdev      ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      examples    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      hyperverse  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      old version ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      about       ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '      back        ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '__________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  ▼               ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'examples', action: x => location.href = '/examples'},
					{text: 'hyperverse', action: x => location.href = '//hyperve.rs/'},
					{text: 'old version', action: x => location.href = '/old'},
					{text: 'about',      action: x => this.clm(y => this.loadMenu('webdev-about'))},
					{text: 'back',       action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerOffset: 4,
			},

			'webdev-about': {
				text: [
					{line: '        about webdev       ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' 5+ years of front end web ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' development experience    ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '___________________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  back                     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'return', action: x => this.clm(y => this.loadMenu('webdev'))},
				],
	
				scheme: 'normal',
				pointerAnchor: {x: 7, y: 11},
				directionAnchor: {x: 0, y: -1},
			},


			
			// ==========================================================================================================================
			'about': {
				text: [
					{line: '           about           ', data: {color: schemes.normal[0], bg: schemes.normal[0], alpha: 100, mask: true}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' max lessard\'s portfolio  ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: ' of weird projects         ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '                           ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '___________________________', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{line: '  back                     ', data: {color: schemes.normal[0], bg: schemes.normal[1], alpha: 0, mask: false}},
					{callback: x => setTimeout(() => this.createPointer(), 500)},
				],
	
				items: [
					{text: 'return', action: x => this.clm(y => this.loadMenu('main'))},
				],
	
				scheme: 'normal',
				pointerAnchor: {x: 7, y: 11},
				directionAnchor: {x: 0, y: -1},
			},
		}
	}
>>>>>>> ab4f8e5d5e6beac42e7fd8fe2e571fd53f5f42d8
*/
