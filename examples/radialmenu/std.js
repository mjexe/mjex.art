let mouseX, mouseY,
	width, height, center;
// initialize vars

setStandards();



// gets mouse position
$('body').mousemove((e) => {
    mouseX = e.pageX;
	mouseY = e.pageY;
});

$(window).resize(() => {
	setStandards();
});



function setStandards() {
	width = window.innerWidth;
	height = window.innerHeight;

	center = {x: width / 2, y: height / 2};
}

function rand(min, max, round) {
	let num = Math.random() * (max - min) + min;
	round = typeof round == 'undefined' ? -1 : round * 10;
	if(round > 0) num = Math.round(num * round) / round;
	else if(round == 0) num = Math.round(num);
	return num;
}

function angle2p(x1, y1, x2, y2) {
	return Math.atan2(y2 - y1, x2 - x1) + Math.PI;
}
