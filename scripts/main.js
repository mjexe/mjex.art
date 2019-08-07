let menu = new Display(40, 15, $('.display'));
menu.cls('');


$(() => {
	setTimeout(() => {
		menu.animMultiset([
			['mjex', 18, 1],
			['work in progress', 12, 3],
		]);
	}, 1250);
});



$(menu.element).hover((x) => console.log(x));











// const T = THREE, PP = POSTPROCESSING;

// let camera, scene, renderer;
// let geometry, material, mesh;

// init();
// animate();

// function init() {
// 	camera = new T.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
// 	camera.position.z = 1;

// 	scene = new T.Scene();

// 	geometry = new T.BoxGeometry(0.2, 0.2, 0.2);
// 	material = new T.MeshNormalMaterial();

// 	mesh = new T.Mesh(geometry, material);
// 	scene.add(mesh);

// 	renderer = new T.WebGLRenderer({antialias: true});
// 	renderer.setSize(window.innerWidth, window.innerHeight);
// 	document.body.appendChild(renderer.domElement);
// }

// function animate() {
// 	requestAnimationFrame(animate);

// 	mesh.rotation.x += 0.01;
// 	mesh.rotation.y += 0.02;

// 	renderer.render(scene, camera);
// }
