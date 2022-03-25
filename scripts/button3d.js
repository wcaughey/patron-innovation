




//Note that we are working in rotational units (degrees), not in pixels.

//Possible button parameters were getting too expansive. 
//I've created an object on which they can be set that
//provides appropriate defaults.
class ButtonOptions {
    static SHAPE_PATCH = "Patch";
    static SHAPE_RECTANGLE = "Rectangle";
    static SHAPE_CIRCLE = "Circle";

    static DEFAULT_MATERIAL =  new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, color: 0x8080FF });

    constructor() {        
    }

    loadImageAsMaterial(imagePath) {
        var texture = new THREE.TextureLoader().load(imagePath);
        this.material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    }

    shape = ButtonOptions.SHAPE_CIRCLE;
    isVisible = true;
    isEnabled = true;
    width = 15;
    height = 15;
    material = ButtonOptions.DEFAULT_MATERIAL;
    azimuth = 0;
    altitude = 0;
    clickAction = ()=>{}
}


class Button3d {


    static circularButon(width, imagePath,azimuth, altitude, action) {
        var options = new ButtonOptions();
        options.loadImageAsMaterial(imagePath);      
        options.width = width;  
        options.azimuth = azimuth || 0;
        options.altitude = altitude || 0;
        var b = new Button3d(options);
        return b;
    }

    static SHAPE_PATCH = "Patch";
    static SHAPE_RECTANGLE = "Rectangle";
    static SHAPE_CIRCLE = "Circle";

    static ERROR_COLOR = 0x00FF00;

    buttonShape = ButtonOptions.SHAPE_CIRCLE;
    isVisible = true;
    isEnabled = true;
    width = 15.0;
    height = 6;
    diameter = 10;
    material = null;
    azimuth = 0;
    altitude = 0;
    sections = 3;
    geometry = null;
    material = null;
    clickAction = null;

    constructor(buttonOptions,action) {
        this.width = buttonOptions.width;
        this.height = buttonOptions.height;
        this.material = buttonOptions.material;
        this.altitude = buttonOptions.altitude;
        this.azimuth = buttonOptions.azimuth; 
        this.buttonShape = buttonOptions.shape;
        this.clickAction = buttonOptions.clickAction;
        
        switch(this.buttonShape) {
            case ButtonOptions.SHAPE_CIRCLE: 
                {
                    this.reconstructEllipseMesh();
                    break;
                }
            case ButtonOptions.SHAPE_PATCH:
                {
                    this.reconstructPacthMesh();
                    break;
                }
            case ButtonOptions.SHAPE_RECTANGLE:
                {
                    this.reconstructRectangularMesh();
                    break;
                }
            default:
                {
                    //If you didn't want this color, you should not have specified an invalid 
                    //shape option!
                    console.error(`Button3d::ctor() - An invalid shape option was specified. Using a loud color and defaulting to an ellipse!`)
                    this.material = new THREE.MeshBasicMaterial({ color: ERROR_COLOR, side: THREE.DoubleSide });
                    this.reconstructEllipseMesh();
                    break;
                }
        }
        this.geometry.eulerOrder = 'ZXY'
        this.geometry.rotation.z = degreesToRadians( this.altitude);
        this.geometry.rotation.y = degreesToRadians( -this.azimuth);
        
    }

