let joe;
// variable declaration

$(() => {
	$('#fullpage').fullpage({
		licenseKey: 'D4687EE4-ECFE4B2E-88DD07CE-3F05A3D6',
		anchors: ['firstPage', 'secondPage', '3rdPage'],

		navigation: 'true',
		navigationPosition: 'right',

		lazyLoading: false,
	});

	//methods
	// $.fn.fullpage.setAllowScrolling(true);
});
