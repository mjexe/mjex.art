// const socket = io('http://localhost:3000');
const socket = io('https://mjex.art:3000');

socket.on('console login accepted', (data) => {
	console.log('accepted: ', data.session);
	Cookies.set('SESSION', data.session, {expires: 1});
	

	let anim = anime.timeline({
		easing: 'linear',
		duration: 1000,
	});

	anim
	.add({
		targets: '.capsule',
		opacity: 0,
		begin: () => {
			$('input').attr('disabled', true);
		},
		complete: () => socket.emit('console validate session', {session: Cookies.get('SESSION')}),
	});
});


socket.on('console login rejected', (data) => {
	console.log('rejected: ', data);

	$('input[name=username]')[0].value = '';
	$('input[name=password]')[0].value = '';

	$('.container > .login-modal > .right-content > .footer > .title').text('REJECTED');
	$('.container > .login-modal > .right-content > .footer > .title').css({color: 'hsl(346, 50%, 60%)'});
	setTimeout(() => {
		$('.container > .login-modal > .right-content > .footer > .title').text('MGMT CONSOLE');
		$('.container > .login-modal > .right-content > .footer > .title').css({color: 'white'});
	}, 2000);
});





socket.on('console session validated', (data) => {
	$('.capsule').html(
		'<div class="giga-container">' +
			'<div class="titlebar">' +
				'<div class="left"></div>' +
				'<div class="spacer"></div>' +
				'<div class="title">MANAGEMENT CONSOLE</div>' +
				'<div class="right"></div>' +
			'</div>' +

			'<div class="outer">' +
				'<div class="menu">' +
					'<div class="top"></div>' +
		
					'<ul class="buttons">' +
						'<li>ADD ITEM</li>' +
						'<li>REFRESH SESSION</li>' +
					'</ul>' +
					
					'<div class="spacer"></div>' +
					'<div class="spacer" id="returnbutton"></div>' +
					'<div class="bottom"></div>' +
				'</div>' +
		
				'<div class="container">' +
					'<div class="header">' +
						'<div class="transition"><div class="corner"></div></div>' +
						'<div class="left"></div>' +
						'<div class="title">OVERVIEW</div>' +
						'<div class="right"></div>' +
					'</div>' +
					
					'<div class="list-container"></div>' +
					
					'<div class="footer">' +
						'<div class="transition"><div class="corner"></div></div>' +
						'<div class="left"></div>' +
						'<div class="title">© 2019</div>' +
						'<div class="right"></div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>'
	);

	tvs = new List({container: '.list-container'});
	socket.emit('console request items', {session: Cookies.get('SESSION')});
})


socket.on('console session rejected', (data) => {
	let anim = anime.timeline({
		easing: 'linear',
		duration: 1000,
	});

	anim
	.add({
		targets: '.capsule',
		opacity: 0,
		complete: () => {
			$('.capsule').html(
				'<div class="login-modal">' +
					'<div class="left-bar">' +
						'<div class="top"></div>' +
						'<div class="label">USERNAME</div>' +
						'<div class="label">PASSWORD</div>' +
						'<div class="bottom"></div>' +
					'</div>' +
					
					'<div class="right-content">' +
						'<div class="header">' +
							'<div class="transition"></div>' +
							'<div class="spacer"></div>' +
							'<div class="title">LOGIN</div>' +
							'<div class="right"></div>' +
						'</div>' +
		
						'<div class="content">' +
							'<div class="input" onmouseup="this.children[1].focus()" on>' +
								'<div class="spacer"></div>' +
								'<input type="text" name="username">' +
								'<div class="spacer"></div>' +
								'<div class="right"></div>' +
							'</div>' +
		
							'<div class="input" onmouseup="this.children[1].focus()" on>' +
								'<div class="spacer"></div>' +
								'<input type="password" name="password">' +
								'<div class="spacer"></div>' +
								'<div class="right"></div>' +
							'</div>' +
						'</div>' +
		
						'<div class="footer">' +
							'<div class="transition"></div>' +
							'<div class="spacer"></div>' +
							'<div class="title">MGMT CONSOLE</div>' +
							'<div class="spacer"></div>' +
							'<div class="right"></div>' +
						'</div>' +
					'</div>' +
				'</div>'
			);
		
			$('.capsule > .login-modal > .right-content > .content > .input > input')[0].focus();
		
		
			$('input').on('keyup', (e) => {
				if(e.which == 13) {
					socket.emit('console login', {
						username: escape($('input[name=username]')[0].value),
						password: escape($('input[name=password]')[0].value),
					});
				}
			});
		
			
			let anim2 = anime.timeline({
				easing: 'linear',
				duration: 1000,
			});
		
			anim2
			.add({
				targets: '.capsule',
				opacity: 1,
			});
		}
	});

});



