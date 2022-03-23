




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
    sections = 3;
    geoObj = null;

    clickAction = ()=> {}
    mesh = null;

    constructor(width,height,text,action) {
        if(width != null) { this.width = width; }
        if(height != null) { this.height = height; }
        if (text != null) { this.text = text; }        
        this.reconstructMesh();
    }

    reconstructMesh() {
        var geometry = new THREE.Geometry();
        var material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide });
        var verticies = [];

        var azSteps = Math.floor(this.width + 2);
        var altSteps = Math.floor(this.height+2);

        var vList = [];
        var faceNumber = 0;

        for(var i = 0;i<azSteps-1;++i) {
            var left = -this.width/2 + (this.width/azSteps)*(i+0) + this.azimuth;
            var right = -this.width/2 + (this.width/azSteps)*(i+1) + this.azimuth;
            

            for(var k = 0; k < altSteps-1;++k) {
                var top    = -this.height/2+(this.width/altSteps)*(k+0)+this.altitude;
                var bottom = -this.height/2+(this.width/altSteps)*(k+1)+this.altitude;
                
                geometry.verticies.push(new THREE.Vertex(new THREE.Vector(
                    this.diameter * Math.sin(degreesToRadians(left)) * Math.cos(degreesToRadians(top)),
                    this.diameter * Math.sign(degreesToRadians(top)),
                    this.diameter * Math.cos(degreesToRadians(left)) * Math.cos(degreesToRadians(top))
                )));

                geometry.verticies.push(new THREE.Vertex(new THREE.Vector(
                    this.diameter * Math.sin(degreesToRadians(left)) * Math.cos(degreesToRadians(bottom)),
                    this.diameter * Math.sign(degreesToRadians(bottom)),
                    this.diameter * Math.cos(degreesToRadians(left)) * Math.cos(degreesToRadians(bottom))
                )));

                geometry.verticies.push(new THREE.Vertex(new THREE.Vector(
                    this.diameter * Math.sin(degreesToRadians(right)) * Math.cos(degreesToRadians(top)),
                    this.diameter * Math.sign(degreesToRadians(top)),
                    this.diameter * Math.cos(degreesToRadians(right)) * Math.cos(degreesToRadians(top))
                )));

                geometry.verticies.push(new THREE.Vertex(new THREE.Vector(
                    this.diameter * Math.sin(degreesToRadians(right)) * Math.cos(degreesToRadians(top)),
                    this.diameter * Math.sign(degreesToRadians(bottom)),
                    this.diameter * Math.cos(degreesToRadians(right)) * Math.cos(degreesToRadians(top))
                )));

                var fo = faceNumber * 4;
                geometry.faces.push(new THREE.Face3(fo + 0, f0 + 1, f0 + 2));
                geometry.faces.push(new THREE.Face3(fo + 1, f0 + 2, f0 + 3));
                
            }

        }
        var shape = new THREE.Mesh( geometry, material );
        this.geoObj = shape;
    }
    
}