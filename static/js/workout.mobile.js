
var map,
    bound,
    route,
    startMarker,
    stopMarker,
    curPosMarker,
    startPosition,
    stopPosition,
    chart,
    chartCadence,
    chartHeart;

$(init);

function init() {
    initMap();
    chart = createChart();
    chartCadence = createChartCadence();
    chartHeart = createChartHeart();
}


// 地图初始化
function initMap() {
    startPosition = points[0];
    stopPosition = points[points.length - 1];

    var options = {
        zoom : 14,
        center : points[0],
        mapTypeId : google.maps.MapTypeId.ROADMAP,
        panControl: false,
        zoomControl: false,
        streetViewControl: false,
        scaleControl: true,
        panControl: false
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

    // map.controls[google.maps.ControlPosition.TOP_RIGHT].push($("#changeMapSize").get(0));

    route = new google.maps.Polyline({
        path : points,
        strokeColor: '#ff0000',
        strokeOpacity : 0.7,
        strokeWeight : 4
    });

    route.setMap(map);

    var startMarkerIcon = new google.maps.MarkerImage("/static/images/map/starfinish-01.png", null, null, null, new google.maps.Size(24, 24));

    var stopMarkerIcon = new google.maps.MarkerImage("/static/images/map/starfinish-02.png", null, null, null, new google.maps.Size(24, 24));

    startMarker = new google.maps.Marker({
        position: startPosition,
        map: map,
        icon: startMarkerIcon,
        title:"开始",
        draggable: false
    });
    stopMarker = new google.maps.Marker({
        position: stopPosition,
        map: map,
        icon: stopMarkerIcon,
        title:"停止",
        draggable: false
    });

}

// function formatTime(ms) {
//     var date = new Date(ms);
//     return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
// }


// 速度海拔曲线表
function createChart() {

    return new Highcharts.Chart({
        credits: {  
          enabled: false  
        },
        chart: {
            // zoomType: 'x',
            renderTo: 'chart'
        },
        // 标题
        title: {
            text: null
        },

        // x坐标轴
        xAxis: {
            labels: false
        },
        // y坐标轴
        yAxis: [{
            title: {
                // text: '速度（km/h）',
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
        },{
            labels: {
                style: {
                    color: '#aaaaaa'
                },
                formatter: function() {
                    return this.value;
                }
            },
            title: {
                // text: '海拔（m）',
                text: null,
                style: {
                    color: '#aaaaaa'
                }
            },
            min: min_altitude,
            opposite: true
        }],
        tooltip: {
            enabled: false
        },
        plotOptions : {
            series : {
                allowPointSelect: false,
                enableMouseTracking: false,
                marker : {
                    enabled : false
                },
            },
            line: {
                lineWidth: 2
            },
            areaspline: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
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
            enabled: false
        },
        series: [{
            name: '速度',
            color: '#007ac2',
            type: 'line',
            shadow: false,
            zIndex: 1,
            data: speedData
        },{
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

// 踏频图表
function createChartCadence() {

    return new Highcharts.Chart({
        credits: {  
          enabled: false  
        },
        chart: {
            zoomType: 'x',
            renderTo: 'chartCadence'
        },
        // 标题
        title: {
            text: '踏频(bpm)',
            align: 'left',
            useHTML: true,
            style: {
                color: '#007ac2',
                fontSize: "12px"
            }
        },

        // x坐标轴
        xAxis: {
            labels: false
        },
        // y坐标轴
        yAxis: [{
            title: {
                text: null
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
            enabled: false
        },
        plotOptions : {
            series : {
                allowPointSelect: false,
                enableMouseTracking: false,
                marker : {
                    enabled : false
                },
            },
            line: {
                lineWidth: 2
            },
            areaspline: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
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
            enabled: false
        },
        series: [{
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

// 心率图表
function createChartHeart() {

    return new Highcharts.Chart({
        credits: {  
          enabled: false  
        },
        chart: {
            zoomType: 'x',
            renderTo: 'chartHeart'
        },
        // 标题
        title: {
            text: '心率(bpm)',
            align: 'left',
            useHTML: true,
            style: {
                color: '#e60012',
                fontSize: "12px"
            }
        },

        // x坐标轴
        xAxis: {
            labels: false
        },
        // y坐标轴
        yAxis: [{
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#e60012'
                },
                formatter: function() {
                    return this.value;
                }
            },
            min: 0
        }, {
            labels: {
                style: {
                    color: '#e60012'
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
            enabled: false
        },
        plotOptions : {
            series : {
                allowPointSelect: false,
                enableMouseTracking: false,
                marker : {
                    enabled : false
                },
            },
            line: {
                lineWidth: 2
            },
            areaspline: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
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
            enabled: false
        },
        series: [{
            name: '心率',
            color: '#e60012',
            type: 'line',
            shadow: false,
            data: heartrateData,
            yAxis: 1,
            zIndex: 0
        }]
    });
}