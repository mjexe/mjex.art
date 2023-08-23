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
const spaces = [];

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

scene.add(cambox)
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
// camera.rotation.y = 0;
cambox.add(camera);

// console.log(scene)

// const camtgt = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);

// camera.position.z = -1;

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
	constructor(data) {
		this.scene = data.scene ? data.scene : scene;
		this.maincam = data.camera ? data.camera : camera;
		
		gltfLoader.load('assets/gltf/' + data.name, (gltf) => {
			this.gltf = gltf;
			this.scene.add(this.gltf.scene);

			if(data.forceCam) {
				let newcam = this.gltf.scene.getObjectByName('main_cam');
				this.maincam.parent.position.copy(newcam.position);
				this.maincam.parent.rotation.copy(newcam.rotation);
			}


			// console.log(this.gltf)

			// Go through all the objects in the GLTF and find ones that have 'type' tags
			this.gltf.scene.children.forEach((e, i)=> {
				console.log(e.userData);

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

				if(e.userData.type == 'cssdiv') {
					let textAlign = e.userData.textAlign ? e.userData.textAlign : 'left';
					const div = document.createElement('div');
					if(e.userData.class) div.classList.add(e.userData.class);

					if(e.children) {
						e.children.forEach((f) => {
							const link = document.createElement('a');
							link.textContent = f.userData.text;
							link.href = f.userData.href;
							link.setAttribute('rel', 'noopener');
							link.setAttribute('target', '_blank');
							div.appendChild(link);
							div.appendChild(document.createElement('br'));
							console.log(link);
						})
					}

					const element3d = new CSS3DObject(div);
					element3d.position.copy(e.position);
					element3d.scale.set(0.1, 0.1, 0.1);
					scene2.add(element3d);
				}
			})

			// console.log(this.gltf.scene.getObjectsByProperty('type', 'gltext'));
			// this.gltf.scene.getObjectsByProperty('type', 'gltext').forEach(e => {
			// 	console.log(e.userData)
			// })
		});
	}
}


spaces.push(new Space({
	name: 'websitespace.gltf',
	forceCam: true
}));


// Load GLTF;
function oldLoader() {
	let webspace;
	gltfLoader.load('assets/gltf/websitespace.gltf', function(gltf) {
		webspace = gltf;
		scene.add(webspace.scene);
	
		let titlePH = webspace.scene.getObjectByName('textTitle');
		console.log(titlePH.userData);
	
		fontLoader.load(
			'assets/fonts/Fontdiner_Swanky_Regular.json',
			function (font) {
				const textGeo = new TextGeometry('mjexart', {
					font: font,
					size: 2,
					height: 0,
					curveSegments: 12
				});
				
				const textMaterial = new THREE.MeshBasicMaterial({color: 0x98a4ff});
				const textMesh = new THREE.Mesh(textGeo, textMaterial);
				textMesh.position.copy(titlePH.position);
				textMesh.rotation.copy(titlePH.rotation);
				textMesh.translateX(-12.5);
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
				mainlinksObj.translateX(-8.5);
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
}




// animation
function animation(time) {
	time = clock.getElapsedTime();
	
	camera.rotation.x = noise.perlin2(time / 8, time / 8) / 50;
	camera.rotation.y = noise.perlin2(-time / 8, -time / 8) / 50;

	camera.position.x = noise.perlin2(time / 4, time / 4) / 16;
	camera.position.y = noise.perlin2(-time / 4, -time / 4) / 16;
	camera.position.z = noise.perlin2(time / 5, time / 5) / 16;

	// cambox.rotateY(0.01);
	// console.log(camera.rotation.y);

	// camera.position.lerp(camtgt.position, 0.4);
	// camera.rotation.lerp(camtgt.rotation, 0.4);

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
