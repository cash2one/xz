var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var elevationService = new google.maps.ElevationService();
var map;
var center = new google.maps.LatLng(35.496456, 112.097167);
var zoomLevel = 5;
var noRoute = false;
var note = $("#note");
var allMarkers = [];
var infowindow;
var infowindowElevation = new google.maps.InfoWindow();
var geocoder;
var geoMarker;
var startMarker, stopMarker;
var chart;
var curPosMarker;
var elevationResults;
var distanceOfPoints = [0];
var elevationGainOfPoints = [0];

var positions = [];

// 如果得到的 waypoints 有值的话，就付给 positions
if (waypoints.length > 0) {
    for (var i = 0; i < waypoints.length; i++) {
        positions.push({
            "lat": waypoints[i].latLng.lat(),
            "lng": waypoints[i].latLng.lng(),
            "content": waypoints[i].content
        });

        // console.log('wp LatLng: ' + waypoints[i].latLng.lat());
        // console.log('wp LatLng: ' + waypoints[i].latLng.lng());
        // console.log('wp content: ' + waypoints[i].content);
    };
} else {
    var positions = [];
};


console.log(positions);

$(init);

function init() {
    if (lushuId === 0) {
        var city = new BMap.LocalCity();
        city.get(function(result) {
            center = new google.maps.LatLng(result.center.lat, result.center.lng);
            zoomLevel = result.level - 1;
            initialize();
        });
    } else {
        initialize();
    }

    $("#searchTxt").keypress(checkEnter);
    $("#searchBtn").click(search);

    $("input[name='points']").val('');
    $("input[name='waypoints']").val('');
    $("input[name='distance']").val(0);
    $("input[name='gpxPoints']").val('');

    $("#export").click(saveGps);

    $("#distanceTips, #circleLushuTips, #dragLushuTips").popover({
        "placement": "bottom",
        trigger: "hover"
    });
    $("#distanceTips, #circleLushuTips, #dragLushuTips").click(function() {
        return false;
    });

    chart = createChart();

    $("#toggleChart").click(function() {
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

function initialize() {
    var mapHeight = $(window).height() - 100;
    $("#map_canvas").height(mapHeight);

    var mapOptions = {
        zoom: zoomLevel,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: center
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    geocoder = new google.maps.Geocoder();

    map.controls[google.maps.ControlPosition.TOP_CENTER].push($("#searchContainer").get(0));

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push($("#toggleChart").get(0));
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push($("#chart").get(0));

    if (lushuId != 0 && !!bound) {
        map.fitBounds(bound);
    }

    var rendererOptions = {
        draggable: true,
        map: map
    };
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    directionsDisplay.setMap(map);
    google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
        var direction = directionsDisplay.getDirections();
        if (direction != null) {
            var leg = direction.routes[0].legs[0];
            startMarker.setPosition(leg.start_location);
            stopMarker.setPosition(leg.end_location);
        }

        var totalDistance = computeTotalDistance();
        $("#totalDistance").text(Math.round(totalDistance));
        getElevations(direction.routes[0].overview_path);
    });

    if (lushuId != 0) {
        var route = splitPoints(points);
        if (!!route) {
            startMarker = new google.maps.Marker({
                position: points[0],
                map: map,
                icon: "/static/images/map/marker_greenA.png",
                title: "开始",
                draggable: true
            });
            stopMarker = new google.maps.Marker({
                position: points[points.length - 1],
                map: map,
                icon: "/static/images/map/marker_redB.png",
                title: "停止",
                draggable: true
            });
            drawRoute(route.origin, route.dest, route.waypoints);
        }
    }

    var contentString = '<div><h4>内容</h4><div><textarea id="waypointContent" style="width:300px;height:150px;" placeholder="可输入100字"></textarea></div><div><a id="waypointSave" class="btn">保存并关闭</a><a id="waypointDelete" class="pull-right" href="#">刪除此备注</a></div></div>';

    infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400
    });


    google.maps.event.addListener(infowindow, 'closeclick', function() {
        console.log('你点击了关闭按钮');
        infowindow.marker.content = "";

        $("#waypointContent").val('');
        infowindow.close();
        return false;
    })



    google.maps.event.addListener(infowindow, 'domready', function() {

        $(".gm-style-iw").next("div").hide(); // 隐藏infowindow关闭按钮

        var cc_value = $("#waypointContent").val();

        if (cc_value === '') {
            var lat = infowindow.marker.position.lat();
            var lng = infowindow.marker.position.lng();
            for (var i = 0; i < positions.length; i++) {
                if (positions[i]["lat"] == lat && positions[i]["lng"] == lng) {
                    $("#waypointContent").val(positions[i]["content"])
                }
            };
        }


        // 点击 “保存”
        $("#waypointSave").click(function() {

            infowindow.marker.content = $("#waypointContent").val();

            var lat = infowindow.marker.position.lat();
            var lng = infowindow.marker.position.lng();
            var current_content = infowindow.marker.content;
            if (current_content === undefined) {
                current_content = 'weikong';
            } else {
                console.log(infowindow.marker.content);
                for (var i = 0; i < positions.length; i++) {
                    if (positions[i]["lat"] === lat && positions[i]["lng"] === lng) {
                        positions[i]["content"] = current_content;
                    }
                };
            };

            $("#waypointContent").val('');
            infowindow.close();
            return false;
        });

        // 点击“删除此备注”
        $("#waypointDelete").click(function() {
            infowindow.marker.setMap(null);

            Array.prototype.remove = function(dx) {　　
                if (isNaN(dx) || dx > this.length) {
                    return false;
                }　　
                for (var i = 0, n = 0; i < this.length; i++) {　　　　
                    if (this[i] != this[dx]) {　　　　　　
                        this[n++] = this[i]　　　　
                    }　　
                }　　
                this.length -= 1
            }

            var lat = infowindow.marker.position.lat();
            var lng = infowindow.marker.position.lng();

            for (var i = 0; i < positions.length; i++) {
                if (positions[i]["lat"] === lat && positions[i]["lng"] === lng) {
                    positions.remove(i);
                    return positions;
                }
            };

            // alert('positions.length:' + positions.length);

            return false;
        });
    });

    // for(var i in waypoints) {
    //     var wp = waypoints[i];
    //     var marker = new google.maps.Marker({
    //         position : wp.latLng,
    //         map : map,
    //         title : "点击设置内容\r\n备注可以拖动",
    //         draggable : true
    //     });

    //     addEvent(marker, wp.content);

    //     allMarkers.push(marker);
    // }

    // 编辑路书的时候绘制备注点
    for (var i = 0; i < waypoints.length; i++) {
        var wp = waypoints[i];

        var marker = new google.maps.Marker({
            position: wp.latLng,
            map: map,
            title: "点击设置内容\r\n备注可以拖动",
            draggable: true
        });

        addEvent(marker, wp.content);

        console.log(wp.content);

        allMarkers.push(marker);

    };

    var menu = new contextMenu({
        map: map
    });

    menu.addItem('设置此处为起点', function(map, latLng) {
        if (startMarker == null) {
            startMarker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: "/static/images/map/marker_greenA.png",
                title: "开始",
                draggable: true
            });
            drawRouteByMarker();
        } else {
            startMarker.setPosition(latLng);
            drawRouteByMarker();
        }
    });

    menu.addItem('设置此处为终点', function(map, latLng) {
        if (stopMarker == null) {
            stopMarker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: "/static/images/map/marker_redB.png",
                title: "停止",
                draggable: true
            });
            note.text("");
            drawRouteByMarker();
        } else {
            stopMarker.setPosition(latLng);
            drawRouteByMarker();
        }
    });

    menu.addSep();

    menu.addItem('添加备注', function(map, latLng) {
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: "点击设置内容\r\n备注可以拖动",
            draggable: true
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
            infowindow.marker = marker;
        });

        infowindow.open(map, marker);
        infowindow.marker = marker;
        infowindow.marker.content = "";

        // allMarkers.push(marker);
        positions.push({
            "lat": marker.position.lat(),
            "lng": marker.position.lng()
        });
    });

    menu.addItem('查询海拔', function(map, latLng) {
        getElevation(latLng);
    });

}

