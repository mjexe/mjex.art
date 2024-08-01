// Main Site Script for mjex.art by Max Lessard on 3/11/2024

import PhotoSwipeLightbox from '/assets/scripts/photoswipe/photoswipe-lightbox.esm.js';
import PhotoSwipe from '/assets/scripts/photoswipe/photoswipe.esm.js';

Array.prototype.random = function() {
	return this[Math.floor((Math.random() * this.length))];
}


// Hash slinging slasher (the hash page loading stuff)
loadHash();

function loadHash() {
	let hash = window.location.hash.substring(1);
	let pageName = hash == '' ? 'home' : hash;
	loadPage(pageName);
}

const getMeta = (url, cb) => {
	const img = new Image();
	img.onload = () => cb(null, img);
	img.onerror = (err) => cb(err);
	img.src = url;
};


function loadPage(name) {
	// document.getElementById('content').innerHTML = '<object type="text/html" data="assets/html/' + name + '.html"></object>';
	
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'assets/html/' + name + '.html', true);
	xhr.onreadystatechange = function() {
		if(this.readyState !== 4) return;
		if(this.status !== 200) return;
		document.getElementById('content').innerHTML = this.responseText;

		if(name == 'home') randomImage('#landingimg > img', '#landingimg');

		if(name == 'photos') {
			let elements = document.getElementsByClassName('preview-image');

			for(let i = 0; i < elements.length; i++) {
				let category = elements[i].getAttribute('category');
				let random = imgdb['photos-' + category].images.random();
				while(random.b == 0) random = imgdb['photos-' + category].images.random();
				elements[i].style.backgroundImage = 'url(' + imgdb['photos-' + category].path + random.img + '.jpg)';
			}
		}

		// Create image gallery if the hash name matches an entry in the image database
		// I don't know how I wrote this I've been awake for so long
		if(imgdb.hasOwnProperty(name)) {
			let imageGallery = document.createElement('div');
			imageGallery.setAttribute('id', name + '-gallery');
			imageGallery.setAttribute('class', 'pswp-gallery');

			let gallery = '';

			imgdb[name].images.forEach(e => {
				let anchor = '<a ';
				anchor += 'href="' + imgdb[name].path + e.img + '.jpg"';
				anchor += 'data-pswp-width="' + e.w + '"';
				anchor += 'data-pswp-height="' + e.h + '">';
				anchor += '<img src="' + imgdb[name].thumbpath + e.img + '-thumb.jpg"></a>\n';
				gallery += anchor;
			});
			
			imageGallery.innerHTML = gallery;
			document.getElementById(name).appendChild(imageGallery);
		}

		const lightbox = new PhotoSwipeLightbox({
			gallery: '#' + name + '-gallery',
			children: 'a',
			// showHideAnimationType: 'fade',
			wheelToZoom: true,
			pswpModule: PhotoSwipe
		});
	
		lightbox.init();

		// Log the resolutions of all the images in the current gallery to the console
		// let imgarr = [];
		// imgdb[name].images.forEach((e, i) => {
		// 	getMeta(imgdb[name].path + e.img + '.jpg', (err, img) => {
		// 		imgarr[i] = {"width": img.naturalWidth, "height": img.naturalHeight, "img": e.img};
		// 		if(i == imgdb[name].images.length - 1) imgarr.forEach((e, i) => console.log(e.width, e.height, i, e.img));
		// 	});
		// });
	};

	xhr.send();
}



setTimeout(() => {
	if(Cookies.get('navHint') < 2 || Cookies.get('navHint') == undefined) {
		let taphere = document.createElement('img');
		taphere.setAttribute('id', 'taphere');
		taphere.setAttribute('src', 'assets/svg/taphere.svg');
		document.getElementById('signature').appendChild(taphere);
	
		setTimeout(() => {
			taphere.style.opacity = 1;
		}, 50);
	}
}, 2000);


window.addEventListener('hashchange', (e) => {loadHash()});

window.addEventListener("click", e => {
	let notSig = !document.getElementById('signature').contains(e.target);
	let notNav = !document.getElementById('nav-container').contains(e.target);
	let homeButton = document.querySelector('#nav-container > div.logo').contains(e.target);

	
	if(notSig && notNav) {
		toggleNav(false);
	}

	if (homeButton) {
		let hash = window.location.hash.substring(1);
		let pageName = hash == '' ? 'home' : hash;
		if(pageName == 'home' && !document.getElementById('landingimg').contains(e.target)) {
			randomImage('#landingimg > img', '#landingimg');
		}
	}
});

window.addEventListener("dblclick", e => {
	let notSig = !document.getElementById('signature').contains(e.target);
	let notNav = !document.getElementById('nav-container').contains(e.target);
	
	if(notSig && notNav) {
		let hash = window.location.hash.substring(1);
		let pageName = hash == '' ? 'home' : hash;
		if(pageName == 'home' && !document.getElementById('landingimg').contains(e.target)) {
			randomImage('#landingimg > img', '#landingimg');
		}
	}
});



function randomImage(imgQuery, aQuery) {
	let options = [
		'photos-street',
		'photos-landscape',
		'photos-portrait'
	]

	let choice = options.random();
	let random = imgdb[choice].images.random();
	while(random.f == 0) random = imgdb[choice].images.random();
	document.querySelector('#landingimg > img').setAttribute('src', imgdb[choice].path + random.img + '.jpg');
	// document.querySelector('#landingimg > .caption').textContent = imgdb[choice].title + ' Gallery'
	document.getElementById('landingimg').setAttribute('href', '#' + choice);
}
