let width, height, ratio,
	length, orientation,
	crt, bg, frame = 0;
let touch;
let animateFilters = false;
// variable initialization


let img = {
	'ferry-wheel': PIXI.Sprite.from('img/ferry-wheel.png'),
	'no-parking': PIXI.Sprite.from('img/no-parking.png'),
	'reserved': PIXI.Sprite.from('img/reserved.png'),
};
// image loading


// static variable setting
ratio = 680 / 429;


// PIXI.js initialization
type = 'WebGL';
if(!PIXI.utils.isWebGLSupported()) type = 'canvas';
PIXI.utils.sayHello(type);

// create new app instance and resize it to fill the window
let app = new PIXI.Application({resizeTo: window});
app.renderer.backgroundColor = 0x000000;
app.renderer.autoDensity = true;
document.body.appendChild(app.view);
let mouse = app.renderer.plugins.interaction.mouse.global;



$(() => init());

// when the font is loaded this function is called
function init() {
	setStandards();
	// set standard variables

	// create background
	bg = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, width, height);
	app.stage.addChild(bg);

	// create crt display
	crt = new Display({
		cols: 40,
		rows: 18,
		size: findSize(width, height, 0.86, 40, 18),
		parent: app.stage
	});

	loadFilters();
	animate();

	Mousetrap.bind('up', () => {if(typeof crt.pointer != 'undefined') crt.movePointer('up')});
	Mousetrap.bind('down', () => {if(typeof crt.pointer != 'undefined') crt.movePointer('down')});
	Mousetrap.bind('left', () => {if(typeof crt.pointer != 'undefined') crt.select(crt.menus[crt.currentMenu].items.findIndex(item => item.text  == 'back' || item.text  == 'return'))});
	Mousetrap.bind(['enter', 'right'], () => {if(typeof crt.pointer != 'undefined') crt.select()});

	touch = new Hammer(document.body);
	touch.on('swipeup', () => {if(typeof crt.pointer != 'undefined') crt.movePointer('up')});
	touch.on('swipedown', () => {if(typeof crt.pointer != 'undefined') crt.movePointer('down')});
	touch.on('swipeleft', () => {if(typeof crt.pointer != 'undefined') crt.select(crt.menus[crt.currentMenu].items.findIndex(item => item.text  == 'back' || item.text  == 'return'))});
	touch.on('tap', () => {if(typeof crt.pointer != 'undefined') crt.select()});
	touch.on('panstart', (e) => console.log(e.angle));
	touch.on('panend', (e) => console.log(e.angle));

	// load the menu
	setTimeout(() => crt.loadMenu(gethash()), 0);
}

function animate() {
	if(animateFilters) {
		app.stage.filters[2].seed += 0.005;
		app.stage.filters[2].time += 0.05;
		crt.container.filters[0].refresh();
	}

	frame++;
	requestAnimationFrame(animate);
}


// hash change listener
$(window).on('hashchange', () => {
	let hash = gethash();
	if(crt.currentMenu != hash) crt.clm(y => crt.loadMenu(hash));
});

$(window).resize(() => {
	setStandards();
	resizeApp();
	setFilters();
});






// set global variables
function setStandards() {
	width = window.innerWidth;
	height = window.innerHeight;
	length = width / height > ratio ? width : height;
	orientation = width / height > ratio;
	mouse = app.renderer.plugins.interaction.mouse.global;
}

function resizeApp() {
	app.resize();
	bg.width = width;
	bg.height = height;
	crt.resize(findSize(width, height, 0.86, 40, 18));
}

// finds the font size based on the window dimensions
function findSize(w, h, scale, cols, rows) {
	w *= scale;
	h *= scale;
	if(w / h > ratio) return Math.floor((h / rows) / 1.4);
	else return Math.floor(w / cols);
}

// get the hash string from the url
function gethash() {
	let hash = location.hash.substring(1);
	return hash == '' ? 'main' : (crt.menus.hasOwnProperty(hash) ? hash : 'main');
}

// load the crt effect filters
function loadFilters() {
	app.stage.filters = [
		new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0]),
		new PIXI.filters.BlurFilter(0, 3),
		new PIXI.filters.CRTFilter({
			curvature: 0,
			lineWidth: 0,
			lineContrast: 0.3,
			verticalLine: false,
			noise: 0.2,
			noiseSize: 0,
			vignetting: 0.3,
			vignettingAlpha: 1,
			vignettingBlur: 0.3,
			seed: 1000,
			time: 0
		}),
		new PIXI.filters.BulgePinchFilter([0.5, 0.5], 0, 0.2),
		new PIXI.filters.AdvancedBloomFilter({
			threshold: 0.65,
			bloomScale: 0.8,
			brightness: 0.8,
			blur: 5,
			quality: 4
		}),
		new PIXI.filters.AdvancedBloomFilter({
			threshold: 0,
			bloomScale: 0.3,
			brightness: 0.8,
			blur: 40,
			quality: 4
		}),
	];

	crt.imgCont.filters = [
		new PIXI.filters.GlitchFilter({
			seed: 1,
			slices: 1,
			offset: 5,
			direction: 90,
			fillMode: 2,
			red: [0, 0],
			green: [0, 0],
			blue: [0, 0]
		}),
	];

	crt.container.filters = [
		new PIXI.filters.GlitchFilter({
			seed: 1,
			slices: 1,
			offset: 3,
			direction: 90,
			fillMode: 2,
			red: [0, 0],
			green: [0, 0],
			blue: [0, 0]
		}),
	];

	setFilters();
	animateFilters = true;
}

function setFilters() {
	app.stage.filters[0].red[0] = length / 800;
	app.stage.filters[0].blue[0] = -length / 400;

	app.stage.filters[1].blur = orientation ? window.innerHeight / 750 : window.innerWidth / 1500;

	app.stage.filters[2].lineWidth = orientation ? window.innerHeight / 300 : window.innerWidth / 500;
	app.stage.filters[2].noiseSize = orientation ? window.innerHeight / 300 : window.innerWidth / 500;

	app.stage.filters[3].radius = orientation ? window.innerHeight : window.innerWidth * 0.75;

	crt.container.filters[0].offset = length / 750;
}
