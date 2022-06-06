let joe;
// variable declaration

$(() => {
	$('#fullpage').fullpage({
		licenseKey: 'D4687EE4-ECFE4B2E-88DD07CE-3F05A3D6',
		anchors: ['landing', 'lineup', '3rdPage'],
		sectionsColor: ['#42ad4e', '#eeeeee', '#34913f', '#2a7833', '#1f5926'],

		navigation: 'true',
		navigationPosition: 'right',
		scrollingSpeed: 0,

		lazyLoading: false,
	});

	//methods
	// $.fn.fullpage.setAllowScrolling(true);
});