$(() => {
	setStandards();
	socket.emit('console validate session', {session: Cookies.get('SESSION')});
	
	if (Modernizr.cssscrollbar) {
		let scrollbarStyle = document.createElement('style');
		document.head.appendChild(scrollbarStyle);
		

		scrollbarStyle.sheet.insertRule(
			'.detail-view > .view > .content > .info > textarea.description {' +
				'transform: translateX(8px);' +
			'}'
		);

		scrollbarStyle.sheet.insertRule('.detail-view > .view > .content > .info > 			textarea.description::-webkit-scrollbar {' +
				'width: 3px;' +
			'}'
		);

		scrollbarStyle.sheet.insertRule(
			'.detail-view > .view > .content > .info > textarea.description::-webkit-scrollbar-thumb {' +
				'background: var(--detail-bg);' +
				'border-radius: 3px;' +
			'}'
		);
	}
});

document.fonts.onloadingdone = () => {};




socket.on('console send items', (data) => {
	tvs.items = data.items;
	tvs.generatelist();
	setItemWidth();


	let anim = anime.timeline({
		easing: 'linear',
		duration: 1000,
	});

	anim
	.add({
		targets: '.capsule',
		opacity: 1,
	});
});


socket.on('refresh items', (data) => {
	tvs.items = data.items;

	if($('.detail-view').length > 0) {
		let index = tvs.getindex(tvs.currentid);
		let data  = tvs.items[index];

		$('.detail-view input[placeholder="DIMENSIONS"')[0].value = data.dimensions;
		$('.detail-view input[placeholder="COLOR"')[0].value = data.color;
		$('.detail-view input[placeholder="STYLE"')[0].value = data.style;
		$('.detail-view textarea[placeholder="DESCRIPTION"')[0].value = data.description;

		$('.detail-view .stock')[0].textContent = data.stock ? 'AVAILABLE' : 'TAKEN';
		$('.detail-view .stock')[0].style.color = 'var(--' + ($('.detail-view .stock')[0].textContent == 'AVAILABLE' ? 'stock-available' : 'stock-none') + ')';
	}

	if($('.tv-list').length > 0) {
		tvs.generatelist();
		setItemWidth();
	}
});




function saveItems() {
	let index = tvs.getindex(tvs.currentid);
	let data  = tvs.items[index];

	tvs.items[index].dimensions  = $('.detail-view input[placeholder="DIMENSIONS"')[0].value;
	tvs.items[index].color       = $('.detail-view input[placeholder="COLOR"')[0].value;
	tvs.items[index].style       = $('.detail-view input[placeholder="STYLE"')[0].value;
	tvs.items[index].description = $('.detail-view textarea[placeholder="DESCRIPTION"')[0].value;
	tvs.items[index].stock       = $('.detail-view .stock')[0].textContent == 'AVAILABLE';

	// $('.detail-view .img-url')[0].value;

	socket.emit('console edit item', {
		session: Cookies.get('SESSION'),
		items: tvs.items,
	});
}



function makeID(length) {
	let genid = (ln) => {
		let id = '';
		let characters = 'ABCDEFGHIJKLMNOPRSTUVWXYZ0123456789';
		for (let i = 0; i < ln; i++) id += characters.charAt(Math.floor(Math.random() * characters.length));
		return id;
	}

	let result = genid(length);
	while(tvs.items.some((e) => {return e.id == result})) result = genid(length);
	return result;
}




/**
 * todo:
 * 
 * make it so you can add items and have as many images as needed
 * 
 * auto id generator
 * 
 * persistent item storage
 * 
 * remove items
 * 
 * more stuff in the detail view like view count and if its available
 * 
 * hover animations
 * 
 */
//
