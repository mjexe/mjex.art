let width,
	height,
	hordiv,
	verdiv,
	itemwidth;
//initializing standards


let tvs;

/**
 * socket.io stuff
 */

// const socket = io('http://localhost:3000');
// socket.emit('request items');


/**
 * not socket io stuff
 */

$(window).resize(() => resize());






function detailAnim(id) {
	$('.list-container').css('overflow', 'hidden');
	div = Math.floor(((width - 224) / 212));
	hordiv = div >= 4 ? div : 4;
	itemwidth = (212 * hordiv);
	$('div[onclick^=javascript]').attr('onclick', '');

	let anim = anime.timeline({
		easing: 'linear',
		duration: 500,
	});

	anim
	.add({
		targets: '.tv-list > .item',
		duration: 350,
		delay: anime.stagger(
			100, {
				grid: [hordiv, Math.ceil(tvs.items.length / hordiv)],
				from: tvs.getindex(id),
				direction: 'normal',
			}
		),
		opacity: 0,
	})
	.add({
		targets: '.list-container',
		height: '507px',
	})
	.add({
		targets:
			'.container > .header,' +
			'.container > .footer,' +
			'.list-container > .tv-list',
		width: hordiv > 4 ? '848px' : 'initial',
		duration: hordiv > 4 ? 500 : 0,
	})
	.add({
		targets: '.titlebar',
		width: '1048px',
		duration: 500,
		complete: () => {
			tvs.generatedetails(id, 0);
			setItemWidth();

			let subanim = anime.timeline({
				easing: 'linear',
				duration: 500,
			});

			subanim
			.add({
				targets: '.detail-view',
				opacity: 1,
				complete: () => {
					$('.detail-view').css('opacity', 1);
					setTimeout(() => {
						$('#returnbutton').addClass('button');
						$('#returnbutton').text('RETURN');
						$('#returnbutton').attr('onclick', 'javascript:goback()');
					}, 0);
				}
			}, 250);
		},
	}, '-=500');
}



function goback(callback) {
	$('#returnbutton').attr('onclick', '');
	div = Math.floor(((width - 224) / 212));
	hordiv = div >= 4 ? div : 4;
	itemwidth = (212 * hordiv);


	let anim = anime.timeline({
		easing: 'linear',
		duration: 500,
	});

	anim
	.add({
		targets: '.detail-view',
		opacity: 0,
		begin: () => {
			$('#returnbutton').removeClass('button');
			$('#returnbutton').text('');
		},
	})
	.add({
		targets: '.list-container',
		height: (301 * Math.ceil(tvs.items.length / hordiv)) - 12,
		complete: () => {
			if(typeof callback != 'undefined') callback();
			socket.emit('request item refresh');
		},
	})
	.add({
		targets:
			'.container > .header,' +
			'.container > .footer,' +
			'.list-container > .tv-list',
		width: itemwidth + 'px',
		duration: 500,
	})
	.add({
		targets: '.titlebar',
		width: (itemwidth + 200) + 'px',
		duration: hordiv > 3 ? 500 : 0,
		complete: () => {
			tvs.generatelist(0);
			$('.tv-list > .item').attr('onclick', '');
			setItemWidth();

			let subanim = anime.timeline({
				easing: 'linear',
			});

			subanim
			.add({
				targets: '.tv-list > .item',
				duration: 350,
				opacity: 1,
				delay: anime.stagger(
					75, {
						grid: [hordiv, Math.ceil(tvs.items.length / hordiv)],
						from: tvs.getindex(tvs.currentid),
						direction: 'reverse',
					}
				),
				complete: () => {
					tvs.generatelist(1);
				}
			}, 0);
		}
	}, '-=500')
}






function nextimg() {
	let index = tvs.getindex(tvs.currentid);
	let imgnum = tvs.items[index].currentimg;
	if(imgnum == tvs.items[index].images.length - 1) tvs.items[index].currentimg = 0;
	if(imgnum < (tvs.items[index].images.length - 1)) tvs.items[index].currentimg++;

	$('.detail-view .image').css('background-image', 'url(' + tvs.items[index].images[tvs.items[index].currentimg] + ')');
	$('.detail-view .img-url')[0].value = tvs.items[index].images[tvs.items[index].currentimg];
	setItemWidth();
}

function previmg() {
	let index = tvs.getindex(tvs.currentid);
	let imgnum = tvs.items[index].currentimg;
	if(imgnum == 0) tvs.items[index].currentimg = tvs.items[index].images.length - 1;
	if(imgnum > 0) tvs.items[index].currentimg--;

	$('.detail-view .image').css('background-image', 'url(' + tvs.items[index].images[tvs.items[index].currentimg] + ')');
	$('.detail-view .img-url')[0].value = tvs.items[index].images[tvs.items[index].currentimg];
	setItemWidth();
}







function setStandards() {
	width = window.innerWidth;
	height = window.innerHeight;
}


function resize() {
	setStandards();
	setItemWidth();
}

function setItemWidth() {
	div = Math.floor(((width - 224) / 212));
	hordiv = div >= 4 ? div : 4;
	itemwidth = (212 * hordiv);
	// verdiv = tvs.list[0].children.length / hordiv;

	
	if($('.detail-view').length > 0) {
		hordiv = 4;
		itemwidth = (212 * hordiv);
		$('.detail-view > .view')[0].style.width = (itemwidth - 130) + 'px';
	}
	
	if($('.tv-list').length > 0) {
		$('.list-container').css('height', (301 * Math.ceil(tvs.items.length / hordiv)) - 12);
		$('.tv-list')[0].style.gridTemplateColumns = 'repeat(' + hordiv + ', 200px)';
		$('.tv-list')[0].style.width = (itemwidth - 22) + 'px';
	}

	$('.container > .header')[0].style.width = itemwidth + 'px';
	$('.container > .footer')[0].style.width = itemwidth + 'px';
	$('.giga-container > .titlebar')[0].style.width = (itemwidth + 200) + 'px';
}
