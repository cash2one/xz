
var elevationService = new google.maps.ElevationService();
var map;
var center = new google.maps.LatLng(35.496456, 112.097167);
var zoomLevel = 5;
var note = $("#note");
var allMarkers = [];
var infowindow;
var infowindowElevation = new google.maps.InfoWindow();
var geocoder;
var geoMarker;
var startMarker;
var polyline;

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

$(init);

function init() {
    var city = new BMap.LocalCity();
    city.get(function (result) {
        center = new google.maps.LatLng(result.center.lat, result.center.lng);
        zoomLevel = result.level - 1;
        initialize();
    });

    $("#searchTxt").keypress(checkEnter);
    $("#searchBtn").click(search);
    $("#deleteLastPoint").click(deleteLastPoint);

    $("input[name='points']").val('');
    $("input[name='waypoints']").val('');
    $("input[name='distance']").val(0);

    $("#export").click(saveGps);

}

function initialize() {
    var mapHeight = $(window).height() - 100;
    $("#map_canvas").height(mapHeight);

    var mapOptions = {
        zoom : zoomLevel,
        mapTypeId : google.maps.MapTypeId.ROADMAP,
        center : center
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    geocoder = new google.maps.Geocoder();

    map.controls[google.maps.ControlPosition.TOP_CENTER].push($("#searchContainer").get(0));

    google.maps.event.addListener(map, 'click', mapClicked);

    var polyOptions = {
        strokeColor: '#73B9FF',
        strokeOpacity: 0.9,
        strokeWeight: 4
    }

    polyline = new google.maps.Polyline(polyOptions);
    polyline.setMap(map);

    var contentString = '<div><h4>内容</h4><div><textarea id="waypointContent" style="width:300px;height:150px;" placeholder="可输入100字"></textarea></div><div><a id="waypointSave" class="btn">保存</a><a id="waypointDelete" class="pull-right" href="#">刪除此备注</a></div></div>';

    infowindow = new google.maps.InfoWindow({
        content : contentString,
        maxWidth : 400
    });

    google.maps.event.addListener(infowindow, 'closeclick', function() {

    });
    google.maps.event.addListener(infowindow, 'domready', function() {
        $("#waypointContent").val(infowindow.marker.content);
        $("#waypointSave").click(function() {
            infowindow.marker.content = $("#waypointContent").val();
            infowindow.close();
            return false;
        });
        $("#waypointDelete").click(function() {
            infowindow.marker.setMap(null);
            return false;
        });
    });

    var menu = new contextMenu({
        map : map
    });

    menu.addItem('添加备注', function(map, latLng) {
        var marker = new google.maps.Marker({
            position : latLng,
            map : map,
            title : "点击设置内容\r\n备注可以拖动",
            draggable : true
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
            infowindow.marker = marker;
        });

        infowindow.open(map, marker);
        infowindow.marker = marker;

        allMarkers.push(marker);
    });

    menu.addSep();

    menu.addItem('查询海拔', function (map, latLng) {
        getElevation(latLng);
    });

}

function mapClicked(event) {
    var latLng = event.latLng;
    if (startMarker == null) {
        startMarker = new google.maps.Marker({
            position : latLng,
            map : map,
            icon : "/static/images/map/marker_greenA.png",
            title : "开始",
            draggable : true
        });
    }

    drawLine(latLng);

    var totalDistance = computeTotalDistance(polyline.getPath());
    $("#totalDistance").text(Math.round(totalDistance / 1000));

    $("#pointCount").text(polyline.getPath().getLength());
}

function drawLine(latLng) {
    var path = polyline.getPath();
    if (path.getLength() >= 100) {
        alert("当前最多支持添加100个点");
        return;
    }
    path.push(latLng);
    var length = path.getLength();
    if (length == 1) {
        startMarker.setMap(map);
        startMarker.setPosition(latLng);
    }
}

function deleteLastPoint() {
    var path = polyline.getPath();
    var length = path.getLength();
    if (length > 0) {
        path.removeAt(length - 1);
        if (length == 1) {
            startMarker.setMap(null);
        }
    }
    var totalDistance = computeTotalDistance(polyline.getPath());
    $("#totalDistance").text(Math.round(totalDistance / 1000));

    $("#pointCount").text(polyline.getPath().getLength());
}

function checkEnter(event) {
    if(event.which == 13) {
        event.preventDefault();
        $("#searchBtn").click();
    }
}

function search(event) {
    var address = $("#searchTxt").val();
    if(!address)
        return;
    geocoder.geocode({"address": address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var point = results[0].geometry.location;
            map.setCenter(point);
            if(geoMarker == null) {
                geoMarker = new google.maps.Marker({
                    map: map,
                    position: point
                });
            }
            geoMarker.setPosition(point);
        } else if(status == google.maps.GeocoderStatus.ZERO_RESULTS) {
            alert("没有找到此地点在地图上的位置，请修改后重新搜索");
        } else {
            alert("出错啦，请重试: " + status);
        }
    });
}

function computeTotalDistance(path) {
    var totalDistance = 0;
    if (path.getLength() > 1) {
        path.forEach(function(latLng, index){
            if (index != 0) {
                var lastLatLng = path.getAt(index - 1);
                totalDistance += getDistance(latLng.lat(), latLng.lng(), lastLatLng.lat(), lastLatLng.lng());
            }
        });
    }

    return Math.round(totalDistance);
}

function saveGps() {
    var path = polyline.getPath();
    var markers = getValidMarkers();
    if (path.getLength() <= 1 && markers.length == 0) {
        return;
    }
    if (!$("textarea[name='title']").val()) {
        alert("请输入简要说明");
        return;
    }

    var points = [];
    if (path.getLength() > 1) {
        path.forEach(function(latLng, index){
            points.push(latLng.lat() + "," + latLng.lng());
        });

        $("input[name='points']").val(points.join(";"));
    }

    var totalDistance = computeTotalDistance(path);
    $("input[name='distance']").val(totalDistance);

    if (markers.length != 0) {
        var markersStrArr = [];
        for (var i in markers) {
            var m = markers[i];
            var latlng = m.getPosition();
            markersStrArr.push(latlng.lat() + "--+--" + latlng.lng() + "--+--" + (!!m.content ? m.content : ""));
        }

        $("input[name='waypoints']").val(markersStrArr.join("==+=="));
    }

    $("#saveForm").submit();
}

function getValidMarkers() {
    var validMarkers = [];
    for (var i in allMarkers) {
        var marker = allMarkers[i];
        if (marker.getMap() != null) {
            validMarkers.push(marker);
        }
    }
    return validMarkers;
}

function getElevation(point) {
    var locations = [];
    var arr = gw(point.lat(), point.lng());
    var newPoint = new google.maps.LatLng(arr[0], arr[1]);
    locations.push(newPoint);
    var positionalRequest = {
        'locations': locations
    }

    elevationService.getElevationForLocations(positionalRequest, function (results, status) {
        if (status == google.maps.ElevationStatus.OK) {
            if (results[0]) {
                infowindowElevation.setContent("此处海拔：" + Math.round(results[0].elevation) + "米");
                infowindowElevation.setPosition(point);
                infowindowElevation.open(map);
            } else {
                alert("没有找到此位置的海拔: " + status);
            }
        } else {
            alert("发生错误: " + status);
        }
    });
}

