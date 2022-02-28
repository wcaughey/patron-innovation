



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
    console.log(ev);
}

function handleOrientation(ev) {
    console.log(ev);
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


function enterSite() {
    showPage('experience-page')
    startMotionSensing();
}