function checkEnter(event) {
    if (event.which == 13) {
        event.preventDefault();
        $("#searchBtn").click();
    }
}

function search(event) {
    var address = $("#searchTxt").val();
    if (!address)
        return;
    geocoder.geocode({
        "address": address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var point = results[0].geometry.location;
            map.setCenter(point);
            if (geoMarker == null) {
                geoMarker = new google.maps.Marker({
                    map: map,
                    position: point
                });
            }
            geoMarker.setPosition(point);
        } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
            alert("没有找到此地点在地图上的位置，请修改后重新搜索");
        } else {
            alert("出错啦，请重试: " + status);
        }
    });
}

// 好像是修改路书的时候，点击备注点的动作
function addEvent(marker, content) {
    google.maps.event.addListener(marker, 'click', function() {

        console.log(content);

        infowindow.marker = marker;

        infowindow.marker.content = content;

        $("#waypointContent").val(content);

        if (!infowindow.marker.init) {
            infowindow.marker.content = content;
            infowindow.marker.init = true;
        }

        infowindow.open(map, marker);

        // $("#waypointContent").val(content);
    });
}


function splitPoints(points) {
    if (!points || points.length < 2) {
        return null;
    }
    var result = {};
    result.origin = points[0];
    result.dest = points[points.length - 1];
    result.waypoints = [];
    for (var i = 1; i < points.length - 1; i++) {
        var wp = {};
        wp.location = points[i];
        wp.stopover = true;
        result.waypoints.push(wp);
    }
    return result;
}

function computeTotalDistance() {
    var direction = directionsDisplay.getDirections();
    if (!direction) {
        return 0;
    }
    var route = direction.routes[0];
    var legs = route.legs;

    var totalDistance = 0;
    for (var i = 0; i < legs.length; i++) {
        totalDistance += legs[i].distance.value;
    }
    return totalDistance / 1000;
}

