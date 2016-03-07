var map;
var bound;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var elevationService = new google.maps.ElevationService();
var infowindow;
var chart;
var curPosMarker;
var elevationResults;
var distanceOfPoints = [0];
var elevationGainOfPoints = [0];

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

    chart = createChart();

    $("#toggleChart").click(function(){
        if (!this.i) {
            this.i = 0;
        }
        var hide = this.i % 2 == 0;
        $("#chart").height(hide ? 10 : 180);
        $("#toggleChart").text(hide ? "显示" : "隐藏")
        this.i++;
        return false;
    });
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
    var rendererOptions = {
        draggable : false,
        map : map
    };
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    directionsDisplay.setMap(map);

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push($("#changeMapSize").get(0));
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push($("#toggleChart").get(0));
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push($("#chart").get(0));

    var route = splitPoints(points);
    if(!!route) {
        drawRoute(route.origin, route.dest, route.waypoints);
    }

    var contentString = '<div id="infoContent"></div>';

    infowindow = new google.maps.InfoWindow({
        content : contentString,
        maxWidth : 400
    });
    google.maps.event.addListener(infowindow, 'domready', function() {
        $("#infoContent").html(infowindow.content);
    });

    for(var i in waypoints) {
        var wp = waypoints[i];
        var marker = new google.maps.Marker({
            position : wp.latLng,
            map : map,
            title : "点击查看内容"
        });

        addEvent(marker, wp.content);
    }

    /*
     var route = new google.maps.Polyline({
     path : points,
     strokeColor : "#33B5E5",
     strokeOpacity : 1.0,
     strokeWeight : 3

     });

     route.setMap(map);

     var startMarker = new google.maps.Marker({
     position: points[0],
     map: map,
     icon: "/static/images/map/marker_greenA.png",
     title:"开始"
     });
     var stopMarker = new google.maps.Marker({
     position: points[points.length - 1],
     map: map,
     icon: "/static/images/map/marker_redB.png",
     title:"停止"
     });
     */
}

function addEvent(marker, content) {
    google.maps.event.addListener(marker, 'click', function() {
        // infowindow.content = content;
        infowindow.open(map, marker);

        // var lat = infowindow.position.lat();
        // var lng = infowindow.position.lng();

        // alert(infowindow.position);

        for (var i = 0; i < waypoints.length; i++) {
            if (waypoints[i].latLng === infowindow.position) {
                infowindow.content = waypoints[i].content;
            }
        };


    });
}

function splitPoints(points) {
    if(!points || points.length < 2) {
        return null;
    }
    var result = {};
    result.origin = points[0];
    result.dest = points[points.length -1];
    result.waypoints = [];
    for(var i = 1; i < points.length - 1; i++) {
        var wp = {};
        wp.location = points[i];
        wp.stopover = true;
        result.waypoints.push(wp);
    }
    return result;
}

function drawRoute(origin, dest, waypoints) {
    var request = {
        origin : origin,
        destination : dest,
        travelMode : google.maps.TravelMode.WALKING,
        waypoints: waypoints
    };
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            getElevations(result.routes[0].overview_path);
        } else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {

        }
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
    var direction = directionsDisplay.getDirections();
    if (!direction) {
        return;
    }

    var route = direction.routes[0];
    var legs = route.legs;

    var beginLocation = legs[0].start_location;
    var endLocation = legs[legs.length - 1].end_location;

    var points = [];
    for (var i = 0; i < legs.length; i++) {
        for (var j = 0; j < legs[i].steps.length; j++) {
            var path = legs[i].steps[j].path;
            for (var k = 0; k < path.length; k++) {
                points.push(path[k].lat() + "," + path[k].lng());
            }
        }
    }

    $("input[name='points']").val(points.join(";"));
    $("input[name='download']").val(download);

    $("form").submit();
}

function getElevations(path) {
    for (var i in path) {
        var latlng = path[i];
        var arr = gw(latlng.lat(), latlng.lng());
        path[i] = new google.maps.LatLng(arr[0], arr[1]);
    }
    var pathRequest = {
        'path': path,
        'samples': 512
    }

    elevationService.getElevationAlongPath(pathRequest, function (results, status) {
        if (status == google.maps.ElevationStatus.OK) {
            var data = [];
            elevationGainOfPoints = [0];
            var elevationGain = 0;
            var lastEle = 8888;
            var min = 8888;
            for (var i = 0; i < results.length; i++) {
                var ele = results[i].elevation;
                data.push(ele);
                if (ele < min) {
                    min = ele;
                }
                if (i > 0) {
                    var gain = ele - lastEle;
                    if (gain > 0) {
                        elevationGain += gain;
                    }
                    elevationGainOfPoints.push(Math.round(elevationGain));
                }
                lastEle = ele;
            }
            chart.yAxis[0].setExtremes(min, null);
            chart.series[0].setData(data, true);
            for (var i in results) {
                var r = results[i];
                var arr = wg(r.location.lat(), r.location.lng());
                r.location = new google.maps.LatLng(arr[0], arr[1]);
            }
            elevationResults = results;

            var distance = 0;
            for (var i = 1; i < elevationResults.length; i++) {
                var pre = elevationResults[i-1];
                var cur = elevationResults[i];
                distance += getDistance(pre.location.lat(), pre.location.lng(), cur.location.lat(), cur.location.lng());
                distanceOfPoints.push(round(distance / 1000, 1));
            }

            $("#totalElevationGain").text("累计上升：" + Math.round(elevationGain) + "米");
        } else {
            alert("发生错误: " + status);
        }
    });
}

function createChart() {
    Highcharts.setOptions({
            lang: {
                exportButtonTitle: "导出",
                printButtonTitle: "打印",
                downloadPNG: "导出PNG",
                downloadJPEG: "导出JPEG",
                downloadPDF: "导出PDF",
                downloadSVG: "",
                resetZoom: "恢复",
                resetZoomTitle: "恢复"
            }
        }
    );
    return new Highcharts.Chart({
        chart: {
            zoomType: 'x',
            renderTo: 'chart',
            backgroundColor:'rgba(255, 255, 255, 0.8)'
        },
        title: {
            text: '海拔'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            labels: {
                formatter: function () {
                }
            }
        },
        yAxis: {
            labels: {
                style: {
                    color: '#a0a095'
                },
                formatter: function () {
                    return this.value + " m";
                }
            },
            title: {
                text: '海拔',
                style: {
                    color: '#a0a095'
                }
            }
        },
        tooltip: {
            formatter: function () {
                var altitude = this.y;
                var distance = distanceOfPoints[this.x];
                var elevationGain = elevationGainOfPoints[this.x];
                return "海拔：" + Math.round(altitude) + " 米<br />距离：≈" + distance + " 公里<br />累计上升：" + elevationGain + "米";
            },
            shared: true,
            crosshairs: true
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                },
                point: {
                    events: {
                        mouseOver: function () {
                            var curPos = elevationResults[this.x].location;
                            if (!curPosMarker) {
                                curPosMarker = new google.maps.Marker({
                                    position: curPos,
                                    map: map,
                                    icon: "/static/images/map/marker.png"
                                });
                            } else {
                                curPosMarker.setPosition(curPos);
                            }
                        }
                    }
                }
            },
            areaspline: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, 'rgba(2,0,0,0)']
                    ]
                },
                lineWidth: 1,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 5
                        }
                    }
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        series: [
            {
                name: '海拔',
                color: '#a0a095',
                type: 'areaspline',
                shadow: false
            }
        ]
    });
}
