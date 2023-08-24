// 3D Image Landing Page by mjexart 8/19/2023
// Where would I be without Stackexchange...

import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { FontLoader } from "three/addons/loaders/FontLoader.js"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js"


// Init
noise.seed(Math.random());
let time;
let width, height;
const spaces = {};
const spacelist = {
	defaultCam: 'default.gltf',
	cam_aux1: 'default.gltf'
}

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

const cambox = new THREE.Group();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
cambox.add(camera);
scene.add(cambox)

const gltfLoader = new GLTFLoader();
const fontLoader = new FontLoader();





// add geometry
// scene.background = new THREE.Color(0x888888);

// const sun = new THREE.DirectionalLight(0xffffff, 0.5);
// sun.position.z = 5;
// scene.add(sun);





// Links and stuff object



// Make an automated GLTF loader that uses custom properties for links and labels
// as well as a way to dynamically load in other sections of the webspace

// The space loader that automatically loads in GLTFs and creates things
// from empties and custom properties
class Space {
	constructor(data, finished) {
		this.scene = data.scene ? data.scene : scene;
		this.maincam = data.camera ? data.camera : camera;
		let cameraName = data.cameraName ? data.cameraName : 'defaultCam';
		let spaceFile = spacelist[cameraName] ? spacelist[cameraName] : 'default.gltf';
		
		gltfLoader.load('assets/gltf/' + spaceFile, (gltf) => {
			this.gltf = gltf;
			this.scene.add(this.gltf.scene);

			if(data.forceCam) {
				let newcam = this.gltf.scene.getObjectByName(cameraName);
				this.maincam.parent.position.copy(newcam.position);
				this.maincam.parent.rotation.copy(newcam.rotation);
				this.maincam.fov = newcam.fov;
			}


			// console.log(this.gltf)

			// Go through all the objects in the GLTF and find ones that have 'type' tags
			this.gltf.scene.children.forEach((e, i)=> {
				// console.log(e.userData);

				// Creates GL text for every empty with a 'gltext' type
				if(e.userData.type == 'gltext') {
					let fontName = e.userData.font ? e.userData.font : 'Fontdiner_Swanky_Regular.json';
					let text = e.userData.text ? e.userData.text : 'sample text';
					let textColor = e.userData.textColor ? e.userData.textColor : '#ffffff';
					let textAlign = e.userData.textAlign ? e.userData.textAlign : 'left';

					fontLoader.load('assets/fonts/' + fontName, (font) => {
						const geometry = new TextGeometry(text, {
							font: font,
							size: 2,
							height: 0,
							curveSegments: 12
						});

						const material = new THREE.MeshBasicMaterial({color: textColor});
						const mesh = new THREE.Mesh(geometry, material);
						mesh.position.copy(e.position);
						geometry.computeBoundingBox();
						if(textAlign == 'center') mesh.translateX(-geometry.boundingBox.max.x / 2);
						if(textAlign == 'right') mesh.translateX(-geometry.boundingBox.max.x);
						this.gltf.scene.add(mesh);
					});
				}

				// Creates a <div> with everything inside it for every 'cssdiv' empty
				if(e.userData.type == 'cssdiv') {
					let textAlign = e.userData.textAlign ? e.userData.textAlign : 'left';
					const div = document.createElement('div');
					if(e.userData.class) div.classList.add(e.userData.class);

					if(e.children) {
						e.children.forEach((f) => {
							this.cssGen(f, div);
						})
					}

					const element3d = new CSS3DObject(div);
					element3d.position.copy(e.position);
					element3d.rotation.copy(e.rotation);
					element3d.scale.set(0.1, 0.1, 0.1);
					scene2.add(element3d);
				}
			});

			// console.log(this.gltf.scene.getObjectsByProperty('type', 'gltext'));
			// this.gltf.scene.getObjectsByProperty('type', 'gltext').forEach(e => {
			// 	console.log(e.userData)
			// })

			finished();
		});
	}

	cssGen(object, container) {
		if(object.userData.type == 'csslink') {
			const link = document.createElement('a');
			link.textContent = object.userData.text;
			link.href = object.userData.href;
			link.setAttribute('rel', 'noopener');
			link.setAttribute('target', '_blank');
			if(container) {
				container.appendChild(link);
				container.appendChild(document.createElement('br'));
			} else {
				const element3d = new CSS3DObject(link);
				element3d.position.copy(object.position);
				element3d.rotation.copy(object.rotation);
				element3d.scale.set(0.1, 0.1, 0.1);
				scene2.add(element3d);
			}
		}
	}
}


loadFromHash(true);

console.log(spaces)



// animation
function animation(time) {
	time = clock.getElapsedTime();
	
	camera.rotation.x = noise.perlin2(time / 8, time / 8) / 50;
	camera.rotation.y = noise.perlin2(-time / 8, -time / 8) / 50;

	camera.position.x = noise.perlin2(time / 4, time / 4) / 16;
	camera.position.y = noise.perlin2(-time / 4, -time / 4) / 16;
	camera.position.z = noise.perlin2(time / 5, time / 5) / 16;
	
	camera.updateProjectionMatrix();

	renderer.render(scene, camera);
	renderer2.render(scene2, camera);
}



function loadFromHash(firstLoad) {
	let hash = window.location.hash.substring(1);
	let cam = hash in spacelist ? hash : 'defaultCam';
	console.log(cam);

	if(!spaces.hasOwnProperty(spacelist[cam])) {
		spaces[spacelist[cam]] = (new Space({
			cameraName: cam,
			forceCam: true
		}, () => {if(firstLoad) slerpCam(cam)}));
	}

	console.log(spaces);
}

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


// Smoothly moves the main camera to the camera specified
function slerpCam(to, duration = 1, ease = 'power1.inOut') {
	let newcam = scene.getObjectByName(to);
	let currentQuat = new THREE.Quaternion();
	currentQuat.copy(cambox.quaternion);

	gsap.to(cambox.position, {
		x: newcam.position.x,
		y: newcam.position.y,
		z: newcam.position.z,
		duration: duration,
		ease: ease
	});

	// Quaternions aren't that scary when you don't have to deal with the math
	let tween = {step: 0}
	gsap.to(tween, {
		step: 1,
		duration: duration,
		ease: ease,
		onUpdate: () => {
			cambox.quaternion.slerpQuaternions(currentQuat, newcam.quaternion, tween.step);
		}
	});

	gsap.to(camera, {fov: newcam.fov, duration: duration, ease: ease});
}



// resize canvas
window.addEventListener("resize", () => {
	resizeUpdate();
});

window.addEventListener('hashchange', (e) => {
	let hash = window.location.hash.substring(1);
	console.log(hash);

	let goto = hash in spacelist ? hash : 'defaultCam';
	slerpCam(goto);
}, false);

document.addEventListener('keydown', (event) => {
	if(event.code == 'KeyA') slerpCam('cam_aux1');

	if(event.code == 'KeyS') slerpCam('main_cam');
});


