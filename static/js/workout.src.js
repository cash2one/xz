var map;
var bound;
var route;
var startMarker;
var stopMarker;
var curPosMarker;
var startPosition;
var stopPosition;
var chart;
var chart2;

$(init);

function init() {
    initMap();
    $("#toggleWorkout").click(toggleWorkout);
    $("#toggleDeleteWorkout").click(toggleDeleteWorkout);
    $("#changeMapSize").click(changeMapSize);
    $("#exportGpx").click(exportCheck);
    $("#exportKml").click(exportCheck);
    // $("#aOffset").click(changeOffset);

    chart = createChart();
    chart2 = createChart2();
}

function initMap() {
    startPosition = points[0];
    stopPosition = points[points.length - 1];

    var options = {
        zoom: 14,
        center: points[0],
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    if (min_lat * min_lng * max_lat * max_lng != 0) {
        var sw = new google.maps.LatLng(min_lat, min_lng);
        var ne = new google.maps.LatLng(max_lat, max_lng);
        bound = new google.maps.LatLngBounds(sw, ne);
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), options);
    if (!!bound) {
        map.fitBounds(bound);
    }

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push($("#changeMapSize").get(0));

    route = new google.maps.Polyline({
        path: points,
        strokeColor: '#ff0000',
        strokeOpacity: 0.8,
        strokeWeight: 4
    });

    route.setMap(map);

    var startMarkerIcon = new google.maps.MarkerImage("/static/images/map/xingzhe_map_begin.png", null, null, null, new google.maps.Size(28, 34));

    var stopMarkerIcon = new google.maps.MarkerImage("/static/images/map/xingzhe_map_end.png", null, null, null, new google.maps.Size(28, 34));

    startMarker = new google.maps.Marker({
        position: startPosition,
        map: map,
        zIndex: 5,
        icon: startMarkerIcon,
        title: "开始",
        draggable: false
    });
    stopMarker = new google.maps.Marker({
        position: stopPosition,
        map: map,
        zIndex: 6,
        icon: stopMarkerIcon,
        title: "停止",
        draggable: false
    });


    google.maps.event.addListener(startMarker, 'dragend', onMarkerDragEnd);
}

function formatTime(ms) {
    var date = new Date(ms);
    return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

// Highcharts.setOptions({
//     lang: {
//         exportButtonTitle: "导出",
//         printButtonTitle: "打印",
//         downloadPNG: "导出PNG",
//         downloadJPEG: "导出JPEG",
//         downloadPDF: "导出PDF",
//         downloadSVG: "",
//         resetZoom: "恢复",
//         resetZoomTitle: "恢复"
//     }
// });

// 海拔和速度表
function createChart() {

    return new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            zoomType: 'x',
            renderTo: 'chart'
        },

        title: { // 标题
            text: '速度和海拔图表',
            align: 'left',
            margin: 50,
            useHTML: true,
            style: {
                color: '#111111',
                "fontSize": "20px"
            }
        },

        xAxis: { // x坐标轴
            labels: false
        },

        yAxis: [{ // y坐标轴
            title: {
                text: null,
                style: {
                    color: '#007ac2'
                }
            },
            labels: {
                style: {
                    color: '#007ac2'
                },
                formatter: function() {
                    return this.value;
                }
            },
            min: 0
        }, {
            labels: {
                style: {
                    color: '#aaaaaa'
                },
                formatter: function() {
                    return this.value;
                }
            },
            title: {
                text: null,
                style: {
                    color: '#aaaaaa'
                }
            },
            min: min_altitude,
            opposite: true
        }],
        tooltip: {
            formatter: function() {
                var speed = this.points[0];
                var altitude = this.points[1];
                return "速度：" + speed.y + "公里/小时<br>" + "海拔：" + altitude.y + " 米" + "<br>时间：" + formatTime(timeData[this.x]) + "<br>距离：≈" + distanceOfPoints[this.x] + " 公里";
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
                            var curPos = points[this.x];
                            if (!curPosMarker) {
                                curPosMarker = new google.maps.Marker({
                                    position: curPos,
                                    map: map,
                                    zIndex: 3,
                                    icon: "/static/images/map/marker.png"
                                });
                            } else {
                                curPosMarker.setPosition(curPos);
                            }
                        }
                    }
                }
            },
            line: {
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 2
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
                        // [0, Highcharts.getOptions().colors[0]],
                        [0, '#aaaaaa'],
                        [1, 'rgba(255,255,255,0.3)']
                    ]
                },
                lineWidth: 1.5,
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
                        lineWidth: 1.5
                    }
                }
            }
        },
        legend: {
            // 打开或关闭图例
            enabled: true,
            borderColor: '#fff',
            margin: 30,
            itemDistance: 100
                // labelFormat: '<span style="{color}">{name} (click to hide or show)</span>'
        },
        series: [{
            name: '速度',
            color: '#007ac2',
            type: 'line',
            shadow: false,
            zIndex: 1,
            data: speedData
        }, {
            name: '海拔',
            color: '#aaaaaa',
            type: 'areaspline',
            shadow: false,
            data: altitudeData,
            yAxis: 1,
            zIndex: 0
        }]
    });
}

