 class DistanceCalculator 
{ 

    static EarthRadiusInMiles = 3956.0; 
    static EarthRadiusInKilometers = 6367.0; 
    static EarthRadiusInMeters = EarthRadiusInKilometers*1000; 

    static ToRadian(val) { return val * (Math.PI / 180); } 
    static ToDegree(val) { return val * 180 / Math.PI; } 
    static DiffRadian(val1, val2) { return ToRadian(val2) - ToRadian(val1); }   

     static  CalcDistance(/*GeoCoordinate*/ p1, /*GeoCoordinate*/ p2) 
    { 
        return CalcDistance(p1.Latitude, p1.Longitude, p2.Latitude, p2.Longitude, EarthRadiusInKilometers); 
    } 

    static Bearing(/*GeoCoordinate*/ p1, /*GeoCoordinate*/ p2) 
    { 
        return Bearing(p1.Latitude, p1.Longitude, p2.Latitude, p2.Longitude); 
    } 

    static CalcDistance( lat1, lng1, lat2, lng2, radius) 
    { 
        return radius * 2 * Math.Asin(Math.Min(1, Math.Sqrt((Math.Pow(Math.Sin((DiffRadian(lat1, lat2)) / 2.0), 2.0) 
            + Math.Cos(ToRadian(lat1)) * Math.Cos(ToRadian(lat2)) * Math.Pow(Math.Sin((DiffRadian(lng1, lng2)) / 2.0), 2.0))))); 
    } 

     static  Bearing( lat1, lng1, lat2, lng2) 
    { 
        { 
            var dLat = lat2 - lat2; 
            var dLon = lng2 - lng1; 
            var dPhi = Math.Log(Math.Tan(lat2 / 2 + Math.PI / 4) / Math.Tan(lat1 / 2 + Math.PI / 4)); 
            var q = (Math.Abs(dLat) > 0) ? dLat / dPhi : Math.Cos(lat1); 

            if (Math.Abs(dLon) > Math.PI) 
            { 
                dLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon); 
            } 
            //var d = Math.Sqrt(dLat * dLat + q * q * dLon * dLon) * R; 
            var brng = ToDegree(Math.Atan2(dLon, dPhi)); 
            return brng; 
        } 
    } 
} 