    reconstructEllipseMesh() {
        var geometry = new THREE.Geometry();        
        var segmentCount = 32;

        geometry.faceVertexUvs[0] = [];        
        var centerVector = new THREE.Vector3( 0, 0, this.diameter );
        geometry.vertices.push(centerVector);
        var z = this.diameter ;


        //Take note, Working in radians here. 
        //Angle = 233
        //delta = 235;        
        var deltaAngle = 2 * Math.PI / segmentCount;
        for(var i=0;i<=segmentCount;++i) {
            var Angle = i * deltaAngle;
            var v = new THREE.Vector3 (
                this.width/2 * Math.cos(Angle) ,
                this.width/2 * Math.sin(Angle) ,
                z
            );   
            geometry.vertices.push(v);             
        }


        for(var i=0;i<geometry.vertices.length-1;++i) {
            var Angle = i * deltaAngle;
            geometry.faces.push(new THREE.Face3( 0, i+1, i+2))
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2( 0.5, 0.5), //center of circle
                new THREE.Vector2(0.5+ -0.5*Math.cos(Angle), 0.5+0.5*Math.sin(Angle)),
                new THREE.Vector2(0.5+ -0.5*Math.cos(Angle+deltaAngle), 0.5+0.5*Math.sin(Angle+deltaAngle)),
            ]);

        }
        geometry.uvsNeedUpdate = true;
        var shape = new THREE.Mesh( geometry, this.material );
        this.geometry = shape; 
    }

    reconstructRectangularMesh() {
        var geometry = new THREE.Geometry();        
        var left =  this.width/2 + this.azimuth;
        var right =  -this.width/2 + this.azimuth;
        var top    = -this.height/2 + this.altitude;
        var bottom = this.height/2 + this.altitude;

        var top_cos = (Math.cos(degreesToRadians(top)));
        var top_sin = (Math.sin(degreesToRadians(top)))
        var bottom_cos = (Math.cos(degreesToRadians(bottom)));
        var bottom_sin = (Math.sin(degreesToRadians(bottom)))

        var left_cos = (Math.cos(degreesToRadians(left)));
        var left_sin = (Math.sin(degreesToRadians(left)));
        var right_sin = (Math.sin(degreesToRadians(right)));
        var right_cos = (Math.cos(degreesToRadians(right)));

        var leftTopVector = new THREE.Vector3(
            rtp(this.diameter * left_sin * top_cos),
            rtp(this.diameter * top_sin),
            rtp(this.diameter * left_cos * top_cos)
        );

        var rightTopVector = new THREE.Vector3(
            rtp(this.diameter * right_sin * top_cos),
            rtp(this.diameter * top_sin),
            rtp(this.diameter * right_cos * top_cos)
        );

        var leftBottomVector = new THREE.Vector3(
            rtp(this.diameter * left_sin * bottom_cos),
            rtp(this.diameter * bottom_sin),
            rtp(this.diameter * left_cos * bottom_cos)
        );

        var rightBottomVector = new THREE.Vector3(
            rtp(this.diameter * right_sin * bottom_cos),
            rtp(this.diameter * bottom_sin),
            rtp(this.diameter * right_cos * bottom_cos)
        );

        geometry.vertices.push(leftTopVector);
        geometry.vertices.push(rightTopVector);
        geometry.vertices.push(leftBottomVector);
        geometry.vertices.push(rightBottomVector);

        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(1, 2, 3));

        var shape = new THREE.Mesh( geometry, this.material );
        this.geometry = shape;        
    }


    reconstructPacthMesh() {
        var geometry = new THREE.Geometry();        

        var azSteps = 8;
        var altSteps = 8;

        var vList = [];
        var faceNumber = 0;

        for(var i = 0;i<azSteps;++i) {
            var left =  -this.width/2 + (this.width/azSteps)*(i+0) + this.azimuth;
            var right = -this.width/2 + (this.width/azSteps)*(i+1) + this.azimuth;
            console.log([left, right]);
            

            for(var k = 0; k <= altSteps;++k) {
                
                var top    = -this.height/2+(this.height/altSteps)*(k+0)+this.altitude;
                //var bottom = -this.height/2+(this.height/altSteps)*(k+1)+this.altitude;
                console.log('top', top);
                var top_cos = (Math.cos(degreesToRadians(top)));
                var top_sin = (Math.sin(degreesToRadians(top)))
                var left_cos = (Math.cos(degreesToRadians(left)));
                var left_sin = (Math.sin(degreesToRadians(left)));
                var right_sin = (Math.sin(degreesToRadians(right)));
                var right_cos = (Math.cos(degreesToRadians(right)));


                var leftVector = new THREE.Vector3(
                    rtp(this.diameter * left_sin * top_cos),
                    rtp(this.diameter * top_sin),
                    rtp(this.diameter * left_cos * top_cos)
                );

                geometry.vertices.push(leftVector);
                console.log('leftVector',leftVector);

                /*geometry.vertices.push(new THREE.Vector3(
                    this.diameter * left_sin * Math.cos(degreesToRadians(bottom)),
                    this.diameter * Math.sin(degreesToRadians(bottom)),
                    this.diameter * left_cos * Math.cos(degreesToRadians(bottom))
                ));
                */

                var rightVector = new THREE.Vector3(
                    rtp(this.diameter * right_sin * top_cos),
                    rtp(this.diameter * top_sin),
                    rtp(this.diameter * right_cos * top_cos)
                );
                geometry.vertices.push(rightVector);
                console.log('rightVector', rightVector);

                /*
                geometry.vertices.push(new THREE.Vector3(
                    this.diameter * Math.sin(degreesToRadians(right)) * Math.cos(degreesToRadians(top)),
                    this.diameter * Math.sin(degreesToRadians(bottom)),
                    this.diameter * Math.cos(degreesToRadians(right)) * Math.cos(degreesToRadians(top))
                ));
                */

                if(geometry.vertices.length>=4)
                {
                    var fo = faceNumber * 2;
                    geometry.faces.push(new THREE.Face3(fo + 0, fo + 1, fo + 2));
                    geometry.faces.push(new THREE.Face3(fo + 1, fo + 2, fo + 3));
                    ++faceNumber;
                }
                
            }

        }
        console.log(geometry.vertices);
        console.log(geometry.faces);
        var shape = new THREE.Mesh( geometry, this.material );
        this.geometry = shape;
    }
    
}