import { ARButton } from './ARButton.js';
const filename = "scene_mesh_textured";
const filepath = "./assets/Archive4/";

let container;
let camera, scene, renderer;
let controller;
var cameraControls;
var bulbObj
const clock = new THREE.Clock();
var wheelScroll = 0;
var mainObj = null;
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
var sphere, stats, animate;
let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;

init();
animate();
LoadFbx();
animatee();


function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  CameraControls.install({ THREE: THREE });
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
  camera.position.set(0, 0, 70);
  const light1 = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light1.position.set(0.5, 1, 0.25);
  scene.add(light1);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);
  cameraControls = new CameraControls(camera, renderer.domElement);
	cameraControls.dollyToCursor = true;
	cameraControls.maxPolarAngle = 1.24;

	var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  const geometry = new THREE.SphereGeometry(5, 32, 32);
	const material = new THREE.MeshLambertMaterial({ color: 0xffffff, opacity: 0.1, transparent: true });
	sphere = new THREE.Mesh(geometry, material);
	sphere.castShadow = true; //default is false
	sphere.position.set(0, 0, 0);
  //
  const geometry1 = new THREE.SphereGeometry(2, 32, 32);
	const material1 = new THREE.MeshLambertMaterial({ color: 0xff0000 });
	const sphere1 = new THREE.Mesh(geometry1, material1);
	sphere1.castShadow = true; //default is false
  sphere1.position.set(0, 0, 0);
  var cube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), new THREE.MeshLambertMaterial({ color: 0x0000ff }));
  cube.position.set(0, 5, 0);
  var plane = new THREE.Mesh(new THREE.CubeGeometry(30, 0.1, 30), new THREE.MeshLambertMaterial({ color: 0xffcc99 }));
  plane.position.set(0, -11, 0);
  const light = new THREE.DirectionalLight(0xffffff, 10);
	light.position.set(0, 5, 0); //default; light shining from top
	light.rotation.x = toRadians(0);
	light.rotation.y = toRadians(0);
  light.rotation.z = toRadians(0);
  scene.add(light);

	var pointLight = new THREE.PointLight(0xffff4c, 3);
	pointLight.position.set(0, 20, 0);
	scene.add(pointLight);

	var ambientLight = new THREE.AmbientLight(0xffffff, 1);
	scene.add(ambientLight);
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 100, 0);
	controls.update();
  document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));
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
  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  };
  function toDegrees(radians) {
    return radians * 180 / Math.PI;
  }
  function renderr() {
    //sphere.material.envMap = hdrCubeRenderTarget.texture;
    //sphere.material.needsUpdate = true;
    renderer.render(scene, camera);
  }

function StopAnimation() {
	if (mixer != null) {
		mixer.stopAllAction();
	}
}
animate = function animate() {
	const delta = clock.getDelta();
	const hasControlsUpdated = cameraControls.update(delta);
	if (mixer != null) {
		mixer.update(delta);
	};
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};
  //

  const geometry2 = new THREE.CylinderBufferGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);

  function onSelect() {

    if (reticle.visible) {

      // const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
      // const mesh = new THREE.Mesh(geometry2, material);
      // mesh.position.setFromMatrixPosition(reticle.matrix);
      // mesh.scale.y = Math.random() * 2 + 1;
      // scene.add(mesh);
      
      bulbObj.position.setFromMatrixPosition(reticle.matrix);
      bulbObj.visible = true;
    }

  }

  controller = renderer.xr.getController(0);
  controller.addEventListener('select', onSelect);
  scene.add(controller);

  reticle = new THREE.Mesh(
    new THREE.RingBufferGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2),
    new THREE.MeshBasicMaterial()
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  //

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

//
function LoadFbx() {
  let file;
  // result ? file = 'Bulb_Verified_Options' : file = 'Not Verified_Bulb_Options';
  new THREE.RGBELoader().load('./hdr/001_studioHDRI.hdr', function (texture) {
    texture.encoding = THREE.RGBEEncoding;
    texture.flipY = true;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    var loader = new THREE.FBXLoader();
    loader.load('../Glo_Blub_Changes_New Update_2/Bulb_Verified_Options.FBX', function (object) {
      object.traverse(function (child) {
        if (child.isMesh && child.name == "Bulb_Main") {
          //console.log(child);
          child.material.envMap = texture; // assign your diffuse texture here
        }
      });
      bulbObj = object;
      console.log(bulbObj.scale.multiplyScalar(0.05))
      scene.add(object);
      bulbObj.visible = false;
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
function animatee() {

  renderer.setAnimationLoop(render);

}

function render(timestamp, frame) {

  if (frame) {

    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (hitTestSourceRequested === false) {

      session.requestReferenceSpace('viewer').then(function (referenceSpace) {

        session.requestHitTestSource({ space: referenceSpace }).then(function (source) {

          hitTestSource = source;

        });

      });

      session.addEventListener('end', function () {

        hitTestSourceRequested = false;
        hitTestSource = null;

      });

      hitTestSourceRequested = true;

    }

    if (hitTestSource) {

      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length) {

        const hit = hitTestResults[0];

        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);

      } else {

        reticle.visible = false;

      }

    }

  }

  renderer.render(scene, camera);

}