let menu = new RadialMenu($('.container'));

animate();




function animate() {
	// menu.panel[0].point[1].x = mouseX + 'px ';
	// menu.panel[0].point[1].y = mouseY + 'px ';
	// menu.panel[0].apply();

	requestAnimationFrame(() => animate());
}