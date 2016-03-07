//百度地图API功能
function loadJScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=1410015343234e42388452d3087a8a2e&callback=init";
    document.body.appendChild(script);
}


function G(id) {
    return document.getElementById(id);
}


function init() {

    var activityLat = document.getElementById('activityLat'),
        activityLon = document.getElementById('activityLon'),
        suggestId = document.getElementById('suggestId'),
        activityCity = document.getElementById('activityCity');

    // 创建地理编码实例      
    var myGeo = new BMap.Geocoder();

    var map = new BMap.Map("l-map"); // 初始化地图
    map.centerAndZoom("上海", 16); // 设置城市和地图级别

    map.enableScrollWheelZoom(); //启用滚轮缩放

    map.addControl(new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL
    })); //右上角，仅包含平移和缩放按钮


    // 获取地理定位
    var geolocation = new BMap.Geolocation();

    geolocation.getCurrentPosition(function(r) {

        if (this.getStatus() == BMAP_STATUS_SUCCESS) {

            var mk = new BMap.Marker(r.point); // 定义坐标点
            map.addOverlay(mk);
            map.panTo(r.point);
            mk.enableDragging();

            var p = mk.getPosition(); //获取marker的位置

            console.log(p.lng + ", " + p.lat);
            activityLat.value = p.lat;
            activityLon.value = p.lng;

            mk.addEventListener("dragend", function(e) {

                console.log(e.point.lng + ", " + e.point.lat); //打印拖动结束坐标  
                activityLat.value = e.point.lat;
                activityLon.value = e.point.lng;

                // 根据坐标得到地址描述    
                myGeo.getLocation(new BMap.Point(e.point.lng, e.point.lat), function(result) {
                    if (result) {
                        console.log(result.address);
                        console.log(result.addressComponents.city);

                        suggestId.value = result.address;
                        activityCity.value = letCityStrToIndexNum(result.addressComponents.city);
                    }
                });
            });


        } else {
            alert('failed' + this.getStatus());
        }
    }, {
        enableHighAccuracy: true
    });

    //关于状态码
    //BMAP_STATUS_SUCCESS   检索成功。对应数值“0”。
    //BMAP_STATUS_CITY_LIST 城市列表。对应数值“1”。
    //BMAP_STATUS_UNKNOWN_LOCATION  位置结果未知。对应数值“2”。
    //BMAP_STATUS_UNKNOWN_ROUTE 导航结果未知。对应数值“3”。
    //BMAP_STATUS_INVALID_KEY   非法密钥。对应数值“4”。
    //BMAP_STATUS_INVALID_REQUEST   非法请求。对应数值“5”。
    //BMAP_STATUS_PERMISSION_DENIED 没有权限。对应数值“6”。(自 1.1 新增)
    //BMAP_STATUS_SERVICE_UNAVAILABLE   服务不可用。对应数值“7”。(自 1.1 新增)
    //BMAP_STATUS_TIMEOUT   超时。对应数值“8”。(自 1.1 新增)


    var ac = new BMap.Autocomplete( //建立一个自动完成的对象
        {
            "input": "suggestId",
            "location": map
        });

    ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });

    var myValue;
    ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

        console.log(_value.city);
        activityCity.value = letCityStrToIndexNum(_value.city);

        setPlace();
    });

    function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物

        function myFun() {
            var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 17);

            var mkpp = new BMap.Marker(pp);

            mkpp.enableDragging(); //mark可拖拽

            map.addOverlay(mkpp); //添加标注

            var p = mkpp.getPosition(); //获取marker的位置

            console.log(p.lng + ", " + p.lat);
            activityLat.value = p.lat;
            activityLon.value = p.lng;

            mkpp.addEventListener("dragend", function(e) {
                console.log(e.point.lng + ", " + e.point.lat); //打印拖动结束坐标  

                activityLat.value = e.point.lat;
                activityLon.value = e.point.lng;

                // 根据坐标得到地址描述    
                myGeo.getLocation(new BMap.Point(e.point.lng, e.point.lat), function(result) {
                    if (result) {
                        console.log(result.address);
                        console.log(result.addressComponents.city);

                        suggestId.value = result.address;
                        activityCity.value = letCityStrToIndexNum(result.addressComponents.city);
                    }
                });
            });


        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }

}
// window.onload = loadJScript; //异步加载地图


document.getElementById('activityAddress').onclick = loadJScript;
