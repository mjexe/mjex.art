let width,
	height,
	hordiv,
	verdiv,
	itemwidth;
//initializing standards


let tvs = new List({container: '.list-container'});

tvs.additems([
	{
		id: 'yh sys',
		thumbnail: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg',
		currentimg: 0,
		images: [
			'https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
			'https://images.unsplash.com/photo-1527555197883-98e27ca0c1ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://static.standard.co.uk/s3fs-public/thumbnails/image/2019/10/18/14/Pixday1710-4.jpg?width=1000&height=614&fit=bounds&format=pjpg&auto=webp&quality=70&crop=16:9,offset-y0.5',
			'https://media.istockphoto.com/photos/hands-forming-a-heart-shape-with-sunset-silhouette-picture-id636379014?k=6&m=636379014&s=612x612&w=0&h=tnYrf_O_nvT15N4mmjorIRvZ7lK4w1q1c7RSfrVmqKA=',
		],
	},

	{
		id: 'gs6usrth',
		thumbnail: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg',
		currentimg: 0,
		images: [
			'https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
			'https://images.unsplash.com/photo-1527555197883-98e27ca0c1ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://static.standard.co.uk/s3fs-public/thumbnails/image/2019/10/18/14/Pixday1710-4.jpg?width=1000&height=614&fit=bounds&format=pjpg&auto=webp&quality=70&crop=16:9,offset-y0.5',
			'https://media.istockphoto.com/photos/hands-forming-a-heart-shape-with-sunset-silhouette-picture-id636379014?k=6&m=636379014&s=612x612&w=0&h=tnYrf_O_nvT15N4mmjorIRvZ7lK4w1q1c7RSfrVmqKA=',
		],
	},

	{
		id: 'agadfgadf',
		thumbnail: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg',
		currentimg: 0,
		images: [
			'https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
			'https://images.unsplash.com/photo-1527555197883-98e27ca0c1ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://static.standard.co.uk/s3fs-public/thumbnails/image/2019/10/18/14/Pixday1710-4.jpg?width=1000&height=614&fit=bounds&format=pjpg&auto=webp&quality=70&crop=16:9,offset-y0.5',
			'https://media.istockphoto.com/photos/hands-forming-a-heart-shape-with-sunset-silhouette-picture-id636379014?k=6&m=636379014&s=612x612&w=0&h=tnYrf_O_nvT15N4mmjorIRvZ7lK4w1q1c7RSfrVmqKA=',
		],
	},

	{
		id: 'asdfasfe',
		thumbnail: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg',
		currentimg: 0,
		images: [
			'https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
			'https://images.unsplash.com/photo-1527555197883-98e27ca0c1ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://static.standard.co.uk/s3fs-public/thumbnails/image/2019/10/18/14/Pixday1710-4.jpg?width=1000&height=614&fit=bounds&format=pjpg&auto=webp&quality=70&crop=16:9,offset-y0.5',
			'https://media.istockphoto.com/photos/hands-forming-a-heart-shape-with-sunset-silhouette-picture-id636379014?k=6&m=636379014&s=612x612&w=0&h=tnYrf_O_nvT15N4mmjorIRvZ7lK4w1q1c7RSfrVmqKA=',
		],
	},

	{
		id: 'asdfefe',
		thumbnail: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg',
		currentimg: 0,
		images: [
			'https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
			'https://images.unsplash.com/photo-1527555197883-98e27ca0c1ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://static.standard.co.uk/s3fs-public/thumbnails/image/2019/10/18/14/Pixday1710-4.jpg?width=1000&height=614&fit=bounds&format=pjpg&auto=webp&quality=70&crop=16:9,offset-y0.5',
			'https://media.istockphoto.com/photos/hands-forming-a-heart-shape-with-sunset-silhouette-picture-id636379014?k=6&m=636379014&s=612x612&w=0&h=tnYrf_O_nvT15N4mmjorIRvZ7lK4w1q1c7RSfrVmqKA=',
		],
	},

	{
		id: 'k777t',
		thumbnail: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg',
		currentimg: 0,
		images: [
			'https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
			'https://images.unsplash.com/photo-1527555197883-98e27ca0c1ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://static.standard.co.uk/s3fs-public/thumbnails/image/2019/10/18/14/Pixday1710-4.jpg?width=1000&height=614&fit=bounds&format=pjpg&auto=webp&quality=70&crop=16:9,offset-y0.5',
			'https://media.istockphoto.com/photos/hands-forming-a-heart-shape-with-sunset-silhouette-picture-id636379014?k=6&m=636379014&s=612x612&w=0&h=tnYrf_O_nvT15N4mmjorIRvZ7lK4w1q1c7RSfrVmqKA=',
		],
	},

	{
		id: 'gsfews',
		thumbnail: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg',
		currentimg: 0,
		images: [
			'https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
			'https://images.unsplash.com/photo-1527555197883-98e27ca0c1ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://static.standard.co.uk/s3fs-public/thumbnails/image/2019/10/18/14/Pixday1710-4.jpg?width=1000&height=614&fit=bounds&format=pjpg&auto=webp&quality=70&crop=16:9,offset-y0.5',
			'https://media.istockphoto.com/photos/hands-forming-a-heart-shape-with-sunset-silhouette-picture-id636379014?k=6&m=636379014&s=612x612&w=0&h=tnYrf_O_nvT15N4mmjorIRvZ7lK4w1q1c7RSfrVmqKA=',
		],
	},

	{
		id: 'r5tgrgs',
		thumbnail: 'https://i.pinimg.com/236x/09/70/97/09709757a8f52c76abc7c81edaf9446e.jpg',
		currentimg: 0,
		images: [
			'https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
			'https://images.unsplash.com/photo-1527555197883-98e27ca0c1ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
			'https://static.standard.co.uk/s3fs-public/thumbnails/image/2019/10/18/14/Pixday1710-4.jpg?width=1000&height=614&fit=bounds&format=pjpg&auto=webp&quality=70&crop=16:9,offset-y0.5',
			'https://media.istockphoto.com/photos/hands-forming-a-heart-shape-with-sunset-silhouette-picture-id636379014?k=6&m=636379014&s=612x612&w=0&h=tnYrf_O_nvT15N4mmjorIRvZ7lK4w1q1c7RSfrVmqKA=',
		],
	},
]);



