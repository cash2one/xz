$('.datepicker').datepicker({
    format: "yyyy-mm-dd",
    language: "zh-CN",
    autoclose: true
});

// 开始


$(function() {

    var addMedalTypeInp = document.querySelector('#addMedalTypeInp'),
        medalTypesWrap = $('#medalTypesWrap'),
        buttonSubmit = document.querySelector("#buttonSubmit"),
        mtype = $("#mtype"),

        fileUpyun = $('.file-upyun'),
        fileUpyunL = fileUpyun.length;


    // 添加开始结束时间戳
    var toUnixTimestamp = function(e) {
        var date = e;
        date = new Date(Date.parse(date.replace(/-/g, "/")));
        var timestampDate = date.getTime();
        return timestampDate;
    };
    $('#inputStarttime').on('change', function() {
        var realVal = $(this).val();
        $(this).next('input').val(toUnixTimestamp(realVal + ' 00:00:00'));
    });
    $('#inputEndtime').on('change', function() {
        var realVal = $(this).val();
        $(this).next('input').val(toUnixTimestamp(realVal + ' 23:59:59'));
    });


    // 子类型数目
    var mt = 0;
    mtypeStr = '';

    // 创建新类型勋章
    $('#addMedalTypeBtn').on('click', function(e) {
        e.preventDefault();
        mt += 1;
        mtypeStr += (mt + ',');
        mtype.val(mtypeStr);

        var HTML = '<div class="medal-types-cont bg-info col-md-12">' +
            '<h4>创建第' + mt + '个类型勋章</h4>' +
            '<input type="text" class="form-control" name="' + mt + '_title" placeholder="第' + mt + '个类型标题" required>' +
            '<textarea class="form-control" name="' + mt + '_desc" rows="3" maxlength="400" placeholder="第' + mt + '个类型描述" required></textarea>' +
            '<div class="form-group">' +
            '<input type="file" class="file-upyun" accept="image/*">' +
            '<input type="hidden" name="' + mt + '_pic">' +
            '</div>' +
            '</div>';
        $('#medalTypesWrap').append(HTML);

        fileUpyun = $('.file-upyun');
        fileUpyunL = fileUpyun.length;

        for (var i = 0; i < fileUpyun.length; i++) {
            fileUpyun[i].addEventListener('change', function() {
                var self = this;
                var file = this.files[0];

                var options = {
                    bucket: config.bucket,
                    // 'save-key': file.name,
                    'save-key': '/medal/{filemd5}{.suffix}', // 保存路径
                    'expiration': Math.floor(new Date().getTime() / 1000) + 86400, //请求过期时间
                    'allow-file-type': 'jpg,jpeg,png,gif', //允许上传的文件扩展名
                    'content-length-range': '10240,10240000' //文件大小限制：10kb~10M
                };

                var policy = window.btoa(JSON.stringify(options));
                var signature = CryptoJS.MD5(policy + '&' + config.form_api);

                var data = new FormData();
                data.append('policy', policy);
                data.append('signature', signature);
                data.append('file', file);

                var request = new XMLHttpRequest();
                request.open('POST', config.api + options.bucket);

                request.onload = function(e) {
                    self.nextElementSibling.value = 'http://static.imxingzhe.com' + JSON.parse(request.response).url;

                    var img = document.createElement("img");
                    img.src = 'http://static.imxingzhe.com' + JSON.parse(request.response).url + '!avatar';
                    img.width = 80;
                    self.parentNode.insertBefore(img, null);
                };

                request.send(data);

            });
        }

    });




    // 图片上传接口
    var config = {
        'api': 'http://v0.api.upyun.com/',
        'bucket': 'xingzhe-img',
        'form_api': 'loO4HjINwaV6UmjD14riVfV252w=' // 空间的表单 API
    };

    for (var i = 0; i < fileUpyun.length; i++) {
        fileUpyun[i].addEventListener('change', function() {
            var self = this;
            var file = this.files[0];

            // 计算 policy 和 signature 所需的参数
            // 详情见： http://docs.upyun.com/api/form_api/#表单API接口简介
            var options = {
                bucket: config.bucket,
                // 'save-key': file.name,
                'save-key': '/medal/{filemd5}{.suffix}', // 保存路径
                'expiration': Math.floor(new Date().getTime() / 1000) + 86400, //请求过期时间
                'allow-file-type': 'jpg,jpeg,png,gif', //允许上传的文件扩展名
                'content-length-range': '10240,10240000' //文件大小限制：10kb~10M
            };

            var policy = window.btoa(JSON.stringify(options));
            var signature = CryptoJS.MD5(policy + '&' + config.form_api);

            var data = new FormData();
            data.append('policy', policy);
            data.append('signature', signature);
            data.append('file', file);

            var request = new XMLHttpRequest();
            request.open('POST', config.api + options.bucket);

            request.onload = function(e) {
                self.nextElementSibling.value = 'http://static.imxingzhe.com' + JSON.parse(request.response).url;

                var img = document.createElement("img");
                img.src = 'http://static.imxingzhe.com' + JSON.parse(request.response).url ;
                img.width = 80;
                self.parentNode.insertBefore(img, null);
            };

            request.send(data);

        });
    }



    // sendData
    function sendData() {
        var XHR = new XMLHttpRequest();
        var FD = new FormData(form);
        var URL = "/new_add_medal/";

        // 数据成功发送并返回后执行的操作
        XHR.addEventListener("load", function(event) {
            console.log(XHR.response); //返回json
            var jsonParseJson = JSON.parse(event.target.response); // 解析 json
            // 根据json返回值进行的操作（成功添加/添加失败）
            if (jsonParseJson.res == 1) {
                showServerMsg('添加成功！','serve-msg-success');
                setTimeout(function() {
                    window.location.href = '/medal_list/';
                }, 2000);
            } else {
                console.log(jsonParseJson.error_msg);
                showServerMsg(jsonParseJson.error_message,'serve-msg-error');
            }
        });
        XHR.addEventListener("error", function(event) {
            alert('发生未知错误，请尝试重新提交');
        });
        XHR.open("POST", URL);
        XHR.send(FD);
    }
    var form = document.getElementById("addMedalForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        sendData();
    });


});
