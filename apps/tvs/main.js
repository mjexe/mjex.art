let width,
	height,
	hordiv,
	verdiv,
	itemwidth;
//initializing standards


let tvs = new List({container: '.list-container'});
loadqueue = [];


loadqueue.push(() => tvs.additem({id: 'haha',     img: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg'}));
loadqueue.push(() => tvs.additem({id: 'dab',      img: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg'}));
loadqueue.push(() => tvs.additem({id: 'dabb',     img: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg'}));
loadqueue.push(() => tvs.additem({id: 'dabbb',    img: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg'}));
loadqueue.push(() => tvs.additem({id: 'dabbbb',   img: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg'}));
loadqueue.push(() => tvs.additem({id: 'dabbbbb',  img: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg'}));


$(() => {
	setStandards();
	setItemWidth();

	// $('.container > .footer').css('transform', 'translate(0, ' + (301 * verdiv * -1) + ')')
});

$(window).resize(() => resize());

document.fonts.onloadingdone = () => {
	// $('.container').animate({opacity: 1}, 250);
	$('.container')[0].style.opacity = 1

	itemqueue();

	// setTimeout(() => itemqueue(), 250);
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
	verdiv = tvs.list[0].children.length / hordiv;
	itemwidth = (212 * hordiv);

	$('.tv-list')[0].style.gridTemplateColumns = 'repeat(' + hordiv + ', 200px)';
	$('.container > .header')[0].style.width = itemwidth + 'px';
	$('.container > .footer')[0].style.width = itemwidth + 'px';
	$('.giga-container > .titlebar')[0].style.width = (itemwidth + 200) + 'px';
}



function itemqueue() {
	if(loadqueue.length > 0) {
		let action = loadqueue.splice(0, 1);
		action[0]();
	}

	setTimeout(() => itemqueue(), 50);
}
