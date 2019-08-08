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

let crt = new Display(40, 18, findSize(window.innerWidth, window.innerHeight, 0.7, 40, 18), app.stage);


$(() => {
	setTimeout(() => {
		crt.loadMenu('main');
	}, 500);
});


$(window).resize(() => {
	app.resize();
	crt.resize(findSize(window.innerWidth, window.innerHeight, 0.7, 40, 18));
	app.stage.filters[2].radius = window.innerWidth / window.innerHeight > (680 / 429) ? window.innerHeight : window.innerWidth;
});


function findSize(width, height, scale, cols, rows) {
	width *= scale;
	height *= scale;
	if(width / height > (680 / 429)) return Math.floor((height / rows) / 1.4);
	else return Math.floor(width / cols);
}


setInterval(() => {
	app.stage.filters[0].seed += 10;
	app.stage.filters[0].time += 0.05;
}, 1);

app.stage.filters = [
	new PIXI.filters.CRTFilter({
		curvature: 0,
		lineWidth: 3,
		lineContrast: 0.3,
		verticalLine: false,
		noise: 0.2,
		noiseSize: 3,
		vignetting: 0.3,
		vignettingAlpha: 1,
		vignettingBlur: 0.3,
		seed: 1,
		time: 0
	}),
	new PIXI.filters.RGBSplitFilter([1.2, 0], [0, 0], [-2, 0]),
	new PIXI.filters.BulgePinchFilter([0.5, 0.5], window.innerWidth / window.innerHeight > (680 / 429) ? window.innerHeight : window.innerWidth, 0.4),
];



Mousetrap.bind('left', () => app.renderer.backgroundColor = 0xff0000);
Mousetrap.bind('right', () => app.renderer.backgroundColor = 0x00ff00);
