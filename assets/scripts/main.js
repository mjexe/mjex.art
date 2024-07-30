// Main Site Script for mjex.art by Max Lessard on 3/11/2024

import PhotoSwipeLightbox from '/assets/scripts/photoswipe/photoswipe-lightbox.esm.js';
import PhotoSwipe from '/assets/scripts/photoswipe/photoswipe.esm.js';

Array.prototype.random = function() {
	return this[Math.floor((Math.random() * this.length))];
}


loadHash();

function loadHash() {
	let hash = window.location.hash.substring(1);
	let pageName = hash == '' ? 'home' : hash;
	loadPage(pageName);
}


function loadPage(name) {
	// document.getElementById('content').innerHTML = '<object type="text/html" data="assets/html/' + name + '.html"></object>';
	
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'assets/html/' + name + '.html', true);
	xhr.onreadystatechange = function() {
		if(this.readyState !== 4) return;
		if(this.status !== 200) return;
		document.getElementById('content').innerHTML = this.responseText;

		if(name == 'home') {
			let options = [
				'photos-street',
				'photos-landscape',
				'photos-portrait'
			]

			let choice = options.random();
			let random = imgdb[choice].images.random();
			while(random.f == 0) random = imgdb[choice].images.random();
			document.querySelector('#landingimg > img').setAttribute('src', random.img);
			document.getElementById('landingimg').setAttribute('href', '#' + choice);
		}

		if(name == 'photos') {
			let elements = document.getElementsByClassName('preview-image');

			for(let i = 0; i < elements.length; i++) {
				let category = elements[i].getAttribute('category');
				let random = imgdb['photos-' + category].images.random();
				while(random.b == 0) random = imgdb['photos-' + category].images.random();
				elements[i].style.backgroundImage = 'url(' + random.img + ')';
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
				anchor += 'href="' + e.img + '" ';
				anchor += 'data-pswp-width="' + e.w + '" ';
				anchor += 'data-pswp-height="' + e.h + '">';
				anchor += '<img src="' + e.thm + '"></a>\n';
				gallery += anchor;
			});
			
			imageGallery.innerHTML = gallery;
			document.getElementById(name).appendChild(imageGallery);
		}

		const lightbox = new PhotoSwipeLightbox({
			gallery: '#' + name + '-gallery',
			children: 'a',
			// showHideAnimationType: 'fade',
			pswpModule: PhotoSwipe
		});
	
		lightbox.init();
	};

	xhr.send();
}


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

	// console.log(navShown);
	// console.log(sigContains, navContains);
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

	// console.log(navShown);
	// console.log(sigContains, navContains);
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
	document.querySelector('#landingimg > img').setAttribute('src', random.img);
	document.getElementById('landingimg').setAttribute('href', '#' + choice);
}


