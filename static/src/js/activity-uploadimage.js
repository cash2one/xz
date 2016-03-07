/*
/* UPYUN API
*/

var nowtimestamp = Date.parse(new Date()),
    log = document.getElementById("log"),
    activityCoverPicStr = '';

// 上传图片接口配置
function autoUploadImg() {

    var ext = '.' + document.getElementById('file').files[0].name.split('.').pop(),
        // filename = document.getElementById('file').files[0].name;
        filename = Math.random().toString(16).substring(2); // 随机字符串命名

    var config = {
        bucket: 'xingzhe-img',
        expiration: parseInt((new Date().getTime() + 3600000) / 1000),
        form_api_secret: 'loO4HjINwaV6UmjD14riVfV252w=',

    };

    var instance = new Sand(config);
    var options = {
        'notify_url': 'http://upyun.com',
        'allow-file-type': 'jpg,jpeg,png,gif', 
        'content-length-range': '1024,1024000', // 大小限制 1k-1M
        'content-type': 'image/*',
        // 'image-width-range': '1,2000'// 图片宽度限制
    };

    instance.setOptions(options);
    instance.upload('/event/' + myUserId + '/' + nowtimestamp + '/' + filename);
}

// 生成图片，并把图片地址字符串传到表单值
function addLog(data) {

    var elemimg = document.createElement("img");
    var elemimgsm = document.createElement("img");

    // elemimg.src = 'http://static.imxingzhe.com' + data.path;
    elemimgsm.src = 'http://static.imxingzhe.com' + data.path + '!coupon1';
    elemimgsm.setAttribute("title", "点击删除");
    elemimgsm.setAttribute("data-src", 'http://static.imxingzhe.com' + data.path);

    if (elemimgsm.classList) {
        elemimgsm.classList.add('pic');
    } else {
        elemimgsm.className += ' ' + 'pic';
    }

    log.appendChild(elemimgsm);

    // activityCoverPicStr += elemimg.src + ';';
    // activityCoverPicValStr = activityCoverPicStr.substring(0, activityCoverPicStr.length - 1);
    // console.log('activityCoverPicStr: ' + activityCoverPicValStr);

    // document.getElementById("activityCoverPic").setAttribute('value', activityCoverPicValStr);
}

// 上传
document.addEventListener('uploaded', function(e) {
    if ($("#log img").length < 4) {
        addLog(e.detail);
    } else {
        alert('最多上传4张图片');
    }
});

// 删除图片操作
$('#log').on('click', '.pic', function(event) {
    event.preventDefault();
    $(this).remove();
});