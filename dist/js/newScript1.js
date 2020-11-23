import { ARButton } from './ARButton.js';

let container;
let camera, scene, renderer;
let controller;
var cameraControls;
var bulbObj, animate
const clock = new THREE.Clock();
var sphere;
let reticle;
let hitTestSource = null;
let hitTestSourceRequested = false;
setInterval(() => {
  onSelect();
}, 5000)
init();
animate();
LoadFbx();
animatee();


function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  CameraControls.install({ THREE: THREE });
  camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.3, 1000);
  camera.position.set(0, 0, 70);
  // const light1 = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  // light1.position.set(0.5, 1, 0.25);
  // scene.add(light1);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);
  cameraControls = new CameraControls(camera, renderer.domElement);
  cameraControls.dollyToCursor = true;

  // var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  const geometry = new THREE.SphereGeometry(5, 32, 32);
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff, opacity: 0.1, transparent: true });
  sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true; //default is false
  sphere.position.set(0, 0, 0);
  //scene.add( sphere );
  //
  const geometry1 = new THREE.SphereGeometry(2, 32, 32);
  const material1 = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  const sphere1 = new THREE.Mesh(geometry1, material1);
  sphere1.castShadow = true; //default is false
  sphere1.position.set(0, 0, 0);
  //scene.add( sphere1 );
  var cube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), new THREE.MeshLambertMaterial({ color: 0x0000ff }));
  cube.position.set(0, 18, 3);
  //scene.add( cube );

  var plane = new THREE.Mesh(new THREE.CubeGeometry(30, 0.1, 30), new THREE.MeshLambertMaterial({ color: 0xffcc99 }));
  plane.position.set(0, -11, 0);
  //scene.add( plane );
  var directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  directionalLight.position.set(0, 5, 0); //default; light shining from top
  directionalLight.rotation.x = toRadians(0);
  directionalLight.rotation.y = toRadians(0);
  directionalLight.rotation.z = toRadians(0);
  //light.castShadow = true; // default false
  //light.target = sphere;
  scene.add(directionalLight);

  var pointLight = new THREE.PointLight(0xffff4c, 5, 30);
  pointLight.position.set(0, 20, 3);
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
  var count = 0;
  var blinkCount = 0;
  animate = function () {
    const delta = clock.getDelta();
    const hasControlsUpdated = cameraControls.update(delta);
    if (mixer != null) {
      mixer.update(delta);
    };
    if (reticle.visible && bulbObj && bulbObj.visible) {
      console.log('now bvosokldfas')
      console.log(bulbObj.animations)
    }
    if (count === 20) {
      if (pointLight.intensity == 0) {
        blinkCount++;
        count ++;
        pointLight.intensity = 6;
        if (blinkCount == 5) {
          console.log('x');
          // if (bulbObj.visible) {
          //   console.log('x');
          //   PlayAnimation();
          // }
          console.log("------count 5 times---------");
          pointLight.intensity = 0;
        }
        count = 0;
      } else {
        pointLight.intensity = 0;
        count = 15;
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  //

  const geometry2 = new THREE.CylinderBufferGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);



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
function onSelect() {

  if (reticle.visible) {
    if (bulbObj && !bulbObj.visible) {
      bulbObj.position.setFromMatrixPosition(reticle.matrix);
      bulbObj.visible = true;
    }
    // const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
    // const mesh = new THREE.Mesh(geometry2, material);
    // mesh.position.setFromMatrixPosition(reticle.matrix);
    // mesh.scale.y = Math.random() * 2 + 1;
    // scene.add(mesh);
  }

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
  // new THREE.RGBELoader().load('./hdr/001_studioHDRI.hdr', function (texture) {
  //   texture.encoding = THREE.RGBEEncoding;
  //   texture.flipY = true;
  //   texture.mapping = THREE.EquirectangularReflectionMapping;
  //   var loader = new THREE.FBXLoader();
  //   loader.load('../Glo_Blub_Changes_New Update_2/Bulb_Verified_Options.FBX', function (object) {
  //     object.traverse(function (child) {
  //       if (child.isMesh && child.name == "Bulb_Main") {
  //         //console.log(child);
  //         child.material.envMap = texture; // assign your diffuse texture here
  //       }
  //     });
  //   bulbObj = object;
  //   console.log(bulbObj.scale.multiplyScalar(0.05))
  //   scene.add(object);
  //   bulbObj.visible = false;
  //   if (object)
  //     PlayAnimation()
  // });
  // });
  new THREE.RGBELoader().load('./hdr/001_studioHDRI.hdr', function (texture) {
    texture.encoding = THREE.RGBEEncoding;
    texture.flipY = true;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    //console.log("texture",texture);
    var loader = new THREE.FBXLoader();
    loader.load('../bulb/Not Verified_Bulb_Options.FBX', function (object) {
      //console.log(object);
      object.traverse(function (child) {
        if (child.isMesh && child.name == "Bulb_Main") {
          //console.log(child);
          child.material.envMap = texture; // assign your diffuse texture here
        }
      });

      bulbObj = object;
      console.log(bulbObj.scale.multiplyScalar(0.025))
      scene.add(object);
      // if (object.children[2].name === 'Dummy_Verified') {
        // 220,20,60
        console.log(object.children)
      object.children[0].children.forEach((ele) => {
        // ele.material.color = color.red;
        // ele.material.color.g = 20;
        // ele.material.color.b = 60;
        console.log(ele.material.color)
        console.log(ele)
      });
      object.children[132].children[0].position.z = -8;
      // }
      bulbObj.visible = false;
    });
  });
}
var mixer;
function PlayAnimation() {
  mixer = new THREE.AnimationMixer(bulbObj);
  var aniAction = mixer.clipAction(bulbObj.animations[0]).play();
  console.log(bulbObj.animations)
  aniAction.setLoop(THREE.LoopOnce);
  aniAction.clampWhenFinished = true
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
        if (bulbObj && bulbObj.visible) {
          reticle.visible = false;
        } else {
          reticle.visible = true;
          reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
          PlayAnimation();
        }


      } else {
        reticle.visible = false;
      }

    }

  }

  renderer.render(scene, camera);

};