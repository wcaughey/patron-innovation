 class DistanceCalculator 
{ 

    static EarthRadiusInMiles = 3956.0; 
    static EarthRadiusInKilometers = 6367.0; 
    static EarthRadiusInMeters = 6367.0*1000; 
    static Circle360Radius= 57.2957795; //This unit results in the distance also being the degree of separation.

    static ToRadian(val) { return val * (Math.PI / 180); } 
    static ToDegree(val) { return val * 180 / Math.PI; } 
    static DiffRadian(val1, val2) { return DistanceCalculator.ToRadian(val2) - DistanceCalculator.ToRadian(val1); }   

     static  CalcDistance(/*GeoCoordinate*/ p1, /*GeoCoordinate*/ p2) 
    { 
        return CalcDistance(p1.Latitude, p1.Longitude, p2.Latitude, p2.Longitude, Circle360Radius); 
    } 

    static Bearing(/*GeoCoordinate*/ p1, /*GeoCoordinate*/ p2) 
    { 
        return Bearing(p1.Latitude, p1.Longitude, p2.Latitude, p2.Longitude); 
    } 

    static CalcDistance( lat1, lng1, lat2, lng2, radius) 
    {         
        if(radius == null) {
            radius = DistanceCalculator.Circle360Radius;
        }
        return radius * 2 * Math.asin(Math.min(1, Math.sqrt((Math.pow(Math.sin((DistanceCalculator.DiffRadian(lat1, lat2)) / 2.0), 2.0) 
            + Math.cos(DistanceCalculator.ToRadian(lat1)) * Math.cos(DistanceCalculator.ToRadian(lat2)) * Math.pow(Math.sin((DistanceCalculator.DiffRadian(lng1, lng2)) / 2.0), 2.0))))); 
    } 

     static  Bearing( lat1, lng1, lat2, lng2) 
    { 
        { 
            var dLat = lat2 - lat2; 
            var dLon = lng2 - lng1; 
            var dPhi = Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4)); 
            var q = (Math.abs(dLat) > 0) ? dLat / dPhi : Math.cos(lat1); 

            if (Math.Abs(dLon) > Math.PI) 
            { 
                dLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon); 
            } 
            //var d = Math.Sqrt(dLat * dLat + q * q * dLon * dLon) * R; 
            var brng = ToDegree(Math.atan2(dLon, dPhi)); 
            return brng; 
        } 
    } 
} 