var map;
var bound;
var infowindow;
var polyline;

$(init);

function init() {
    initMap();
    $("#exportGpx").click(function () {
        exportGpx(true);
    });
    $("#generateGpx").click(function () {
        exportGpx(false);
    });
    $("#toggleLushu").click(toggleLushu);
    $("#toggleDeleteLushu").click(toggleDeleteLushu);
    $("#changeMapSize").click(changeMapSize);

}

function initMap() {
    var mapHeight = $(window).height() - 200;
    $("#map_canvas").height(mapHeight);

    var options = {
        zoom : 14,
        center : points[0],
        mapTypeId : google.maps.MapTypeId.ROADMAP
    };

    if(min_lat * min_lng * max_lat * max_lng != 0) {
        var sw = new google.maps.LatLng(min_lat, min_lng);
        var ne = new google.maps.LatLng(max_lat, max_lng);
        bound = new google.maps.LatLngBounds(sw, ne);
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), options);
    if(!!bound) {
        map.fitBounds(bound);
    }

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push($("#changeMapSize").get(0));

    var contentString = '<div id="infoContent"></div>';

    infowindow = new google.maps.InfoWindow({
        content : contentString,
        maxWidth : 400
    });
    google.maps.event.addListener(infowindow, 'domready', function() {
        $("#infoContent").html(infowindow.content);
    });

    if (points.length > 0) {
        var startMarker = new google.maps.Marker({
            position : points[0],
            map : map,
            icon : "/static/images/map/marker_greenA.png",
            title : "开始",
            draggable : false
        });
    }
    if (points.length > 1) {
        var stopMarker = new google.maps.Marker({
            position : points[points.length - 1],
            map : map,
            icon : "/static/images/map/marker_redB.png",
            title : "停止",
            draggable : false
        });
    }

    var polyOptions = {
        strokeColor: '#73B9FF',
        strokeOpacity: 0.9,
        strokeWeight: 4,
        path: points
    }

    polyline = new google.maps.Polyline(polyOptions);
    polyline.setMap(map);

    for(var i in waypoints) {
        var wp = waypoints[i];
        var marker = new google.maps.Marker({
            position : wp.latLng,
            map : map,
            title : "点击查看内容"
        });

        addEvent(marker, wp.content);
    }

}

function addEvent(marker, content) {
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.content = content;
        infowindow.open(map, marker);
    });
}

function changeMapSize() {
    var defaultHeight = 550;
    var curHeight = $("#map_canvas").height();
    var nextHeight = curHeight;
    if(curHeight == defaultHeight) {
        nextHeight = $(window).height() - 150;
        if(nextHeight < 800) {
            nextHeight = 800;
        }
    } else {
        nextHeight += 200;
    }
    $("#map_canvas").height(nextHeight);
    google.maps.event.trigger(map, 'resize');
    return false;
}

function exportGpx(download) {
    var pointsStr = [];
    for (var i = 0; i < points.length; i++) {
        pointsStr.push(points[i].lat() + "," + points[i].lng());
    }

    $("input[name='points']").val(pointsStr.join(";"));
    $("input[name='download']").val(download);

    $("form").submit();
}

