

var scene;
var camera;
var rendered;

var cage;

class MAP_TYPE {
    static SPHERE = 'SPHERE';
    static CUBE = 'CUBE';
}

var mapType = MAP_TYPE.CUBE;

function NoSupport(msg) { 
    var haltOverlayElement = document.getElementById('haltOverlay');
    haltOverlayElement.innerText = msg;
    haltOverlayElement.style.display = "block"
}

function start() {
    
    if(!window.DeviceOrientationEvent) {
        NoSupport("DEV : Device does not implement orientation API. Fallback not yet implemented.")
        return;
    }
    if(!window.DeviceMotionEvent) {
        NoSupport("Device Motion not available. No Dev Fallback.")
        return;
    }    
}


function handleMotion(ev) { 
    let acceleration = ev.acceleration;
    let accelWithGravity = ev.accelerationIncludingGravity;
    document.getElementById('accelReading').innerText = `X: ${accelWithGravity.x.toFixed(3)}, Y:${accelWithGravity.y.toFixed(3)},Z:${accelWithGravity.z.toFixed(3)};`
}

function handleOrientation(ev) {
	const absolute = ev.absolute;
  const alpha    = ev.alpha;
  const beta     = ev.beta;
  const gamma    = ev.gamma;
  var orientationDescription = `alpha,:${alpha.toFixed(3)},  beta:${beta.toFixed(3)}, gamma: ${gamma.toFixed(3)}`;
  document.getElementById('orientationReading').innerText = orientationDescription;
}

function onWindowResize() {
    if(camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

function startMotionSensing() {
    //iOS pathway
    if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
        // (optional) Do something before API request prompt.
        DeviceMotionEvent.requestPermission()
            .then( response => {
            // (optional) Do something after API prompt dismissed.
            if ( response == "granted" ) {
                window.addEventListener("devicemotion", handleMotion, true);
            }
        })
        .catch( console.error )
    }
    //handles motion, but doesn't require permission
    else if (typeof(DeviceMotionEvent) != "undefined")
    {
        window.addEventListener("devicemotion", handleMotion, true);
    }
    else {
        return NoSupport("Device Orientation is not supported on this device. Fallback not implemented")
    }   
    
    //iOS Pathway
    if( typeof(DeviceOrientationEvent ) !== "undefined" && typeof(DeviceOrientationEvent.requestPermission ) === "function" ) {
        DeviceOrientationEvent.requestPermission()
        .then( response => {
            if(response == "granted") {
                window.addEventListener("deviceorientation", handleOrientation, true);
            }
        })
    }
    //Handles orientation, but doesn't require permission
    else if (typeof(DeviceMotionEvent) !== "undefined")
    {
        window.addEventListener("deviceorientation", handleOrientation, true);
    }
    //DeviceMotion not supported
    else {
        return NoSupport("Device Motion is not supported on this device. Fallback not implemented")
    }
}


function showPage(pageID)
{
    var elementList = document.getElementsByClassName("page");
    for(let i=0;i<elementList.length;++i) {
        let element = elementList[i];
        element.classList.remove('shown'); 
        element.classList.add('hidden') ;
    }
     
    var target = document.getElementById(pageID);
    target.classList.remove('hidden');
    target.classList.add('shown')

}


function initCamera() {
    camera = new THREE.PerspectiveCamera(
        75, //Viewing Angle
        window.innerWidth/window.innerHeight, //aspect ratio
        0.1, //near plane
        1000 // far plane
    );
    camera.position.z = 0;
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function startVideo() {
    var videoElement = document.getElementById("primaryVideo")
    //videoElement.currentTime = 100;
    videoElement.addEventListener('play',()=> {
        
    })
    videoElement.play();
}


function transitionToVideo(videoName) {
    var videoElement = document.getElementById('primaryVideo');
    videoElement.setAttribute('src',`videos\${videoName}`);
    videoElement.play();
}

function buildSceneObjects() {
       //const texture = new THREE.TextureLoader().load('img/j2inet.png')
       var videoElement = document.getElementById("primaryVideo")
       const texture = new THREE.VideoTexture(videoElement)
   
    if(mapType == MAP_TYPE.SPHERE) {
       var geometry =  new THREE.SphereGeometry(20,32,32); //new THREE.BoxGeometry(3,3,3);
       var material = new THREE.MeshBasicMaterial({ map:texture, side: THREE.DoubleSide});
       cage = new THREE.Mesh(geometry, material);
    } else if(mapType == MAP_TYPE.CUBE) {
        var geometry =  new THREE.BoxGeometry(20,20,20); //new THREE.BoxGeometry(3,3,3);
        var material = new THREE.MeshBasicMaterial({ map:texture, side: THREE.DoubleSide});
        cage = new THREE.Mesh(geometry, material);
    }


       //cage.rotation.z = 90;
       scene.add(cage);
   
}

function animateLoop() { 
    requestAnimationFrame(animateLoop);
    renderer.render(scene, camera);
    //cage.rotation.x += 0.01;
}

function createScene() {
    scene = new THREE.Scene();
    initCamera();
    initRenderer();
    buildSceneObjects();
    animateLoop();
    window.addEventListener('resize', onWindowResize, false);
    document.getElementById("SceneCanvas").appendChild(renderer.domElement);
}

function enterSite(mode) {
    if((mode == MAP_TYPE.SPHERE || mode == MAP_TYPE.CUBE)) {
        mapType  = mode;
    }
    showPage('experience-page')
    createScene();
    startVideo();
    startMotionSensing();
}

