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
let intersected;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const spaces = {};
const spacelist = {
	defaultCam: 'default.gltf',
	cam_aux1: 'default.gltf',
	museum: 'museum.gltf',
	secret: 'secret.gltf'
}

const scene  = new THREE.Scene();
const scene2 = new THREE.Scene();
const clock  = new THREE.Clock(true);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
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

			this.gltf.scene.traverse((child) => {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
				
				if(child.isLight) {
					child.castShadow = true;
					child.shadow.bias = -0.0005;
				}
			});

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
					console.log(element3d);
				}

				if(e.userData.type == 'csslink') {
					this.cssGen(e);
				}
			});

			// console.log(this.gltf.scene.getObjectsByProperty('type', 'gltext'));
			// this.gltf.scene.getObjectsByProperty('type', 'gltext').forEach(e => {
			// 	console.log(e.userData)
			// })

			finished();
		});
	}

	cssGen(object, container = null) {
		if(object.userData.type == 'csslink') {
			const link = document.createElement('a');
			link.textContent = object.userData.text;
			link.href = object.userData.href;
			link.setAttribute('rel', 'noopener');
			if(object.userData.class) link.classList.add(object.userData.class);
			if(object.userData.newTab) link.setAttribute('target', '_blank');
			if(object.userData.textColor) link.style.color = object.userData.textColor;

			if(container) {
				container.appendChild(link);
				container.appendChild(document.createElement('br'));
			} else {
				const div = document.createElement('div');
				div.appendChild(link);
				
				const element3d = new CSS3DObject(div);
				element3d.position.copy(object.position);
				element3d.rotation.copy(object.rotation);
				element3d.scale.set(0.1, 0.1, 0.1);
				scene2.add(element3d);
			}
		}
	}
}


resizeUpdate();
loadFromHash(true);



// animation
function animation(time) {
	time = clock.getElapsedTime();
	
	camera.rotation.x = noise.perlin2(time / 8, time / 8) / 50;
	camera.rotation.y = noise.perlin2(-time / 8, -time / 8) / 50;
	camera.position.x = noise.perlin2(time / 4, time / 4) / 16;
	camera.position.y = noise.perlin2(-time / 4, -time / 4) / 16;
	camera.position.z = noise.perlin2(time / 5, time / 5) / 16;
	camera.updateProjectionMatrix();

	raycaster.setFromCamera(pointer, camera);
	const intersects = raycaster.intersectObjects(scene.children);
	if(intersects.length > 0) {
		if(intersected != intersects[0].object) {
			if(intersected) {}
			renderer2.domElement.style.cursor = 'default';

			intersected = intersects[0].object;
			if(intersected.userData.target) {
				if(intersected.userData.changeCursor) renderer2.domElement.style.cursor = 'pointer';
			}
		}
	} else {
		// renderer2.domElement.style.cursor = 'defualt';
		intersected = null;
	}

	renderer.render(scene, camera);
	renderer2.render(scene2, camera);
}



// Random functions for important things
function loadFromHash(firstLoad = false) {
	let hash = window.location.hash.substring(1);
	let cam = hash in spacelist ? hash : 'defaultCam';

	if(!spaces.hasOwnProperty(spacelist[cam])) {
		spaces[spacelist[cam]] = (new Space({
			cameraName: cam,
			forceCam: firstLoad
		}, () => {if(!firstLoad) slerpCam(cam)}));
	} else {
		if(!firstLoad) slerpCam(cam);
	}
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
window.addEventListener('resize', () => {
	resizeUpdate();
});

window.addEventListener('pointermove', (e) => {
	pointer.x = (e.clientX / width) * 2 - 1;
	pointer.y = -(e.clientY / height) * 2 + 1;
});

window.addEventListener('click', (e) => {
	if(intersected.userData.target && intersected.userData.type == 'raylink') {
		window.location.href = intersected.userData.href;
	}
});

window.addEventListener('touchstart', (e) => {
	if(intersected.userData.target && intersected.userData.type == 'raylink') {
		window.location.href = intersected.userData.href;
	}
});

window.addEventListener('hashchange', (e) => {loadFromHash()});

document.addEventListener('keydown', (event) => {
	if(event.code == 'KeyA') slerpCam('cam_aux1');

	if(event.code == 'KeyS') slerpCam('defaultCam');
});


