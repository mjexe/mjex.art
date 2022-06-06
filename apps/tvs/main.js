let width,
	height,
	hordiv,
	verdiv,
	itemwidth;
//initializing standards


let tvs = new List({container: '.list-container'});
let test;

/**
 * socket.io stuff
 */

// const socket = io('http://localhost:3000');
const socket = io('https://mjex.art:3000');

socket.on('send all items', (data) => {
	let hash = window.location.hash.substring(1);
	tvs.items = data.items;

	if(tvs.items.some((e) => {return e.id == hash})) {
		tvs.generatedetails(hash);
		$('#returnbutton').addClass('button');
		$('#returnbutton').text('RETURN');
		$('#returnbutton').attr('onclick', 'javascript:window.location.hash = ""');
	} else {
		tvs.generatelist();
	}

	setItemWidth();
	let anim = anime.timeline({
	easing: 'linear',
	duration: 1000,
	});

	anim
	.add({
		targets: '.giga-container',
		opacity: 1,
	}, 0);
});


socket.on('refresh items', (data) => {
	let currentimg = tvs.items[tvs.getindex(tvs.currentid) < 0 ? 0 : tvs.getindex(tvs.currentid)].currentimg;
	tvs.items = data.items;
	tvs.currentid = tvs.getindex(tvs.currentid) < 0 ? tvs.items[0].id : tvs.currentid;
	tvs.items[tvs.getindex(tvs.currentid)].currentimg = currentimg;

	if($('.detail-view').length > 0) {
		let index = tvs.getindex(tvs.currentid);
		let data  = tvs.items[index];

		let setstuff = () => {
			$('.detail-view .detail[name="dimensions"').html(data.dimensions);
			$('.detail-view .detail[name="color"').html(data.color);
			$('.detail-view .detail[name="style"').html(data.style);
			$('.detail-view .description').html(data.description);
	
			$('.detail-view .stock')[0].textContent = data.stock ? 'AVAILABLE' : 'TAKEN';
			$('.detail-view .stock')[0].style.color = 'var(--' + ($('.detail-view .stock')[0].textContent == 'AVAILABLE' ? 'stock-available' : 'stock-none') + ')';
	
			$('.detail-view .image').css('background-image', 'url(' + tvs.items[index].images[tvs.items[index].currentimg] + ')');
		}

		if(!data.visible) window.location.hash = '';
		else setstuff();
	}

	if($('.tv-list').length > 0) {
		tvs.generatelist();
		setItemWidth();
	}
});


socket.on('item deleted', (data) => {
	if(data.item.id == tvs.currentid) window.location.hash = '';
})

/**
 * not socket io stuff
 */



$(() => {
	setStandards();
	socket.emit('request items');

	if (Modernizr.cssscrollbar) {
		let scrollbarStyle = document.createElement('style');
		document.head.appendChild(scrollbarStyle);
		
		scrollbarStyle.sheet.insertRule('.detail-view > .view > .content > .info > .description::-webkit-scrollbar {width: 3px}');
		scrollbarStyle.sheet.insertRule(
			'.detail-view > .view > .content > .info > .description {' +
				'transform: translateX(8px);' +
				'padding-right: 5px;' +
			'}'
		);

		scrollbarStyle.sheet.insertRule(
			'.detail-view > .view > .content > .info > .description::-webkit-scrollbar-thumb {' +
				'background: var(--detail-bg);' +
				'border-radius: 3px;' +
			'}'
		);
	}
});

document.fonts.onloadingdone = () => {};
$(window).resize(() => resize());





function sethash(string) {
	if(typeof string == 'undefined') string = '';
	window.location.hash = string;
}

window.addEventListener('hashchange', () => {
	if(typeof this.animating == 'undefined') this.animating = '';
	if(typeof this.callback == 'undefined') this.callback = () => {};
	let hash = window.location.hash.substring(1);

	let anim = () => {
		if(this.animating == '') {
			if(tvs.items.some((e) => {return e.id == hash})) {
				tvs.items[tvs.getindex(hash)].currentimg = 0;
				if($('.detail-view').length > 0) {
					tvs.generatedetails(hash);
					setItemWidth();
				} else {
					this.animating = 'detail';
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
								from: tvs.getindex(hash),
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
							tvs.generatedetails(hash, 0);
							setItemWidth();
							this.animating = 'detail-visible';
				
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
										$('#returnbutton').attr('onclick', 'javascript:window.location.hash = ""');
										this.animating = '';
										this.callback(this.callback = () => {});
									}, 0);
								}
							}, 250);
						},
					}, '-=500');
				}
			} else {
				this.animating = 'main';
				// if(!disablerefresh) socket.emit('request item refresh');
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
					}
				})
				.add({
					targets: '.list-container',
					height: (301 * Math.ceil(tvs.items.length / hordiv)) - 12,
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
								tvs.items[tvs.getindex(tvs.currentid)].currentimg = 0;
								this.animating = '';
								this.callback(this.callback = () => {});
							}
						}, 0);
					}
				}, '-=500');
			}
		} else {
			if(this.animating == 'detail-visible') {
				if(tvs.items.some((e) => {return e.id == hash})) {
					tvs.generatedetails(hash, 0);
					setItemWidth();
				}
			} else {
				this.callback = (cb) => {anim(); cb()}
			}
		}
	}

	anim();
}, false);

function detailAnim(id) {
}



function goback(disablerefresh) {
}






function nextimg() {
	let index = tvs.getindex(tvs.currentid);
	let imgnum = tvs.items[index].currentimg;
	if(imgnum == tvs.items[index].images.length - 1) tvs.items[index].currentimg = 0;
	if(imgnum < (tvs.items[index].images.length - 1)) tvs.items[index].currentimg++;

	tvs.generatedetails(tvs.currentid);
	setItemWidth();
}

function previmg() {
	let index = tvs.getindex(tvs.currentid);
	let imgnum = tvs.items[index].currentimg;
	if(imgnum == 0) tvs.items[index].currentimg = tvs.items[index].images.length - 1;
	if(imgnum > 0) tvs.items[index].currentimg--;

	tvs.generatedetails(tvs.currentid);
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
