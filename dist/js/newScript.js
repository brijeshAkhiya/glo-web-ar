import { ARButton } from './ARButton.js';

let container;
let camera, scene, renderer;
let controller;
var cameraControls;
var bulbObj, animate, verifiedText, gloLogoObj, drops;
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
  pointLight.intensity = 0;
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
  var blinkCount = 0;
  var count = 0;
  animate = function () {
    const delta = clock.getDelta();
    const hasControlsUpdated = cameraControls.update(delta);
    if (vTextAni != null) {
      vTextAni.update(delta);
    };
    if (gloLogoani != null) {
      gloLogoani.update(delta);
    };
    if (dropsAni != null) {
      dropsAni.update(delta);
    };
    if (mixer != null) {
      mixer.update(delta);
    };
    if (bulbObj && bulbObj.visible)
      count++;
    if (count === 25) {
      if (bulbObj && bulbObj.visible) {
        blinkCount++;
      switch (blinkCount) {
        case 1:
          pointLight.intensity = 3;
          break;
        case 2:
          pointLight.intensity = 0;
          break;
        case 3:
          pointLight.intensity = 6;
          break;
        case 4:
          pointLight.intensity = 0;
          break;
        case 5:
          pointLight.intensity = 12;
          bulbObj.children[13].material.color.r = 251
          bulbObj.children[13].material.color.g = 243
          bulbObj.children[13].material.color.b = 108
          bulbObj.children[13].material.opacity = 0.8;
          break;
      }
      }
      if (blinkCount > 5) {
        pointLight.intensity = 0;
      }
      count = 1;
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
      PlayAnimation();
    }
    if (verifiedText && !verifiedText.visible && bulbObj.visible) {
      verifiedText.position.setFromMatrixPosition(reticle.matrix);
      setTimeout(() => {
        verifiedText.visible = true;
      }, 7000)
    }
    if (gloLogoObj && !gloLogoObj.visible && bulbObj.visible) {
      gloLogoObj.position.setFromMatrixPosition(reticle.matrix);
      gloLogoObj.visible = true;
    }
    if (drops && !drops.visible && bulbObj.visible) {
      drops.position.setFromMatrixPosition(reticle.matrix);
      setTimeout(() => {
        drops.visible = true;
      }, 7000);
    }
  }

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

//
function LoadFbx() {
  new THREE.RGBELoader().load('./hdr/001_studioHDRI.hdr', function (texture) {
    texture.encoding = THREE.RGBEEncoding;
    texture.flipY = true;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    var loader = new THREE.FBXLoader();
    loader.load('./GloBulb/Not Verified_Bulb_Option.FBX', function (object) {
      object.traverse(function (child) {
        if (child.isMesh && child.name == "Bulb_Main") {
          child.material.envMap = texture; // assign your diffuse texture here
        }
      });
      bulbObj = object;
      bulbObj.scale.multiplyScalar(0.025);
      scene.add(object);
      if (object) {
        // PlayAnimation();
      }
      object.children[160].children[0].visible = false
      object.children[29].visible = false;
      object.children[0].material.color.r = 1;
      object.children[0].material.color.g = 1;
      object.children[0].material.color.b = 0;
      bulbObj.visible = false;
    })
  });
  new THREE.RGBELoader().load('./hdr/001_studioHDRI.hdr', function (texture) {
    texture.encoding = THREE.RGBEEncoding;
    texture.flipY = true;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    var loader = new THREE.FBXLoader();
    loader.load('./GloBulb/Text_Verified.FBX', function (object) {
      object.traverse(function (child) {
        if (child.isMesh && child.name == "Bulb_Main") {
          child.material.envMap = texture; // assign your diffuse texture here
        }
      });

      verifiedText = object;
      verifiedText.scale.multiplyScalar(0.025);
      scene.add(object);
      if (object) {
        // PlayAnimation();
        object.children[0].position.z = 7
      }
      verifiedText.visible = false;
    });
  });
  new THREE.RGBELoader().load('./hdr/001_studioHDRI.hdr', function (texture) {
    texture.encoding = THREE.RGBEEncoding;
    texture.flipY = true;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    var loader = new THREE.FBXLoader();
    loader.load('../GloBulb/gloLogo.FBX', function (object) {
      object.traverse(function (child) {
        if (child.isMesh && child.name == "Bulb_Main") {
          child.material.envMap = texture; // assign your diffuse texture here
        }
      });

      gloLogoObj = object;
      scene.add(object);

      if (object) {
        object.children[1].children[1].material.opacity = 0.2;
        // PlayAnimation();
      }
      gloLogoObj.visible = false;
      console.log(object);
    });
  });
  new THREE.RGBELoader().load('./hdr/001_studioHDRI.hdr', function (texture) {
    texture.encoding = THREE.RGBEEncoding;
    texture.flipY = true;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    var loader = new THREE.FBXLoader();
    loader.load('../GloBulb/Drops.FBX', function (object) {
      object.traverse(function (child) {
        if (child.isMesh && child.name == "Bulb_Main") {
          child.material.envMap = texture; // assign your diffuse texture here
        }
      });

      drops = object;
      scene.add(object);
      if (object) {
        // PlayAnimation();
      }
      drops.visible = false;
      console.log(object);
    });
  });
}
var mixer;
var vTextAni;
var gloLogoani;
var dropsAni;
function PlayAnimation() {
  mixer = new THREE.AnimationMixer(bulbObj);
  vTextAni = new THREE.AnimationMixer(verifiedText);
  gloLogoani = new THREE.AnimationMixer(gloLogoObj);
  dropsAni = new THREE.AnimationMixer(drops);
  var bulb = mixer.clipAction(bulbObj.animations[0]).play();
  var verifiedTextAni = vTextAni.clipAction(verifiedText.animations[0]).play();
  var dropsObjAni = dropsAni.clipAction(drops.animations[0]).play();
  var gLogoAni = gloLogoani.clipAction(gloLogoObj.animations[0]);
  bulb.setLoop(THREE.LoopOnce);
  verifiedTextAni.setLoop(THREE.Forever);
  dropsObjAni.setLoop(THREE.Forever);
  if (bulbObj && bulbObj.visible) {
    setTimeout(() => {
      gLogoAni.play();
    }, 7000);
    gLogoAni.setLoop(THREE.Forever);
  }

  bulb.clampWhenFinished = true
  verifiedTextAni.clampWhenFinished = true
  gLogoAni.clampWhenFinished = true
  dropsObjAni.clampWhenFinished = true
  mixer.timeScale = 1;
  vTextAni.timeScale = 1;
  gloLogoani.timeScale = 1;
  dropsAni.timeScale = 1;
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
        }


      } else {
        reticle.visible = false;
      }

    }

  }

  renderer.render(scene, camera);

};