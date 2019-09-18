let mouseX = 0, mouseY = 0;

// gets mouse position
$('body').mousemove((e) => {
    mouseX = e.pageX;
	mouseY = e.pageY;
});


function rand(min, max, round) {
	let num = Math.random() * (max - min) + min;
	round = typeof round == 'undefined' ? -1 : round * 10;
	if(round > 0) num = Math.round(num * round) / round;
	else if(round == 0) num = Math.round(num);
	return num;
}
