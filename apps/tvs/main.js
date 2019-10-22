let width,
	height,
	hordiv,
	verdiv,
	itemwidth;
//initializing standards


let tvs = new List({container: '.list-container'});

tvs.additems([
	{id: 'haha',     img: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg'},
	{id: 'dab',      img: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg'},
	{id: 'dabb',     img: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg'},
	{id: 'dabbb',    img: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg'},
	{id: 'dabbbb',   img: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg'},
	{id: 'dabbbbb',  img: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg'},
]);



$(() => {
	// tvs.generatelist();
	setStandards();
	setItemWidth();
	
	
	// $('.container > .footer').css('transform', 'translate(0, ' + (301 * verdiv * -1) + ')')
});

$(window).resize(() => resize());

document.fonts.onloadingdone = () => {
	$('.giga-container')[0].style.opacity = 1;
	// tvs.generatedetails('haha');
};



function setStandards() {
	width = window.innerWidth;
	height = window.innerHeight;
}


function resize() {
	setStandards();
	setItemWidth();
}

function setItemWidth() {
	hordiv = Math.floor(((width - 224) / 212));
	itemwidth = (212 * hordiv);
	// verdiv = tvs.list[0].children.length / hordiv;

	$('.container > .header')[0].style.width = itemwidth + 'px';
	$('.container > .footer')[0].style.width = itemwidth + 'px';
	$('.giga-container > .titlebar')[0].style.width = (itemwidth + 200) + 'px';

	if($('.detail-view').length > 0) $('.detail-view')[0].style.width = (itemwidth - 5) + 'px';
}
