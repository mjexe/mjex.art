let width, height,
	gradient = {pos: 30};
// variable declaration

$(() => {
	setStandards();
	resize();

	anime({
		targets: gradient,
		pos: '70%',
		duration: 60000,
		easing: 'linear',
		direction: 'alternate',
		loop: true,
		update: () => {
			document.documentElement.style.setProperty('--gradient-xpos', gradient.pos)
		}
	});
});


$(window).resize(() => {
	setStandards();
	resize();
});



function setStandards() {
	width = window.innerWidth;
	height = window.innerHeight;
}

function resize() {
	$('.landing-video .video-overlay .main-text').width($('.header .nav')[0].clientWidth);
	$('.landing-video .video-overlay .main-text').fitText(1.4);
}




$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 1000);
});