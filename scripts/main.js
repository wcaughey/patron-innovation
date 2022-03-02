

var scene;
var camera;
var rendered;

var cage;




var rotationAccumulator =  {
    x: 0,
    y: 0,
    z: 0
}



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

    document.getElementById('experience-page').addEventListener('mousemove', experienceMouseMove);
}


function handleMotion(ev) { 
    let acceleration = ev.acceleration;
    if (acceleration.x == null || acceleration.y == null || acceleration.z == 0) {
        return
    }    
    let accelWithGravity = ev.accelerationIncludingGravity;
    document.getElementById('accelReading').innerText = `X: ${accelWithGravity.x.toFixed(3)}, Y:${accelWithGravity.y.toFixed(3)},Z:${accelWithGravity.z.toFixed(3)};`
}

function handleOrientation(ev) {
	const absolute = ev.absolute;
  const alpha    = ev.alpha;
  const beta     = ev.beta;
  const gamma    = ev.gamma;
  if(alpha == null || beta == null || gamma == null) {
      return;
  }
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
    var deviceMotionPromise = new Promise((resolve,reject)=>{
        //iOS pathway
        if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
            // (optional) Do something before API request prompt.
            DeviceMotionEvent.requestPermission()
                .then( response => {
                // (optional) Do something after API prompt dismissed.
                if ( response == "granted" ) {
                    window.addEventListener("devicemotion", handleMotion, true);
                } else {
                    reject();
                }
                resolve();
            })
            .catch( console.error )
        }
        //handles motion, but doesn't require permission
        else if (typeof(DeviceMotionEvent) != "undefined")
        {
            window.addEventListener("devicemotion", handleMotion, true);
            resolve();
        }
        else {
            return NoSupport("Device Orientation is not supported on this device. Fallback not implemented")
        }
    });   
        
    var deviceOrientationPromise = new Promise((resolve,reject)=>{
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
    });    
}





function rotateLeft() {
    rotationAccumulator.y = cage.rotation.y - 0.2;
    //cage.rotation.y -=0.2;
}

function rotateRight() {
    rotationAccumulator.y = cage.rotation.y + 0.2;
    //cage.rotation.y +=0.2;
}


function rotateUp() { 
    rotationAccumulator.x = cage.rotation.x + 0.2;
    //cage.rotation.x += 0.2;
}

function rotateDown() {
    rotationAccumulator.x = cage.rotation.x - 0.2;
    //cage.rotation.x -= 0.2;
}

function resetOrientation() {
    rotationAccumulator = {
        x:0,
        y:0,
        z:0
    };
    //cage.rotation.x = 0;
    //cage.rotation.y = 0;
    //cage.rotation.z = 0;
}



function experienceMouseMove(ev) {
    var orientationElement = document.getElementById('navigation-widget');
    orientationElement.classList.remove('hidden');
    orientationElement.classList.add('shown');
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

    var diffX = rotationAccumulator.x - cage.rotation.x;
    var diffY = rotationAccumulator.y - cage.rotation.y;
    var diffZ = rotationAccumulator.z - cage.rotation.z;
    if(diffX != 0)
    {
        if(Math.abs(diffX)< 0.01) {
            cage.rotation.x = rotationAccumulator.x;
        }
        else { 
            if(diffX < 0) {
                cage.rotation.x -= 0.01;
            } else {
                cage.rotation.x += 0.01;
            }
        }
    }

    if(diffY != 0)
    {
        if(Math.abs(diffY)< 0.01) {
            cage.rotation.y = rotationAccumulator.y;
        }
        else { 
            if(diffY < 0) {
                cage.rotation.y -= 0.01;
            } else {
                cage.rotation.y += 0.01;
            }
        }
    }    

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

