




//Note that we are working in rotational units (degrees), not in pixels.



class Button3d {
    isVisible = true;
    isEnabled = true;
    width = 15.0;
    height = 6;
    diameter = 10;
    text ='';
    azimuth = 0;
    altitude = 0;

    clickAction = ()=> {}
    mesh = null;

    constructor(width,height,text,action) {
        if(width != null) { this.width = width; }
        if(height != null) { this.height = height; }
        if (text != null) { this.text = text; }        
    }

    reconstructMesh() {
        var geometry = new THREE.Geometry();
        var material = new THREE.MeshBasicMaterial();
        var verticies = [];

        var azSteps = Math.floor(width + 2);
        var altSteps = Math.floor(this.height+2);

        for(var i = 0;i<azSteps-1;++i) {
            var angle0 = -this.width/2 + (this.width/azSteps)*(i+0) + this.azimuth;
            var angle1 = -this.width/2 + (this.width/azSteps)*(i+1) + this.azimuth;

            for(var k = 0; k < altSteps-1;++k) {
                var top    = -this.height/2+(this.width/altSteps)*(k+0)+this.altitude;
                var bottom = -this.height/2+(this.width/altSteps)*(k+1)+this.altitude;

            }

            
        }


    }
    
}