const filename = "scene_mesh_textured";
const filepath = "./assets/Archive4/";
// const filename = "Project-2020-09-25_simplified_3d_mesh.fbx";
// const filename1 = "building_2.FBX";
// const filepath = "./assets/";

console.log(window.innerWidth);
// const filepath = "./assets/mavic/";
// const filename = "Test mavic.fbx";

// const filepath = "./assets/Local/";
// const filename = "Local coordinate.fbx";

// const filepath = "./assets/PIX4D/";
// const filename = "simplified_3d_mesh.fbx";

// const filepath = "./assets/nad83/";
// const filename = "NAD 83.fbx";


const clock = new THREE.Clock();
var scene;
const BACKGROUND_COLOR = 0x111111;
var camera;
var renderer;
var cameraControls;
var wheelScroll = 0;
var mainObj = null;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var latlng = lat215;// lat215;// latTest2 // latlngDataJson // lat225
var finalLatLngArray = [];
var xTotal = 0;
var zTotal = 0;
var altTotal = 0;
var altReducerFactor = 2;
var angleReducerFactor = 90;
var buondingBox;
var countI = 0;
var lastClickedDrone = null;
var lastClickedDroneMaterial = null;
var MAP_WIDTH = 22300;
var MAP_HEIGHT = 14800;
var northWest, northEast;
var sphere, stats;
let video;
function init(result) {
	scene = new THREE.Scene();
	CameraControls.install({ THREE: THREE });
	// container = document.getElementsByClassName('parent')[0];
	// video = document.getElementById('video');
	camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.3, 1000);
	camera.position.set(0, 0, 70);
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.setClearAlpha(0.0);
	// container.appendChild(renderer.domElement);

	document.body.appendChild(renderer.domElement);


	cameraControls = new CameraControls(camera, renderer.domElement);
	cameraControls.dollyToCursor = true;
	cameraControls.maxPolarAngle = 1.24;

	var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	//scene.add( ambientLight );
	//document.addEventListener("click", onMouseOrTouch, false);
	//window.addEventListener("resize", ChangeCanvasSize , false);



	const geometry = new THREE.SphereGeometry(5, 32, 32);
	const material = new THREE.MeshLambertMaterial({ color: 0xffffff, opacity: 0.1, transparent: true });
	sphere = new THREE.Mesh(geometry, material);
	sphere.castShadow = true; //default is false
	sphere.position.set(0, 0, 0);
	//scene.add( sphere );

	const geometry1 = new THREE.SphereGeometry(2, 32, 32);
	const material1 = new THREE.MeshLambertMaterial({ color: 0xff0000 });
	const sphere1 = new THREE.Mesh(geometry1, material1);
	sphere1.castShadow = true; //default is false
	sphere1.position.set(0, 0, 0);
	//scene.add( sphere1 );

	//#ffff4c

	var cube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), new THREE.MeshLambertMaterial({ color: 0x0000ff }));
	cube.position.set(0, 5, 0);
	//scene.add( cube );

	var plane = new THREE.Mesh(new THREE.CubeGeometry(30, 0.1, 30), new THREE.MeshLambertMaterial({ color: 0xffcc99 }));
	plane.position.set(0, -11, 0);
	//scene.add( plane );



	const light = new THREE.DirectionalLight(0xffffff, 10);
	light.position.set(0, 5, 0); //default; light shining from top
	light.rotation.x = toRadians(0);
	light.rotation.y = toRadians(0);
	light.rotation.z = toRadians(0);
	//light.castShadow = true; // default false
	//light.target = sphere;
	scene.add(light);

	var pointLight = new THREE.PointLight(0xffff4c, 3);
	pointLight.position.set(0, 20, 0);
	scene.add(pointLight);

	var ambientLight = new THREE.AmbientLight(0xffffff, 1);
	scene.add(ambientLight);

	LoadFbx(result);


	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 100, 0);
	controls.update();

	window.addEventListener('resize', onWindowResize, false);

	// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	// 	var constraints = { video: { width: 1278, height: 720, facingMode: 'user' } };

	// 	navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {

	// 		// apply the stream to the video element used in the texture

	// 		video.srcObject = stream;
	// 		video.play();

	// 	}).catch(function (error) {

	// 		console.error('Unable to access the camera/webcam.', error);

	// 	});

	// } else {

	// 	console.error('MediaDevices interface not available.');
	// }


}

function ChangeCanvasSize(e) {
	var myCanvas = document.getElementById("view3d");
	var widthCanvas = ConvertPercentageToPx(window.innerWidth, myCanvas.style.width.replace("%", ""));
	var heightCanvas = ConvertPercentageToPx(window.innerHeight, myCanvas.style.height.replace("%", ""));
	myCanvas.width = widthCanvas;
	myCanvas.height = heightCanvas;
	camera.aspect = widthCanvas / heightCanvas;
	camera.updateProjectionMatrix();
	console.log("widthCanvas : " + widthCanvas + " , heightCanvas : " + heightCanvas);

	renderer.setSize(widthCanvas, heightCanvas);

	//console.log(e);
}

function ConvertPercentageToPx(mainData, percentage) {
	return ((mainData * percentage) / 100)
}

// Converts from degrees to radians.
function toRadians(degrees) {
	return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
function toDegrees(radians) {
	return radians * 180 / Math.PI;
}

var clientWidthCanvas = 0;
var clientHeightCanvas = 0;

function renderr() {
	//sphere.material.envMap = hdrCubeRenderTarget.texture;
	//sphere.material.needsUpdate = true;
	renderer.render(scene, camera);
}
var bulbObj = "";
function LoadFbx(result) {
	let file;
	result ? file = 'Bulb_Verified_Options' : file = 'Not Verified_Bulb_Options';
	new THREE.RGBELoader().load('./hdr/001_studioHDRI.hdr', function (texture) {
		texture.encoding = THREE.RGBEEncoding;
		texture.flipY = true;
		texture.mapping = THREE.EquirectangularReflectionMapping;
		var loader = new THREE.FBXLoader();
		loader.load('./bulb/'+ file + '.FBX', function (object) {
			console.log(object);
			object.traverse(function (child) {
				if (child.isMesh && child.name == "Bulb_Main") {
					//console.log(child);
					child.material.envMap = texture; // assign your diffuse texture here
				}
			});

			object.position.set(0, -20, 0);
			bulbObj = object;
			scene.add(object);
			if (object)
				PlayAnimation()
		});
	});
}

var mixer;
function PlayAnimation() {
	mixer = new THREE.AnimationMixer(bulbObj);
	mixer.clipAction(bulbObj.animations[0]).play();
	mixer.timeScale = 1;
}

function StopAnimation() {
	if (mixer != null) {
		mixer.stopAllAction();
	}
}

var animate = function animate() {
	const delta = clock.getDelta();
	const hasControlsUpdated = cameraControls.update(delta);
	if (mixer != null) {
		mixer.update(delta);
	};
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function start(result) {
	init(result);
	//loadObject();
	animate();
}

