
var EARTH_RADIUS = 6378137;

function rad(d)
{
    return d * Math.PI/ 180.0;
}

function getDistance(lat1, lng1, lat2, lng2)
{
    var radLat1 = rad(lat1);
    var radLat2 = rad(lat2);
    var a = radLat1 - radLat2;
    var b = rad(lng1) - rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}

function round(num, count) {
    var p = Math.pow(10, count);
    return Math.round(num * p) / p;
}
