let joe;
// variable declaration

$(() => {
	// $('#fullpage').fullpage({
	// 	licenseKey: 'D4687EE4-ECFE4B2E-88DD07CE-3F05A3D6',
	// 	anchors: [
	// 		'landing',
	// 		'headliners',
	// 		'lineup',
	// 		'about',
	// 		'tickets',
	// 		'participate',
	// 	],
	// 	sectionsColor: ['#42ad4e', '#13251400', '#34913f', '#2a7833', '#1f5926'],

	// 	navigation: 'true',
	// 	navigationPosition: 'right',
	// 	// scrollingSpeed: 0,

	// 	lazyLoading: false,


	// 	onLeave: (prigin, destination) => {
	// 		if(destination.isFirst) $('.backtotop').hide();
	// 		else $('.backtotop').show();
	// 	}
	// });


	// $(window).resize((e) => checkWidth());


	// checkWidth();

	//methods
	// $.fn.fullpage.setAllowScrolling(true);
});



function checkWidth() {
	if(window.innerWidth < 700) fullpage_api.setAutoScrolling(false);
	else fullpage_api.setAutoScrolling(true);
}

