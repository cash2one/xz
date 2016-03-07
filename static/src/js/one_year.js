! function(t, a) {
    "function" == typeof define && define.amd ? define(a) : "object" == typeof exports ? module.exports = a(require, exports, module) : t.CountUp = a()
}(this, function(t, a, e) {
    /*

        countUp.js
        (c) 2014-2015 @inorganik
        Licensed under the MIT license.

    */
    var n = function(t, a, e, n, i, r) {
        for (var o = 0, s = ["webkit", "moz", "ms", "o"], u = 0; u < s.length && !window.requestAnimationFrame; ++u) window.requestAnimationFrame = window[s[u] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[s[u] + "CancelAnimationFrame"] || window[s[u] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(t, a) {
            var e = (new Date).getTime(),
                n = Math.max(0, 16 - (e - o)),
                i = window.setTimeout(function() {
                    t(e + n)
                }, n);
            return o = e + n, i
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
            clearTimeout(t)
        }), this.options = {
            useEasing: !0,
            useGrouping: !0,
            separator: ",",
            decimal: "."
        };
        for (var m in r) r.hasOwnProperty(m) && (this.options[m] = r[m]);
        "" === this.options.separator && (this.options.useGrouping = !1), this.options.prefix || (this.options.prefix = ""), this.options.suffix || (this.options.suffix = ""), this.d = "string" == typeof t ? document.getElementById(t) : t, this.startVal = Number(a), this.endVal = Number(e), this.countDown = this.startVal > this.endVal, this.frameVal = this.startVal, this.decimals = Math.max(0, n || 0), this.dec = Math.pow(10, this.decimals), this.duration = 1e3 * Number(i) || 2e3;
        var l = this;
        this.version = function() {
            return "1.6.1"
        }, this.printValue = function(t) {
            var a = isNaN(t) ? "--" : l.formatNumber(t);
            "INPUT" == l.d.tagName ? this.d.value = a : "text" == l.d.tagName || "tspan" == l.d.tagName ? this.d.textContent = a : this.d.innerHTML = a
        }, this.easeOutExpo = function(t, a, e, n) {
            return e * (-Math.pow(2, -10 * t / n) + 1) * 1024 / 1023 + a
        }, this.count = function(t) {
            l.startTime || (l.startTime = t), l.timestamp = t;
            var a = t - l.startTime;
            l.remaining = l.duration - a, l.options.useEasing ? l.countDown ? l.frameVal = l.startVal - l.easeOutExpo(a, 0, l.startVal - l.endVal, l.duration) : l.frameVal = l.easeOutExpo(a, l.startVal, l.endVal - l.startVal, l.duration) : l.countDown ? l.frameVal = l.startVal - (l.startVal - l.endVal) * (a / l.duration) : l.frameVal = l.startVal + (l.endVal - l.startVal) * (a / l.duration), l.countDown ? l.frameVal = l.frameVal < l.endVal ? l.endVal : l.frameVal : l.frameVal = l.frameVal > l.endVal ? l.endVal : l.frameVal, l.frameVal = Math.floor(l.frameVal * l.dec) / l.dec, l.printValue(l.frameVal), a < l.duration ? l.rAF = requestAnimationFrame(l.count) : l.callback && l.callback()
        }, this.start = function(t) {
            return l.callback = t, l.rAF = requestAnimationFrame(l.count), !1
        }, this.pauseResume = function() {
            l.paused ? (l.paused = !1, delete l.startTime, l.duration = l.remaining, l.startVal = l.frameVal, requestAnimationFrame(l.count)) : (l.paused = !0, cancelAnimationFrame(l.rAF))
        }, this.reset = function() {
            l.paused = !1, delete l.startTime, l.startVal = a, cancelAnimationFrame(l.rAF), l.printValue(l.startVal)
        }, this.update = function(t) {
            cancelAnimationFrame(l.rAF), l.paused = !1, delete l.startTime, l.startVal = l.frameVal, l.endVal = Number(t), l.countDown = l.startVal > l.endVal, l.rAF = requestAnimationFrame(l.count)
        }, this.formatNumber = function(t) {
            t = t.toFixed(l.decimals), t += "";
            var a, e, n, i;
            if (a = t.split("."), e = a[0], n = a.length > 1 ? l.options.decimal + a[1] : "", i = /(\d+)(\d{3})/, l.options.useGrouping)
                for (; i.test(e);) e = e.replace(i, "$1" + l.options.separator + "$2");
            return l.options.prefix + e + n + l.options.suffix
        }, l.printValue(l.startVal)
    };
    return n
});




window.onload = function() {


    // 把数据添加到 DOM
    var data = _DATA;


    // 判断轨迹数为0，则显示empty
    if (data.have_record === 0) {
        document.querySelector('.page5').classList.add('empty');
        document.querySelector('.page6').classList.add('empty');
    }
    //username
    document.querySelector('#username').textContent = data.username;
    

    //骑行距离
    var mvcdis = data.mvcdis.split(','),
        mvcdistotal = 0;
    for (var i = 0; i < mvcdis.length; i++) {
        mvcdistotal += parseInt(mvcdis[i]);
    }

    //跑步距离
    var mvrdis = data.mvrdis.split(','),
        mvrdistotal = 0;
    for (var i = 0; i < mvrdis.length; i++) {
        mvrdistotal += parseInt(mvrdis[i]);
    }

    //徒步距离
    var mvwdis = data.mvwdis.split(','),
        mvwdistotal = 0;
    for (var i = 0; i < mvwdis.length; i++) {
        mvwdistotal += parseInt(mvwdis[i]);
    }

    //骑行距离＋跑步距离＋徒步距离
    var distotal = mvwdistotal + mvrdistotal + mvcdistotal;

    //骑行距离,跑步距离,徒步距离数值展示
    document.querySelector('#bicycleKm').textContent = Math.round(mvcdistotal / 1000);
    document.querySelector('#runKm').textContent = Math.round(mvrdistotal / 1000);
    document.querySelector('#walkKm').textContent = Math.round(mvwdistotal / 1000);

    //骑行距离,跑步距离,徒步距离的横柱状图展示
    var bicyclebar = (mvcdistotal / distotal).toFixed(2),
        runbar = (mvrdistotal / distotal).toFixed(2),
        walkbar = (mvwdistotal / distotal).toFixed(2);

    // 小数转化为百分数
    function toPercent(e) {
        return (Math.round(e * 10000) / 100).toFixed(0) + '%';
    }

    // console.log(toPercent(bicyclebar));
    // console.log(toPercent(runbar));
    // console.log(toPercent(walkbar));

    document.querySelector('#mvcdisWidth').style.width = toPercent(bicyclebar);
    document.querySelector('#mvrdisWidth').style.width = toPercent(runbar);
    document.querySelector('#mvwdisWidth').style.width = toPercent(walkbar);


    //骑行运动时间
    var mvcdur = data.mvcdur.split(','),
        mvcdurtotal = 0;
    for (var i = 0; i < mvcdur.length; i++) {
        mvcdurtotal += parseInt(mvcdur[i]);
    }
    mvcdurtotal = Math.round(mvcdurtotal / 3600);
    document.querySelector('#mvcdurtotal').textContent = mvcdurtotal;

    //跑步运动时间
    var mvrdur = data.mvrdur.split(','),
        mvrdurtotal = 0;
    for (var i = 0; i < mvrdur.length; i++) {
        mvrdurtotal += parseInt(mvrdur[i]);
    }
    mvrdurtotal = Math.round(mvrdurtotal / 3600);
    document.querySelector('#mvrdurtotal').textContent = mvrdurtotal;

    //徒步运动时间
    var mvwdur = data.mvwdur.split(','),
        mvwdurtotal = 0;
    for (var i = 0; i < mvwdur.length; i++) {
        mvwdurtotal += parseInt(mvwdur[i]);
    }
    mvwdurtotal = Math.round(mvwdurtotal / 3600);
    document.querySelector('#mvwdurtotal').textContent = mvwdurtotal;

    //骑行时间＋跑步时间＋徒步时间
    durtotal = mvwdurtotal + mvrdurtotal + mvcdurtotal;
    document.querySelector('#durtotal').textContent = durtotal;

    //骑行爬升
    var mvceg = data.mvceg.split(','),
        mvcegtotal = 0;
    for (var i = 0; i < mvceg.length; i++) {
        mvcegtotal += parseInt(mvceg[i]);
    }
    mvcegtotal = Math.round(mvcegtotal / 1000);
    document.querySelector('#mvcegtotal').textContent = mvcegtotal;


    //跑步爬升
    var mvreg = data.mvreg.split(','),
        mvregtotal = 0;
    for (var i = 0; i < mvreg.length; i++) {
        mvregtotal += parseInt(mvreg[i]);
    }
    mvregtotal = Math.round(mvregtotal / 1000);
    document.querySelector('#mvregtotal').textContent = mvregtotal;


    //徒步爬升
    var mvweg = data.mvweg.split(','),
        mvwegtotal = 0;
    for (var i = 0; i < mvweg.length; i++) {
        mvwegtotal += parseInt(mvweg[i]);
    }
    mvwegtotal = Math.round(mvwegtotal / 1000);
    document.querySelector('#mvwegtotal').textContent = mvwegtotal;

    //骑行爬升＋跑步爬升＋徒步爬升
    egtotal = mvwegtotal + mvregtotal + mvcegtotal;
    document.querySelector('#egtotal').textContent = egtotal;

    //骑行条数
    var mvccou = data.mvccou.split(','),
        mvccoutotal = 0;
    for (var i = 0; i < mvccou.length; i++) {
        mvccoutotal += parseInt(mvccou[i]);
    }
    document.querySelector('#mvccoutotal').textContent = mvccoutotal;

    //跑步条数
    var mvrcou = data.mvrcou.split(','),
        mvrcoutotal = 0;
    for (var i = 0; i < mvrcou.length; i++) {
        mvrcoutotal += parseInt(mvrcou[i]);
    }
    document.querySelector('#mvrcoutotal').textContent = mvrcoutotal;

    //徒步条数
    var mvwcou = data.mvwcou.split(','),
        mvwcoutotal = 0;
    for (var i = 0; i < mvwcou.length; i++) {
        mvwcoutotal += parseInt(mvwcou[i]);
    }
    document.querySelector('#mvwcoutotal').textContent = mvwcoutotal;

    //骑行时间＋跑步时间＋徒步时间
    coutotal = mvwcoutotal + mvrcoutotal + mvccoutotal;
    document.querySelector('#coutotal').textContent = coutotal;

    //骑行,跑步,徒步,消耗
    var wcal = parseInt(data.wcal),
        rcal = parseInt(data.rcal),
        ccal = parseInt(data.ccal);
    cal = wcal + rcal + ccal;
    document.querySelector('#cal').textContent = cal;
    document.querySelector('#wcal').textContent = wcal;
    document.querySelector('#rcal').textContent = rcal;
    document.querySelector('#ccal').textContent = ccal;

    // 冲刺，技巧，耐力，活跃度，爬升
    ability = (parseInt(data.cclev) + parseInt(data.pplev) + parseInt(data.hydlev) + parseInt(data.nllev) + parseInt(data.jqlev)) * 2;
    document.querySelector('#ability').textContent = ability;
    var lev = [];
    lev.push(data.cclev * 10); //冲刺lev
    lev.push(data.jqlev * 10); // 技巧lev
    lev.push(data.nllev * 10); //耐力lev
    lev.push(data.hydlev * 10); //活跃度lev
    lev.push(data.pplev * 10); //爬坡lev


    //排名
    document.querySelector('#user_rank').textContent = data.user_rank;

    // 总里程
    var mvdis = data.mvdis.split(','),
        mvdiskm = [],
        max = 0,
        index = 0;
    for (var i = 0; i < mvdis.length; i++) {
        mvdiskm[i] = Math.round(parseInt(mvdis[i]) / 1000);
        if (max < mvdiskm[i]) {
            max = mvdiskm[i];
        }
    }


    //勋章
    if (data.medals === '') { // 没有勋章则显示没有
        document.querySelector('.page4').classList.add('empty');
    } else {
        var medals = data.medals.split(','),
            medalImgHTML = '';
        for (var i = 0; i < medals.length; i++) {
            medalImgHTML += '<img class="ani swiper-lazy" swiper-animate-effect="zoomIn" swiper-animate-delay=".2s" swiper-animate-duration=".5s" data-src="' + medals[i] + '!medalSmall">';
        }
        document.querySelector('.medal-container').innerHTML = medalImgHTML;
    }




    // 判断轨迹数为0，则显示empty
    if (data.have_record === '-1') {
        document.querySelector('.page5').classList.add('empty');
        document.querySelector('.page7').classList.add('empty');
    } else {

        //低碳生活
        var mveg = data.mveg.split(','),
            mvegtotal = 0;
        for (var i = 0; i < mveg.length; i++) {
            mvegtotal += parseInt(mveg[i]);
        }
        //碳排放

        var mvdistotal = 0;
        for (var i = 0; i < mvdis.length; i++) {
            mvdistotal += parseInt(mvdis[i]);
        }

        carbonemission = parseInt(mvdistotal / 1000 * 0.055);
        document.querySelector('#carbonemission').setAttribute('data-num', carbonemission);

        petrol = parseInt(carbonemission * 0.73);
        document.querySelector('#petrol').setAttribute('data-num', petrol);

        //运动消耗卡路里
        document.querySelector('#cal2').setAttribute('data-num', cal);
        document.querySelector('#hbb').setAttribute('data-num', Math.round(cal / 400));

        //相当于珠峰
        document.querySelector('#mveg').setAttribute('data-num', Math.floor(mvegtotal / 1000));
        document.querySelector('#mvegcount').setAttribute('data-num', Math.floor(mvegtotal / 8844));


        //运动记录
        document.querySelector('#cdayslen').setAttribute('data-num', data.cdayslen);
        //轨迹条数
        var mvcou = data.mvcou.split(','),
            mvcoutotal = 0;
        for (var i = 0; i < mvcou.length; i++) {
            mvcoutotal += parseInt(mvcou[i]);
        }
        document.querySelector('#mvcou').setAttribute('data-num', mvcoutotal);
        //路书数
        document.querySelector('#lc').setAttribute('data-num', data.lc);
        //创建活动
        document.querySelector('#acc').setAttribute('data-num', data.acc);
        //参加我的活动
        document.querySelector('#acjc').setAttribute('data-num', data.acjc);
        //我参与其他人的活动
        document.querySelector('#ajc').setAttribute('data-num', data.ajc);


    }



    //最高记录
    document.querySelector('#mdur1').textContent = Math.floor(data.mdur / 3600);
    document.querySelector('#mdur2').textContent = Math.floor((data.mdur - Math.floor(data.mdur / 3600) * 3600) / 60);
    document.querySelector('#mdurid').textContent = data.mdurid;


    document.querySelector('#mdis').textContent = Math.floor(data.mdis / 1000);

    document.querySelector('#meg').textContent = data.meg;
    document.querySelector('#megid').textContent = data.megid;

    document.querySelector('#msp').textContent = data.msp;
    document.querySelector('#mspid').textContent = data.mspid;

    document.querySelector('#mdisid').textContent = data.mdisid;
    document.querySelector('#mdisidtoo').textContent = data.mdisid;



    // 今年最长的骑行轨迹图
    if (data.workout.uuid === undefined) {
        console.log(data.workout.uuid);
        document.querySelector('#workoutLonger').setAttribute('data-src', 'http://imxingzhe.com/api/get_workout_image?scale=1&copyright=1&width=750.000000&height=308.000000&distance=' + data.workout.wdis + '&duration=' + data.workout.wdur + '&id=' + data.mdisid);
    } else {
        document.querySelector('#workoutLonger').setAttribute('data-src', 'http://static.imxingzhe.com/workout/' + data.workout.uuid + '.png');
    }




    // Unix时间戳(Unix timestamp) 转 普通时间

    //开始时间
    function toStrTime(e) {
        var date = new Date(e);
        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        return Y + M + D;
    }
    var d = parseInt(data.workout.wst);
    document.querySelector('#wst').textContent = toStrTime(d);

    //运动里程
    document.querySelector('#wdis').textContent = Math.floor(data.workout.wdis / 1000);
    //累计爬升
    document.querySelector('#weg').textContent = data.workout.weg;
    //运动时长
    var hour = Math.floor(data.workout.wdur / 3600),
        minute = Math.floor((data.workout.wdur - hour * 3600) / 60),
        second = data.workout.wdur - hour * 3600 - minute * 60;
    document.querySelector('#wdur').textContent = hour + "小时" + minute + "分";
    //平均速度
    totalmiles = parseInt(data.workout.wdis) + parseInt(data.workout.weg);
    sp = totalmiles / data.workout.wdur;
    document.querySelector('#wavesp').textContent = (sp * 3.6).toFixed(2);


    //去过的城市
    if (data.city === '') {
        document.querySelector('#citycount').textContent = '0';
    } else {
        var city = data.city.split(','),
            cityLength = city.length,
            cityDOM = document.querySelector('#city');
        document.querySelector('#citycount').textContent = cityLength;
        cityDOM.textContent = data.city;
        if (cityLength > 20 && cityLength <= 50) {
            cityDOM.style.fontSize = '0.32rem';
        } else if (cityLength > 50) {
            cityDOM.style.fontSize = '0.24rem';
        }
    }




    // 初始化Swiper
    var swiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        lazyLoading: true,
        lazyLoadingInPrevNext : true,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        onInit: function(swiper) {
            swiperAnimateCache(swiper); //隐藏动画元素 
            swiperAnimate(swiper); //初始化完成开始动画
        },
        onSlideChangeEnd: function(swiper) {
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
            pageShowAnimation();
        }
    });







    // get json file
    // var request = new XMLHttpRequest();
    // request.open('GET', 'http://www.imxingzhe.com/api/v4/personal/859089/', true);

    // request.onload = function() {
    //   if (this.status >= 200 && this.status < 400) {
    //     console.log('success');
    //     var resp = this.response;
    //   } else {
    //     console.log('5xx');

    //   }
    // };

    // request.onerror = function() {
    //   console.log('error');
    // };

    // request.send();





    // 环形图Data
    var doughnutdurData = [{
            value: mvcdurtotal,
            color: "#1085c4",
        }, {
            value: mvrdurtotal,
            color: "#87d1e6"

        }, {
            value: mvwdurtotal,
            color: "#e39908"
        }],
        doughnutegData = [{
            value: mvcegtotal,
            color: "#1085c4",
        }, {
            value: mvregtotal,
            color: "#87d1e6"

        }, {
            value: mvwegtotal,
            color: "#e39908"
        }],
        doughnutcouData = [{
            value: mvccoutotal,
            color: "#1085c4",
        }, {
            value: mvrcoutotal,
            color: "#87d1e6"

        }, {
            value: mvwcoutotal,
            color: "#e39908"
        }],
        doughnutcalData = [{
            value: ccal,
            color: "#1085c4",
        }, {
            value: rcal,
            color: "#87d1e6"

        }, {
            value: wcal,
            color: "#e39908"
        }];

    //柱状图Data
    var barChartData = {
        labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        datasets: [{
            fillColor: "#87d1e6",
            data: mvdiskm
        }]
    };

    // 雷达图Data
    var radarChartData = {
        labels: ["冲刺", "技巧", "耐力", "活跃度", "爬升"],
        datasets: [{
            label: "My First dataset",
            fillColor: "rgba(0,28,71,1)",
            data: [100, 100, 100, 100, 100]
        }, {
            label: "My First dataset",
            fillColor: "rgba(24,53,98,0.8)",
            strokeColor: "rgba(24,53,98,0)",
            pointColor: "rgba(24,53,98,0)",
            pointStrokeColor: "rgba(24,53,98,0)",
            pointHighlightFill: "rgba(24,53,98,0)",
            data: [90, 90, 90, 90, 90]
        }, {
            label: "My First dataset",
            fillColor: "rgba(42,89,134,0.8)",
            strokeColor: "rgba(24,53,98,0)",
            pointColor: "rgba(24,53,98,0)",
            pointStrokeColor: "rgba(24,53,98,0)",
            pointHighlightFill: "rgba(24,53,98,0)",
            data: [80, 80, 80, 80, 80]
        }, {
            label: "My First dataset",
            fillColor: "rgba(60,125,170,0.8)",
            strokeColor: "rgba(60,125,170,0)",
            pointColor: "rgba(60,125,170,0)",
            pointStrokeColor: "rgba(60,125,170,0)",
            pointHighlightFill: "rgba(60,125,170,0)",
            data: [70, 70, 70, 70, 70]
        }, {
            label: "My First dataset",
            fillColor: "rgba(75,153,199,0.8)",
            strokeColor: "rgba(75,153,199,0)",
            pointColor: "rgba(75,153,199,0)",
            pointStrokeColor: "rgba(75,153,199,0)",
            pointHighlightFill: "rgba(75,153,199,0)",
            data: [60, 60, 60, 60, 60]
        }, {
            label: "My First dataset",
            fillColor: "rgba(85,171,217,0.8)",
            strokeColor: "rgba(85,171,217,0)",
            pointColor: "rgba(85,171,217,0)",
            pointStrokeColor: "rgba(85,171,217,0)",
            pointHighlightFill: "rgba(85,171,217,0)",
            data: [50, 50, 50, 50, 50]
        }, {
            label: "My First dataset",
            fillColor: "rgba(91,183,228,0.8)",
            strokeColor: "rgba(91,183,228,0)",
            pointColor: "rgba(91,183,228,0)",
            pointStrokeColor: "rgba(91,183,228,0)",
            pointHighlightFill: "rgba(91,183,228,0)",
            data: [40, 40, 40, 40, 40]
        }, {
            label: "My First dataset",
            fillColor: "rgba(105,196,240,0.8)",
            strokeColor: "rgba(105,196,240,0)",
            pointColor: "rgba(105,196,240,0)",
            pointStrokeColor: "rgba(105,196,240,0)",
            pointHighlightFill: "rgba(105,196,240,0)",
            data: [30, 30, 30, 30, 30]
        }, {
            label: "My First dataset",
            fillColor: "rgba(189,154,64,0.01)",
            strokeColor: "#bd9a40",
            pointColor: "#bd9a40",
            pointStrokeColor: "#bd9a40",
            pointHighlightFill: "#bd9a40",
            data: lev
        }]
    };





    // 环形图初始化
    function showDoughnutChart() {
        var optionDoughnut = {
            responsive: false,
            animationSteps: 60,
            segmentShowStroke: false
        };

        var datectx = document.getElementById("date").getContext("2d");
        new Chart(datectx).Doughnut(doughnutdurData, optionDoughnut);

        var climbctx = document.getElementById("climb").getContext("2d");
        new Chart(climbctx).Doughnut(doughnutegData, optionDoughnut);

        var timectx = document.getElementById("time").getContext("2d");
        new Chart(timectx).Doughnut(doughnutcouData, optionDoughnut);

        var consumectx = document.getElementById("consume").getContext("2d");
        new Chart(consumectx).Doughnut(doughnutcalData, optionDoughnut);
    }


    // 雷达图初始化
    function showRadarChart() {
        window.myRadar = new Chart(document.getElementById("radarcanvas").getContext("2d")).Radar(radarChartData, {
            responsive: true,
            pointLabelFontSize: 11
        });
    }


    //柱状图初始化
    function showBarChart() {
        var ctx = document.getElementById("barcanvas").getContext("2d");
        new Chart(ctx).Bar(barChartData, {
            responsive: true,
            scaleShowLabels: true,
            scaleFontSize: 9,
            pointLabelFontSize: 10,

            scaleOverride: true, //是否用硬编码重写y轴网格线
            scaleSteps: 4, //y轴刻度的个数
            scaleStepWidth: Math.round(max / 4), //y轴每个刻度的宽度
            scaleStartValue: 0, //y轴的起始值
        });
    }


    var page2 = document.querySelector('.page2'),
        page3 = document.querySelector('.page3'),
        page5 = document.querySelector('.page5'),
        page7 = document.querySelector('.page7');

    // 页面显示动画
    function pageShowAnimation() {

        // 我与行者的2015
        if (page2.getAttribute('showed') !== 'true' && page2.classList.contains('swiper-slide-active')) {
            setTimeout(showDoughnutChart, 200);

            page2.setAttribute('showed', 'true');
        }

        // 个人年度成就
        if (page3.getAttribute('showed') !== 'true' && page3.classList.contains('swiper-slide-active')) {
            setTimeout(showRadarChart, 200);
            setTimeout(showBarChart, 200);

            page3.setAttribute('showed', 'true');
        }


        // 数字动画配置
        var options = {  
            useEasing: true,
            useGrouping: false
        };

        var aniNum = document.querySelectorAll('.ani-num');
        function showAniNum () {
            for (var i = 0; i < aniNum.length; i++) {
                var self = aniNum[i];
                var dataNum = self.getAttribute('data-num');
                var demo = new CountUp(self, 0, dataNum, 0, 1, options);
                demo.start();
            }
        }

        // 显示 低碳生活 页面
        if (page5.classList.contains('swiper-slide-active')) {
            showAniNum();
        }

        // 显示 运动记录 页面
        if (page7.classList.contains('swiper-slide-active')) {
            showAniNum();
        }





        





    }


};