function saveGps() {
    var direction = directionsDisplay.getDirections();
    // var markers = getValidMarkers();

    if (!direction) {
        alert("尚未生成路线");
        return;
    }
    if (!$("input[name='title']").val()) {
        alert("请输入简要说明");
        return;
    }

    var totalDistance = 0;
    if (!!direction) {
        var route = direction.routes[0];
        var legs = route.legs;

        for (var i = 0; i < legs.length; i++) {
            totalDistance += legs[i].distance.value;
        }

        var beginLocation = legs[0].start_location;
        var endLocation = legs[legs.length - 1].end_location;

        var points = [];
        points.push(beginLocation.lat() + "," + beginLocation.lng());

        if (lushuId == 0) {
            for (var i = 0; i < legs.length; i++) {
                for (var j = 0; j < legs[i].via_waypoints.length; j++) {
                    var wp = legs[i].via_waypoints[j];
                    points.push(wp.lat() + "," + wp.lng());
                }
            }
            points.push(endLocation.lat() + "," + endLocation.lng());
        } else {
            for (var i = 0; i < legs.length; i++) {
                for (var j = 0; j < legs[i].via_waypoints.length; j++) {
                    var wp = legs[i].via_waypoints[j];
                    points.push(wp.lat() + "," + wp.lng());
                }
                points.push(legs[i].end_location.lat() + "," + legs[i].end_location.lng());
            }
            //var waypoints = direction.lc.waypoints;
            //for ( var i = 0; i < waypoints.length; i++) {
            //    var wp = waypoints[i];
            //    var latitude = wp.location.k;
            //    var longitude = wp.location.B;
            //    points.push(latitude + "," + longitude);
            //}
        }


        $("input[name='points']").val(points.join(";"));

        var gpxPoints = [];
        for (var i = 0; i < legs.length; i++) {
            for (var j = 0; j < legs[i].steps.length; j++) {
                var path = legs[i].steps[j].path;
                for (var k = 0; k < path.length; k++) {
                    gpxPoints.push(path[k].lat() + "," + path[k].lng());
                }
            }
        }
        $("input[name='gpxPoints']").val(gpxPoints.join(";"));
    }

    $("input[name='distance']").val(totalDistance);

    // if (markers.length > 0) {
    //     var markersStrArr = [];
    //     for (var i in markers) {
    //         var m = markers[i];
    //         var latlng = m.getPosition();
    //         markersStrArr.push(latlng.lat() + "--+--" + latlng.lng() + "--+--" + (!!m.content ? m.content : ""));
    //     }

    //     $("input[name='waypoints']").val(markersStrArr.join("==+=="));
    // }


    if (positions.length > 0) {
        var markersStrArr = [];
        for (var i = 0; i < positions.length; i++) {
            var m = positions[i];
            markersStrArr.push(m["lat"] + "--+--" + m["lng"] + "--+--" + m["content"]);
        };
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

function drawRoute(origin, dest, waypoints) {
    var request = {
        origin: origin,
        destination: dest,
        travelMode: google.maps.TravelMode.WALKING,
        waypoints: waypoints
    };
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            startMarker.setMap(null);
            stopMarker.setMap(null);
            note.html("路线已经生成，现在<span class='label label-important'>可以拖动起点，终点或者直接拖动路线</span>，即可按照自己的要求生成路线");
        } else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
            noRoute = true;
            google.maps.event.addListener(startMarker, 'dragend', drawRouteByMarker);
            google.maps.event.addListener(stopMarker, 'dragend', drawRouteByMarker);
            note.text("没有找到路线，请调整起点和终点，重新生成路线");
        }
    });
}

function drawRouteByMarker() {
    if (startMarker != null && stopMarker != null) {
        drawRoute(startMarker.getPosition(), stopMarker.getPosition(), []);
    }
}

function getElevation(point) {
    var arr = gw(point.lat(), point.lng());
    var newPoint = new google.maps.LatLng(arr[0], arr[1]);
    var locations = [];
    locations.push(newPoint);
    var positionalRequest = {
        'locations': locations
    }

    elevationService.getElevationForLocations(positionalRequest, function(results, status) {
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

    elevationService.getElevationAlongPath(pathRequest, function(results, status) {
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

            distanceOfPoints = [0];
            var distance = 0;
            for (var i = 1; i < elevationResults.length; i++) {
                var pre = elevationResults[i - 1];
                var cur = elevationResults[i];
                distance += getDistance(pre.location.lat(), pre.location.lng(), cur.location.lat(), cur.location.lng());
                distanceOfPoints.push(round(distance / 1000, 1));
            }

            $("#totalElevationGain").text(Math.round(elevationGain));
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
    });
    return new Highcharts.Chart({
        chart: {
            zoomType: 'x',
            renderTo: 'chart',
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
        },
        title: {
            text: '海拔'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            labels: {
                formatter: function() {}
            }
        },
        yAxis: {
            labels: {
                style: {
                    color: '#a0a095'
                },
                formatter: function() {
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
            formatter: function() {
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
                        mouseOver: function() {
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
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
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
        series: [{
            name: '海拔',
            color: '#a0a095',
            type: 'areaspline',
            shadow: false
        }]
    });
}
