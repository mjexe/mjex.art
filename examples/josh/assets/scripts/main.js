let slideContainer = document.querySelector('.slide-container');
let slide          = document.querySelector('.slide');

let scrollpos = 0;



slideContainer.addEventListener('wheel', (e) => {
	scrollpos += 1 * Math.sign(e.deltaY);
	if(scrollpos < 0) scrollpos = 0;
	if(scrollpos > slide.children.length - 1) scrollpos = slide.children.length - 1;

	// slideContainer.scroll({
	// 	left: slide.children[scrollpos].offsetLeft,
	// 	behavior: 'smooth',
	// });


	anime({
		targets: '.slide-container',
		duration: 1000,
		easing: 'easeInOutCirc',
		scrollLeft: slide.children[scrollpos].offsetLeft,
	})
});
