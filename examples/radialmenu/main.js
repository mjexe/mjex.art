let menu = new RadialMenu($('.container'));

animate();




function animate() {
	let angle = angle2p(center.x, center.y, mouseX, mouseY);
	let angle1 = angle - (Math.PI / 8);
	let angle2 = angle + (Math.PI / 8);
	let length = width > height ? width * 2 : height * 2;

	// console.log(angle, angle1, angle2);

	menu.panel[2].point[1].x = (((center.x + (length * Math.cos(angle1))) / width) * 100) + '%';
	menu.panel[2].point[1].y = (((center.y + (length * Math.sin(angle1))) / height) * 100) + '%';

	menu.panel[2].point[2].x = (((center.x + (length * Math.cos(angle2))) / width) * 100) + '%';
	menu.panel[2].point[2].y = (((center.y + (length * Math.sin(angle2))) / height) * 100) + '%';

	menu.panel[2].apply();

	requestAnimationFrame(() => animate());
}


function calcLength(angle) {return Math.abs(center.y / Math.sin(angle))}
