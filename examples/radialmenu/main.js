let mouseangle = 0;

let menu = new RadialMenu($('.container'));

animate();




function animate() {
	mouseangle = angle2p(mouseX, mouseY, center.x, center.y);
	menu.update();
	
	// let angle = toRadians(30);
	// let angle1 = angle - (Math.PI / 8);
	// let angle2 = angle + (Math.PI / 8);
	// let length = width > height ? width * 2 : height * 2;

	// menu.panel[2].point[1].x = (((center.x + (length * Math.cos(angle1))) / width) * 100) + '%';
	// menu.panel[2].point[1].y = (((center.y + (length * Math.sin(angle1))) / height) * 100) + '%';

	// menu.panel[2].point[2].x = (((center.x + (length * Math.cos(angle2))) / width) * 100) + '%';
	// menu.panel[2].point[2].y = (((center.y + (length * Math.sin(angle2))) / height) * 100) + '%';

	// menu.panel[2].apply();

	requestAnimationFrame(() => animate());
}