// 心率和踏频表
function createChart2() {

    return new Highcharts.Chart({

        // 是否显示图表版权信息
        credits: {
            enabled: false
        },
        chart: {
            zoomType: 'x', // 指定此图是沿着什么轴进行放大
            renderTo: 'chart2'
        },

        title: { // 标题
            text: '心率和踏频图表',
            align: 'left',
            margin: 50,
            useHTML: true,
            style: {
                color: '#111111',
                // fontWeight: 'bold',
                fontSize: "20px"
            }
        },

        // x坐标轴
        xAxis: {
            labels: false
        },

        // y坐标轴
        yAxis: [{

            title: {
                text: null,
                style: {
                    color: '#e60012'
                }
            },
            labels: { // 心率
                style: {
                    color: '#e60012'
                },
                formatter: function() {
                    return this.value;
                }
            },
            min: 0
        }, {
            labels: { // 踏频
                style: {
                    color: '#00a0ff'
                },
                formatter: function() {
                    return this.value;
                }
            },
            title: {
                text: null
            },
            min: 0,
            opposite: true
        }],

        tooltip: {
            formatter: function() {
                var heartrate = this.points[0];
                var cadence = this.points[1];
                return '心率：' + heartrate.y + '<br>踏频：' + cadence.y + '<br>时间：' + formatTime(timeData[this.x]) + "<br>距离：≈" + distanceOfPoints[this.x] + " 公里";
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
                            var curPos = points[this.x];
                            if (!curPosMarker) {
                                curPosMarker = new google.maps.Marker({
                                    position: curPos,
                                    map: map,
                                    zIndex: 3,
                                    icon: "/static/images/map/marker.png"
                                });
                            } else {
                                curPosMarker.setPosition(curPos);
                            }
                        }
                    }
                }
            },
            line: {
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 2
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
                        // [0, Highcharts.getOptions().colors[0]],
                        [0, '#aaaaaa'],
                        [1, 'rgba(255,255,255,0.3)']
                    ]
                },
                lineWidth: 1.5,
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
                        lineWidth: 1.5
                    }
                }
            }
        },
        legend: {
            // 打开或关闭图例
            enabled: true,
            borderColor: '#fff',
            margin: 30,
            itemDistance: 100
        },
        series: [{
            name: '心率',
            color: '#e60012',
            type: 'line',
            shadow: false,
            data: heartrateData,
            yAxis: 0,
            zIndex: 0
        }, {
            name: '踏频',
            color: '#00a0ff',
            type: 'line',
            shadow: false,
            data: cadenceData,
            yAxis: 1,
            zIndex: 0
        }]
    });
}
