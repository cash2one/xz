$(function() {

    var isNotEmpty = function(str) {
        return str !== '';
    };

    var isPhone = function(str) {
        var pattern = /^(13[0-9]|14[57]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
        return pattern.test(str);
    };

    var isEmail = function(str) {
        var pattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
        return pattern.test(str);
    };

    var isCode = function(str) {
        var pattern = /^[0-9]\d{3}$/;
        return pattern.test(str);
    };

    var inputMobile = $("#inputMobile"),
        getCodeBtn = $('#getCodeBtn'),
        inputCode = $('#inputCode'),
        inputPsw = $('#inputPsw'),
        inputPswRepeat = $('#inputPswRepeat'),
        resetPswBtn = $('#resetPswBtn'),
        inputEmail = $('#inputEmail'),
        sendEmailBtn = $('#sendEmailBtn'),
        postURL = '/user/find_password';

     // 验证码相关
    var captchaGet = '/api/v4/captcha_reg',
        voteCaptchaImg = $('#voteCaptchaImg');
    // 获取验证码函数，e=get地址，f=验证码图片DOM
    var getCaptchaImg = function() {
        $.get(captchaGet, function() {
            voteCaptchaImg.attr('src', captchaGet);
        });
    }
    getCaptchaImg();
    voteCaptchaImg.on('click', function() { // 点击验证码图片便更新一次
        getCaptchaImg();
    });
    
    var imgCaptchaData = '';
    $('#getCodeBtn').addClass('disabled');

    $('#voteCaptchaInput').keyup(function(){
        if($('#voteCaptchaInput').val().length == 4){
             captcha();
        }else{
            $('#getCodeBtn').addClass('disabled');
        };
    });
    
    function captcha(){
         imgCaptchaData =  $('#voteCaptchaInput').val();  
         setTimeout(function (){
                $('#getCodeBtn').removeClass('disabled');
          }, 500);
    }    


    // get msg code
    $('#getCodeBtn').on('click', function() {
        if ($(this).hasClass('disabled')) {
            event.preventDefault();
        } else {
            var inputMobileVal = inputMobile.val();
            if (isPhone(inputMobileVal)) {

                $.ajax({
                    url: '/api/v4/send_msg',
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify({
                        account: inputMobileVal,
                        type: 5,
                        isvoice: 0,
                        code: imgCaptchaData
                    }),
                    success: function(data) {
                        getCodeBtn.addClass('disabled').text('60秒');
                        var clickTime = new Date().getTime();
                        var Timer = setInterval(function() {
                            var nowTime = new Date().getTime();
                            var second = Math.ceil(60 - (nowTime - clickTime) / 1000);
                            if (second > 0) {
                                getCodeBtn.text(second + "s秒");
                            } else {
                                clearInterval(Timer);
                                getCodeBtn.removeClass('disabled').text('点击获取');
                            }
                        }, 1000);
                    },
                    error: function(data) {
                        $.alert(JSON.parse(data.responseText).error_message);
                    }
                });

            } else {
                $.alert('请输入正确的手机号');
            }
        }
    });

    // get voice code
    $(document).on('click', '#getVoiceCodeBtn', function(event) {
        var inputMobileVal = inputMobile.val();
        if (isPhone(inputMobileVal)) {
            $.ajax({
                url: '/api/v4/send_msg',
                type: 'POST',
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify({
                    account: inputMobileVal,
                    type: 5,
                    isvoice: 1,
                    code: imgCaptchaData
                }),
                success: function(data) {
                    $.alert('获取成功！请注意接听电话');
                },
                error: function(data) {
                    $.alert(JSON.parse(data.responseText).error_message);
                }
            });
        } else {
            $.alert('请输入正确的手机号');
        }
    });


    $('#resetPswMobile').on('input', 'input', function(e) {
        var inputMobileVal = $("#inputMobile").val(),
            inputCodeVal = $('#inputCode').val,
            inputPswVal = $('#inputPsw').val(),
            inputPswRepeatVal = $('#inputPswRepeat').val();
        if (isPhone(inputMobileVal) && isNotEmpty(inputCodeVal) && isNotEmpty(inputPswVal) && isNotEmpty(inputPswRepeatVal)) {
            resetPswBtn.removeClass('disabled');
        } else {
            resetPswBtn.addClass('disabled');
        }
    });



    // 密码混淆，依赖 jsencrypt.js，建议机密混淆此段代码    
    function getCookie(cookieName) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (cookieName === arr[0]) {
                return arr[1];
            }
        }
        return "";
    }

    // 发送并重置密码
    $(document).on('click', '#resetPswBtn', function(e) {
        if ($(this).hasClass('disabled')) {
            e.preventDefault();
        } else {
            var inputMobileVal = $('#inputMobile').val(),
                inputCodeVal = $('#inputCode').val(),
                inputPswVal = $('#inputPsw').val(),
                inputPswRepeatVal = $('#inputPswRepeat').val();
            if (inputPsw.val() !== inputPswRepeat.val()) {
                $.alert('两次密码必须一致');
            } else if (inputPswVal.length < 6 || inputPswRepeatVal.length < 6) {
                $.alert('密码太短了');
            } else {
                var rd = getCookie("rd");
                var pkey = $('#pubkey').val();
                var safe_password = inputPswRepeatVal + ";" + rd;
                var encrypter = new JSEncrypt;
                encrypter.setPublicKey(pkey);
                safe_password = encrypter.encrypt(safe_password); //得出最终需要给我的密码

                $.ajax({
                    url: postURL,
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify({
                        account: inputMobileVal,
                        password: safe_password,
                        keycode: parseInt(inputCodeVal),
                    }),
                    success: function(data) {
                        $.alert('新密码设置成功！');
                        window.location.assign('/user/find_password');
                    },
                    error: function(data) {
                        $.alert(JSON.parse(data.responseText).error_message);
                    }
                });
            }
        }
    });


    // 监听邮箱输入框状态
    $(document).on("pageInit", "#resetPswMail", function(e, id, page) {
        $(page).on('input', '#inputEmail', function() {
            if (isEmail($(this).val())) {
                sendEmailBtn.removeClass('disabled');
            } else {
                sendEmailBtn.addClass('disabled');
            }
        });
    });


    // 发送邮件验证
    $(document).on("pageInit", "#resetPswMail", function(e, id, page) {
        $(page).on('click', '#sendEmailBtn', function() {
            if ($(this).hasClass('disabled')) {
                console.log('没输入邮箱');
                event.preventDefault();
            } else {
                $.showPreloader('发送中…');
                $.ajax({
                    type: 'POST',
                    url: postURL,
                    data: JSON.stringify({
                        account: inputEmail.val()
                    }),
                    success: function(data) {
                        $.hidePreloader();
                        $.alert('邮件验证发送成功');
                    },
                    error: function(data) {
                        $.hidePreloader();
                        $.alert(JSON.parse(data.responseText).error_message);
                    }
                });
            }
        });
    });


    $.init();
});
