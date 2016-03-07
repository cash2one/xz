var thisTitle = document.title;

// live title
function handleVisibilityChange() {
    if (document.hidden) {
        document.title = "​你快回来~ | " + thisTitle;
    } else {
        document.title = thisTitle;
    }
}
if (document.addEventListener) {
    document.addEventListener("visibilitychange", handleVisibilityChange, false);
}



// navbar on mobile
var navbarToggleBtn = document.querySelector('.navbar-toggle');
if (navbarToggleBtn) {
    navbarToggleBtn.addEventListener('click', function () {
        var collapse = document.querySelector('.collapse');
        if (collapse.style.display == "none") {
            collapse.style.display = "block";
        } else {
            collapse.style.display = "none";
        }
    });    
};



var ele_div = document.createElement("div");
ele_div.className = 'serve-msg';
document.body.appendChild(ele_div);



/**
 * server message tip
 *
 * use demo:
 * showServerMsg('Success!','serve-msg-success');
 * showServerMsg('Error!','serve-msg-error');
 */

var showServerMsg = function(message, type) {
    var hideClassStr = 'serve-msg-hide';
    clearTimeout(hideEleDiv);

    // 移除隐藏div的className
    if (ele_div.classList)
        ele_div.classList.remove(hideClassStr);
    else
        ele_div.className = ele_div.className.replace(new RegExp('(^|\\b)' + hideClassStr.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

    // 在div添加提示信息
    if (ele_div.textContent !== undefined)
        ele_div.textContent = message;
    else
        ele_div.innerText = message;

    // 在div添加type的className
    if (ele_div.classList)
        ele_div.classList.add(type);
    else
        ele_div.className += ' ' + type;

    // 1.5s后隐藏div
    var hideEleDiv = setTimeout(function() {
        ele_div.classList.add(hideClassStr);
    }, 1500);
};





// 普通时间 转 Unix时间戳(Unix timestamp)
// 2015-10-19 16:05:00 → 1445270671200
// function toUnixTimestamp(e) {
//     var str = e.replace(/-/g, "/");
//     var date = new Date(str);
//     var humanDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
//     return humanDate.getTime() - 8 * 60 * 60;
//     // return humanDate.getTime() / 1000 - 8 * 60 * 60;

// }
var toUnixTimestamp = function(e) {
    var date = e;
    date = new Date(Date.parse(date.replace(/-/g, "/")));
    var timestampDate = date.getTime();
    return timestampDate;
};



// Unix时间戳(Unix timestamp) 转 普通时间
// 1445241900000 → 2015-10-19 16:05:00
var toStrTime = function(e) {
        var date = new Date(e);
        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
        s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return Y + M + D + h + m + s;
    };
    // 获取一个时间对象  注意：如果是uinx时间戳需乘于1000
    // var date = new Date(时间戳);
    // 
    // date.getFullYear(); //获取完整的年份(4位,1970)
    // date.getMonth(); //获取月份(0-11,0代表1月,用的时候记得加上1)
    // date.getDate(); //获取日(1-31)
    // date.getTime(); //获取时间(从1970.1.1开始的毫秒数)
    // date.getHours(); //获取小时数(0-23)
    // date.getMinutes(); //获取分钟数(0-59)
    // date.getSeconds(); //获取秒数(0-59)





// 秒数 转 时间格式
// 120 → 00:02:00
var transDurationData = function(e) {
    var hours = parseInt(e / 3600);
    var minutes = parseInt(e / 60) % 60;
    var seconds = e % 60;
    return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
};







// 两个时间戳之间的天数（f > e）
var getDateDifferent = function(e, f) {
    var days = f - e;
    var time = parseInt(days / (60 * 60 * 24));
    return time;
};







// 判断当前时间状态，e 为开始时间戳，f 为结束时间戳，t 为当前时间戳
var getDateStatus = function(e, f) {
    var t = Date.parse(new Date());
    if (t > f) {
        return '已结束';
    } else if (t >= e && t <= f) {
        return '进行中';
    } else if (t < e) {
        var hasDays = e - t;
        var time = parseInt(hasDays / (60 * 60 * 24 * 1000));
        if (time === 0) {
            return '即将开始';
        } else {
            return time + '天后';
        }
    }
};






// 活动类型数字转 mark 字符串
var typeToStr = function(e) {
    if (e == '0') {
        return '<mark class="jiandan">简单</mark>';
    } else if (e == '1') {
        return '<mark class="xiuxian">休闲</mark>';
    } else if (e == '2') {
        return '<mark class="kunnan">困难</mark>';
    } else if (e == '3') {
        return '<mark class="fengkuang">疯狂</mark>';
    } else if (e == '4') {
        return '<mark class="diyu">地狱</mark>';
    }
};



// 米转化为公里  值,保留小数位
var mToKm = function(e, f) {
    e = e / 1000;
    if (e >= 1000) {
        return Math.round(e);
    } else {
        return e.toFixed(f);
    }
};





// 截取图片地址字符串的第一张图
var getFirstPicUrl = function(e) {
    fistImgUrl = e.split(";");
    return fistImgUrl[0];
};



// 正则验证手机号
var isPhone = function(str) {
    var pattern = /^(13[0-9]|14[57]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
    return pattern.test(str);
};

// 正则验证邮箱
var isEmail = function(str) {
    var pattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
    return pattern.test(str);
};

// 正则验证是否为空
var isEmpty = function(str) {
    return str === null || typeof str === "undefined" || str.trim() === "" ? false : true;
};

// 正则验证是否是6位纯数字
var isCode = function(str) {
    var pattern = /^[0-9]\d{5}$/;
    return pattern.test(str);
};



// 判断是否微信浏览器
var is_weixin = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
};

// 判断是否iOS浏览器
var is_ios = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
};

// 判断是否Android浏览器
var is_android = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (/(Android)/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
};