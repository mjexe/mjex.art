// 3D Image Landing Page by mjexart 8/19/2023
// This isn't a template, can you tell I'm proud of that?

import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { FontLoader } from "three/addons/loaders/FontLoader.js"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js"

// Init
noise.seed(Math.random());
let time;
let width, height;

const scene     = new THREE.Scene();
const scene2    = new THREE.Scene();
const clock     = new THREE.Clock(true);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

const renderer2 = new CSS3DRenderer();
renderer2.setSize(window.innerWidth, window.innerHeight);
renderer2.domElement.style.position = 'absolute';
renderer2.domElement.style.top = 0;
document.body.appendChild(renderer2.domElement);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = -1;
camera.position.set(10, 10, 10);

const gltfLoader = new GLTFLoader();
const fontLoader = new FontLoader();



// add geometry
// scene.background = new THREE.Color(0x888888);

// const sun = new THREE.DirectionalLight(0xffffff, 0.5);
// sun.position.z = 5;
// scene.add(sun);


const camPoint1   = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);



// Links and stuff object



// Make an automated GLTF loader that uses custom properties for links and labels
// as well as a way to dynamically load in other sections of the webspace

// Load GLTF;
let webspace;
gltfLoader.load('assets/gltf/websitespace.gltf', function(gltf) {
	webspace = gltf;
	scene.add(webspace.scene);

	let titlePH = webspace.scene.getObjectByName('textTitle');
	console.log(titlePH.userData);

	fontLoader.load(
		'assets/fonts/Caprasimo_Regular.json',
		function (font) {
			const textGeo = new TextGeometry('mjexart', {
				font: font,
				size: 2,
				height: 0,
				curveSegments: 12
			});
			
			const textMaterial = new THREE.MeshBasicMaterial({color: 0xefa4e0});
			const textMesh = new THREE.Mesh(textGeo, textMaterial);
			textMesh.position.copy(titlePH.position);
			textMesh.rotation.copy(titlePH.rotation);
			textMesh.translateX(-12);
			scene.add(textMesh);


			const mainlinks = document.createElement('div');
			mainlinks.classList.add('main-links')
			mainlinks.innerHTML = `
				<a href ="//www.youtube.com/@mjexart" target="_blank">YouTube</a><br>
				<a href ="//mjex.itch.io" target="_blank">Itch.io</a><br>
				<a href ="//www.instagram.com/mjexart/" target="_blank">Instagram</a><br>
			`

			// Translate main links
			const mainlinksObj = new CSS3DObject(mainlinks);
			mainlinksObj.position.copy(titlePH.position);
			mainlinksObj.translateX(-9);
			mainlinksObj.translateY(-7.5);
			mainlinksObj.translateZ(4.5);
			mainlinksObj.rotation.copy(titlePH.rotation);
			mainlinksObj.scale.x = 0.1;
			mainlinksObj.scale.y = 0.1;
			mainlinksObj.scale.z = 0.1;
			scene2.add(mainlinksObj);
		}
	);
	
	camera.copy(webspace.cameras[1])
	camPoint1.copy(camera);
	resizeUpdate();
}, undefined, function(error) {
	console.error(error);
});




// animation
function animation(time) {
	time = clock.getElapsedTime();
	
	camera.rotation.x = camPoint1.rotation.x + noise.perlin2(time / 8, time / 8) / 50;
	camera.rotation.y = camPoint1.rotation.y + noise.perlin2(-time / 8, -time / 8) / 50;

	camera.position.x = camPoint1.position.x + noise.perlin2(time / 4, time / 4) / 16;
	camera.position.y = camPoint1.position.y + noise.perlin2(-time / 4, -time / 4) / 16;
	camera.position.z = camPoint1.position.z + noise.perlin2(time / 4, time / 4) / 16;

	renderer.render(scene, camera);
	renderer2.render(scene2, camera);
}



// resize canvas
window.addEventListener("resize", () => {
	resizeUpdate();
});

function resizeUpdate() {
	// update display width and height
	width = window.innerWidth;
	height = window.innerHeight;

	// update camera aspect
	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	// update renderer
	renderer.setSize(width, height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer2.setSize(width, height);
	// renderer.render(scene, camera);
}
