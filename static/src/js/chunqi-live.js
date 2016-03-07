// 资料
var memberDATA = [{
    'uid': 'KtoWmJmYadm',
    'username': '思客',
    'stroke_color': '#028CDF',
    'avatar': 'http://cdn.bi-ci.com/img/chunqi/avatar-a.png'
}, {
    'uid': 'utmXudo5adm',
    'username': 'sunlyzhang',
    'stroke_color': '#22EC38',
    'avatar': 'http://cdn.bi-ci.com/img/chunqi/avatar-b.png'
}, {
    'uid': 'uJm1ydoXadm',
    'username': 'wind4237',
    'stroke_color': '#A366FF',
    'avatar': 'http://cdn.bi-ci.com/img/chunqi/avatar-c.png'
}, {
    'uid': 'uto5mtn2adm',
    'username': '骑不动的七年',
    'stroke_color': '#FF0706',
    'avatar': 'http://cdn.bi-ci.com/img/chunqi/avatar-d.png'
}];


// 地图样式
var styleArray = [{
    featureType: "poi.business",
    elementType: "labels",
    stylers: [{
        visibility: "off"
    }]
}];



// 初始化地图
var map = new google.maps.Map(document.getElementById('mapcanvas'), {
    zoom: 5,
    center: new google.maps.LatLng('32.742', '113.523'), // 地图初始化中心位置坐标
    styles: styleArray
});


// 初始化路书
// var flightPathL443914 = new google.maps.Polyline({
//     path: l_443914,
//     geodesic: true,
//     strokeColor: '#999999',
//     strokeOpacity: 0.6,
//     strokeWeight: 4
// });
// var flightPathL443561 = new google.maps.Polyline({
//     path: l_443561,
//     geodesic: true,
//     strokeColor: '#999999',
//     strokeOpacity: 0.6,
//     strokeWeight: 4
// });
var flightPathL446258 = new google.maps.Polyline({
    path: l_446258,
    geodesic: true,
    strokeColor: '#999999',
    strokeOpacity: 0.6,
    strokeWeight: 4
});
var flightPathL446640 = new google.maps.Polyline({
    path: l_446640,
    geodesic: true,
    strokeColor: '#999999',
    strokeOpacity: 0.6,
    strokeWeight: 4
});
// flightPathL443914.setMap(map);
// flightPathL443561.setMap(map);
flightPathL446258.setMap(map);
flightPathL446640.setMap(map);


// marker 图片（头像）
// var markerimgA = new google.maps.MarkerImage(memberDATA[0].avatar, null, null, null, new google.maps.Size(40, 61));
var markerimgB = new google.maps.MarkerImage(memberDATA[1].avatar, null, null, null, new google.maps.Size(40, 61));
// var markerimgC = new google.maps.MarkerImage(memberDATA[2].avatar, null, null, null, new google.maps.Size(40, 61));
var markerimgD = new google.maps.MarkerImage(memberDATA[3].avatar, null, null, null, new google.maps.Size(40, 61));


// 最新位置坐标
// var latestLocA = new google.maps.LatLng(latestLoc[0]['lat'], latestLoc[0]['lng']),
    var latestLocB = new google.maps.LatLng(latestLoc[1]['lat'], latestLoc[1]['lng']),
    // latestLocC = new google.maps.LatLng(latestLoc[2]['lat'], latestLoc[2]['lng']),
    latestLocD = new google.maps.LatLng(latestLoc[3]['lat'], latestLoc[3]['lng']);


// 绘制Marker
// var beachMarkerA = new google.maps.Marker({
//     position: latestLocA,
//     animation: google.maps.Animation.DROP,
//     map: map,
//     title: memberDATA[0].username,
//     icon: markerimgA
// });
var beachMarkerB = new google.maps.Marker({
    position: latestLocB,
    animation: google.maps.Animation.DROP,
    map: map,
    title: memberDATA[1].username,
    icon: markerimgB
});
// var beachMarkerC = new google.maps.Marker({
//     position: latestLocC,
//     animation: google.maps.Animation.DROP,
//     map: map,
//     title: memberDATA[2].username,
//     icon: markerimgC
// });
var beachMarkerD = new google.maps.Marker({
    position: latestLocD,
    animation: google.maps.Animation.DROP,
    map: map,
    title: memberDATA[3].username,
    icon: markerimgD
});


// var contentStringA = '<p><strong>' + memberDATA[0].username + '</strong><br>当前速度：' + latestLoc[0].speed + '</p>';
var contentStringB = '<p><strong>' + memberDATA[1].username + '</strong><br>当前速度：' + latestLoc[1].speed + '</p>';
// var contentStringC = '<p><strong>' + memberDATA[2].username + '</strong><br>当前速度：' + latestLoc[2].speed + '</p>';
var contentStringD = '<p><strong>' + memberDATA[3].username + '</strong><br>当前速度：' + latestLoc[3].speed + '</p>';


// var infowindowA = new google.maps.InfoWindow({
//     content: '<p><strong>' + memberDATA[0].username + '</strong><br>当前速度：' + latestLoc[0].speed + '</p>'
// });
var infowindowB = new google.maps.InfoWindow({
    content: '<p><strong>' + memberDATA[1].username + '</strong><br>当前速度：' + latestLoc[1].speed + '</p>'
});
// var infowindowC = new google.maps.InfoWindow({
//     content: '<p><strong>' + memberDATA[2].username + '</strong><br>当前速度：' + latestLoc[2].speed + '</p>'
// });
var infowindowD = new google.maps.InfoWindow({
    content: '<p><strong>' + memberDATA[3].username + '</strong><br>当前速度：' + latestLoc[3].speed + '</p>'
});
// google.maps.event.addListener(beachMarkerA, 'click', function() {
//     infowindowA.open(beachMarkerA.get('map'), beachMarkerA);
// });
google.maps.event.addListener(beachMarkerB, 'click', function() {
    infowindowB.open(beachMarkerB.get('map'), beachMarkerB);
});
// google.maps.event.addListener(beachMarkerC, 'click', function() {
//     infowindowC.open(beachMarkerC.get('map'), beachMarkerC);
// });
google.maps.event.addListener(beachMarkerD, 'click', function() {
    infowindowD.open(beachMarkerD.get('map'), beachMarkerD);
});






// 绘制实时曲线
// var flightPathA = new google.maps.Polyline({
//     path: _dataA,
//     geodesic: true,
//     strokeColor: memberDATA[0].stroke_color,
//     strokeOpacity: 0.9,
//     strokeWeight: 3
// });
// flightPathA.setMap(map);

var flightPathB = new google.maps.Polyline({
    path: _dataB,
    geodesic: true,
    strokeColor: memberDATA[1].stroke_color,
    strokeOpacity: 0.9,
    strokeWeight: 3
});
flightPathB.setMap(map);

// var flightPathC = new google.maps.Polyline({
//     path: _dataC,
//     geodesic: true,
//     strokeColor: memberDATA[2].stroke_color,
//     strokeOpacity: 0.9,
//     strokeWeight: 3
// });
// flightPathC.setMap(map);

var flightPathD = new google.maps.Polyline({
    path: _dataD,
    geodesic: true,
    strokeColor: memberDATA[3].stroke_color,
    strokeOpacity: 0.9,
    strokeWeight: 3
});
flightPathD.setMap(map);