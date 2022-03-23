

function degreesToRadians(deg) {
    return Math.PI * deg/ 180;
}


function rtp(val,points) {
    if (points == null) {
        points = 3;
    }
    var s = Math.pow(10,points);
    var result = Math.round(val * s)/s;
    return result;
}