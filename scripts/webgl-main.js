let length = window.innerWidth / window.innerHeight > (680 / 429) ? window.innerHeight : window.innerWidth;
landscape = window.innerWidth / window.innerHeight > (680 / 429);


let type = 'WebGL';
if(!PIXI.utils.isWebGLSupported()) type = 'canvas';
PIXI.utils.sayHello(type);

let app = new PIXI.Application({resizeTo: window});
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = "block";
app.renderer.autoDensity = false;
app.renderer.backgroundColor = 0x202020;
document.body.appendChild(app.view);

let bg = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, window.innerWidth, window.innerHeight).endFill();
app.stage.addChild(bg);

let crt = new Display(40, 18, findSize(window.innerWidth, window.innerHeight, 0.8, 40, 18), app.stage);


$(() => {
	setTimeout(() => {
		crt.loadMenu('main');
	}, 500);
});


$(window).resize(() => {
	length = window.innerWidth / window.innerHeight > (680 / 429) ? window.innerHeight : window.innerWidth;
	landscape = window.innerWidth / window.innerHeight > (680 / 429);

	app.resize();
	bg.width = window.innerWidth; bg.height = window.innerHeight;
	crt.resize(findSize(window.innerWidth, window.innerHeight, 0.8, 40, 18));

	app.stage.filters[0].red[0] = length / 800;
	app.stage.filters[0].blue[0] = length / 650;
	app.stage.filters[1].blur = landscape ? window.innerHeight / 750 : window.innerWidth / 1500;
	app.stage.filters[2].lineWidth = landscape ? window.innerHeight / 300 : window.innerWidth / 500;
	app.stage.filters[2].noiseSize = landscape ? window.innerHeight / 300 : window.innerWidth / 500;
	app.stage.filters[3].radius = landscape ? window.innerHeight : window.innerWidth * 0.75;
});


function findSize(width, height, scale, cols, rows) {
	width *= scale;
	height *= scale;
	if(width / height > (680 / 429)) return Math.floor((height / rows) / 1.4);
	else return Math.floor(width / cols);
}


setInterval(() => {
	app.stage.filters[2].seed += 0.005;
	app.stage.filters[2].time += 0.05;
}, 1);

app.stage.filters = [
	new PIXI.filters.RGBSplitFilter([length / 800, 0], [0, 0], [-length / 650, 0]),
	new PIXI.filters.BlurFilter(landscape ? window.innerHeight / 750 : window.innerWidth / 1500, 3),
	new PIXI.filters.CRTFilter({
		curvature: 0,
		lineWidth: landscape ? window.innerHeight / 300 : window.innerWidth / 500,
		lineContrast: 0.3,
		verticalLine: false,
		noise: 0.2,
		noiseSize: landscape ? window.innerHeight / 300 : window.innerWidth / 500,
		vignetting: 0.3,
		vignettingAlpha: 1,
		vignettingBlur: 0.3,
		seed: 0,
		time: 0
	}),
	new PIXI.filters.BulgePinchFilter([0.5, 0.5], landscape ? window.innerHeight : window.innerWidth * 0.75, 0.3),
];



Mousetrap.bind('left', () => app.renderer.backgroundColor = 0xff0000);
Mousetrap.bind('right', () => app.renderer.backgroundColor = 0x00ff00);
