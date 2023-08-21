// 3D Image Landing Page by mjexart 8/19/2023
// This isn't a template, can you tell I'm proud of that?

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { FontLoader } from "three/addons/loaders/FontLoader.js"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js"

// Init
noise.seed(Math.random());
let time;
let width, height;

const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const clock    = new THREE.Clock(true);

const camPoint1   = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);
camera.position.z = -1;
camera.position.set(10, 10, 10);

const gltfLoader = new GLTFLoader();
const fontLoader = new FontLoader();

// add geometry
scene.background = new THREE.Color(0x888888);

const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.z = 5;
scene.add(sun);



// Links and stuff object



// Load GLTFs

let pic3d;
gltfLoader.load('assets/gltf/beach1.gltf', function(gltf) {
	pic3d = gltf;
	scene.add(pic3d.scene);
	// console.log(pic3d);

	let titlePH = pic3d.scene.getObjectByName('textTitle');

	fontLoader.load(
		'assets/fonts/Caprasimo_Regular.json',
		function (font) {
			const textGeo = new TextGeometry('mjexart', {
				font: font,
				size: 0.3,
				height: 0,
				curveSegments: 12
			});
			
			const textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
			const textMesh = new THREE.Mesh(textGeo, textMaterial);
			textMesh.position.copy(titlePH.position);
			textMesh.rotation.copy(titlePH.rotation);
			scene.add(textMesh);
		}
	);
	
	camera.copy(pic3d.cameras[1])
	camPoint1.copy(camera);
	resizeUpdate();
}, undefined, function(error) {
	console.error(error);
});



// Text test
let fonts = {
	Caprasimo: null
}










// sun.lookAt(textMesh.position);






// Default cube mesh
// const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);





// animation
function animation(time) {
	// if(pic3d) pic3d.rotation.x = time / 2000;
	// if(pic3d) pic3d.scene.rotation.y = time / 1000;
	// mesh.rotation.x += 1;

	// textMesh.rotation.y += 0.01;

	time = clock.getElapsedTime();


	camera.rotation.x = camPoint1.rotation.x + noise.perlin2(time / 8, time / 8) / 50;
	camera.rotation.y = camPoint1.rotation.y + noise.perlin2(-time / 8, -time / 8) / 50;

	camera.position.x = camPoint1.position.x + noise.perlin2(time / 4, time / 4) / 8;
	camera.position.y = camPoint1.position.y + noise.perlin2(-time / 4, -time / 4) / 8;
	camera.position.z = camPoint1.position.z + noise.perlin2(time / 4, time / 4) / 8;
	
	// camera.lookAt(textMesh.position);

	renderer.render(scene, camera);
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
	// renderer.render(scene, camera);
}
