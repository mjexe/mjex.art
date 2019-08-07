let menu = new Display(40, 15, $('.display'));
menu.cls('');


$(() => {
	setTimeout(() => {
		menu.element[0].style.transition = 'none';
		menu.animMultiset([
			['mjex', 18, 2],
			['art',    18, 5],
			['music',  18, 6],
			['photos', 18, 7],
			['video',  18, 8],
			['web',    18, 9],
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