$(() => {
	setStandards();
	setItemWidth();
	tvs.generatelist();
	setItemWidth();
});

$(window).resize(() => resize());

document.fonts.onloadingdone = () => {
	$('.giga-container')[0].style.opacity = 1;
};





function detailAnim(id) {
	$('.list-container').css('overflow', 'hidden');
	div = Math.floor(((width - 224) / 212));
	hordiv = div >= 3 ? div : 3;
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
		width: '636px',
		duration: hordiv > 3 ? 500 : 0,
	})
	.add({
		targets: '.titlebar',
		width: '836px',
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



function goback() {
	$('#returnbutton').attr('onclick', '');
	div = Math.floor(((width - 224) / 212));
	hordiv = div >= 3 ? div : 3;
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
				}
			}, 250);
		}
	}, '-=500')
}






function nextimg() {
	let index = tvs.getindex(tvs.currentid);
	let imgnum = tvs.items[index].currentimg;
	if(imgnum < (tvs.items[index].images.length - 1)) tvs.items[index].currentimg++;
	tvs.generatedetails(tvs.currentid);
	setItemWidth();
}

function previmg() {
	let index = tvs.getindex(tvs.currentid);
	let imgnum = tvs.items[index].currentimg;
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
	console.log('updog')
}

function setItemWidth() {
	div = Math.floor(((width - 224) / 212));
	hordiv = div >= 3 ? div : 3;
	itemwidth = (212 * hordiv);
	// verdiv = tvs.list[0].children.length / hordiv;

	
	if($('.detail-view').length > 0) {
		hordiv = 3;
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
