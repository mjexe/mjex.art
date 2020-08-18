let slideContainer = document.querySelector('.slide-container');
let slide          = document.querySelector('.slide');

let scrollpos = 0;

slideContainer.addEventListener('wheel', (e) => {
	scrollpos += 1 * Math.sign(e.deltaY);
	if(scrollpos < 0) scrollpos = 0;
	if(scrollpos > slide.children.length - 1) scrollpos = slide.children.length - 1;

	slideContainer.scroll({
		left: slide.children[scrollpos].offsetLeft,
		behavior: 'smooth',
	});

	// slide.children[scrollpos].scrollIntoView({behavior: 'smooth'});


	// slide.scrollLeft = slide.scrollLeft + e.deltaY;
	console.log(scrollpos, slide.children[scrollpos].offsetX);
});