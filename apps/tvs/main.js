let width,
	height,
	hordiv,
	verdiv,
	itemwidth;
//initializing standards


let tvs = new List({container: '.list-container'});

tvs.additems([
	{
		id: 'HAHA',
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
	
	// $('.container > .footer').css('transform', 'translate(0, ' + (301 * verdiv * -1) + ')')
});

$(window).resize(() => resize());

document.fonts.onloadingdone = () => {
	$('.giga-container')[0].style.opacity = 1;
};




function detailAnim(id) {
	$('.tv-list > .item').animate({opacity: 0}, 500, 'linear', () => {
		$('.list-container').animate({height: '496px'}, 500, 'linear', () => {
			$('.titlebar').animate({width: '826px'}, 500, 'linear');
			$('.header, .footer, .list-container > .tv-list').animate({width: '626px'}, 500, 'linear', () => {
				$('.list-container, .container').css({width: '', height: ''});
				tvs.generatedetails(id);
				setItemWidth();
				
				setTimeout(() => {
					$('.detail-view').animate({opacity: 1}, 500, 'linear');
				}, 250);
			});
		});
	});
}


function goback() {
	tvs.generatelist();
	setItemWidth();
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
}

function setItemWidth() {
	div = Math.floor(((width - 224) / 212));
	hordiv = div >= 2 ? div : 2;
	itemwidth = (212 * hordiv);
	// verdiv = tvs.list[0].children.length / hordiv;

	if($('.detail-view').length > 0) {
		hordiv = 3;
		itemwidth = (212 * hordiv);
		
		$('.detail-view > .view')[0].style.width = (itemwidth - 140) + 'px';
		$('.detail-view > .view > .content > .image')[0].style.width = (itemwidth - 220) + 'px';
	}

	if($('.tv-list').length > 0) {
		$('.tv-list')[0].style.gridTemplateColumns = 'repeat(' + hordiv + ', 200px)';
		$('.tv-list')[0].style.width = (itemwidth - 22) + 'px';
	}

		$('.container > .header')[0].style.width = (itemwidth - 10) + 'px';
	$('.container > .footer')[0].style.width = (itemwidth - 10) + 'px';
	$('.giga-container > .titlebar')[0].style.width = (itemwidth + 190) + 'px';
}
