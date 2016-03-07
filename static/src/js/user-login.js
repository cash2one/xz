(function() {

    var register_URL = '/api/v4/account/register', // 注册接口
        login_URL = '/api/v4/account/login', // 登录接口
        send_msg_URL = '/api/v4/send_msg', // 发送激活码接口
        check_account_URL = '/api/v4/account/check_account', // 验证账户是否拥有密码接口
        set_password_URL = '/api/v4/account/set_password', // 设定密码接口
        bind_account_URL = '/api/v4/account/bind_account', // 绑定帐号接口
        find_password_URL = '/user/find_password'; // 找回密码接口


    // 在设置密码页面，假如URL含有 '?account' 参数（帐号），就把它放入账号框
    var locationSearchStr = window.location.search;
    if (locationSearchStr.indexOf('?account')) {
        $('#setPswAccounts').val(locationSearchStr.slice(9));
    }


    /// cookie 里有特定字符串(dandan)时才加载
    if (document.cookie.indexOf('dandan') !== -1) {

        var getSecretCookie = function(e) {
            // cookie解码
            var secretStr;

            // 获得整个 cookie 字符串
            var strCookie = document.cookie;

            // 将 cookie 字符串切割为多个键/值对
            var arrCookie = strCookie.split("; ");
            var l = arrCookie.length;

            //遍历 cookie 数组，处理每个 cookie 对
            for (var i = 0; i < l; i++) {
                var arr = arrCookie[i].split("=");
                if (e === arr[0]) {
                    secretStr = arr[1];
                    break;
                }
            }

            // 补齐为 base64（长度为4倍数，否则加'='）
            var secretStrLen = secretStr.length;

            if (secretStrLen % 4 !== 0) {
                for (var j = 0; j < (4 - secretStrLen % 4); j++) {
                    secretStr += '=';
                }
            }

            // base64decode 需要引入 base64 编解码函数
            secretStr = base64decode(secretStr);

            secretStr = secretStr.split(":");

            if (secretStr[1] === '1') {
                $('#goUserpageLink').hide();
            } else {
                $('#goUserpageLink').show().attr('href', '/im/' + secretStr[0]);
            }

            return secretStr[0];
        };

        getSecretCookie('dandan');
    }



    // 加密密码用的
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

    var rd = getCookie("rd"),
        pkey = $("#pubkey").val();


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
    $('#getCodeBtn').attr('disabled',true);

    $('#voteCaptchaInput').keyup(function(){
        if($('#voteCaptchaInput').val().length == 4){
             captcha();
        }else{
            $('#getCodeBtn').attr('disabled',true);
        };
    });
    
    function captcha(){
         imgCaptchaData =  $('#voteCaptchaInput').val();  
         setTimeout(function (){
            if($('#imgCaptcha').children('ul').length != 1){
                $('#getCodeBtn').attr('disabled',false);
            };
          }, 500);
    }
  
    // 获取验证码
    $('#getCodeBtn').on('click', function(e) {
        // 看看是否 disabled
        if ($(this).attr('disabled')) {
            e.preventDefault();
        } else {
            var signupAccountPhoneVal = $('#signupAccountPhone').val(), // 注册手机号输入框
                getCodeInput = $('#getCodeInput'), // 验证码输入框
                getCodeBtn = $('#getCodeBtn'), // 验证码获取按钮
                getCodeType = getCodeBtn.data('type'), //验证码获取类型从按钮里提取

                postData = {
                    account: signupAccountPhoneVal,
                    type: getCodeType,
                    isvoice: 0,
                    code: imgCaptchaData
                },
                postDataVoice = {
                    account: signupAccountPhoneVal,
                    type: getCodeType,
                    isvoice: 1,
                    code: imgCaptchaData
                };

            // 看看是否输入了正确的手机号
            if (signupAccountPhoneVal.length) {
                $(this).attr('disabled', 'disabled');
                $.ajax({
                        url: send_msg_URL,
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify(postData),
                    })
                    .done(function() {
                        getCodeInput.focus();
                        getCodeBtn.text('60秒');
                        var clickTime = new Date().getTime();
                        var Timer = setInterval(function() {
                            var nowTime = new Date().getTime();
                            var second = Math.ceil(60 - (nowTime - clickTime) / 1000);
                            if (second > 0) {
                                getCodeBtn.text(second + "秒");
                            } else {
                                clearInterval(Timer);
                                // 倒计时结束
                                getCodeBtn.removeAttr('disabled').text('短信获取');

                                $('.form-group-voice-getcode').show();
                                $('#signupVoiceGetCodeBtn').one('click', function(e) {
                                    e.preventDefault();
                                    $.ajax({
                                            url: send_msg_URL,
                                            type: 'POST',
                                            dataType: 'json',
                                            contentType: "application/json",
                                            data: JSON.stringify(postDataVoice),
                                        })
                                        .done(function() {
                                            showServerMsg('获取成功，请注意接听电话语音。','serve-msg-success');
                                            $('.form-group-voice-getcode').hide();
                                            console.log("success");
                                        })
                                        .fail(function(data) {
                                            showServerMsg(JSON.parse(data.responseText).error_message,'serve-msg-error');
                                            getCodeBtn.removeAttr('disabled').text('短信获取');
                                            alert('1');
                                        });

                                });
                            }
                        }, 1000);
                    })
                    .fail(function(data) {
                        showServerMsg(JSON.parse(data.responseText).error_message,'serve-msg-error');
                        getCodeBtn.removeAttr('disabled').text('短信获取');
                    });
            }

        }

}); 


    // 登录
    $('#loginForm').validator().on('submit', function(e) {

        if (e.isDefaultPrevented()) {
            console.log('没通过验证');
        } else {
            e.preventDefault();
            var user_account = $('#loginAccount').val();

            // 密码混淆，依赖 jsencrypt.js，建议机密混淆此段代码
            var safe_password = $("#loginPassword").val() + ";" + rd;
            var encrypter = new JSEncrypt;
            encrypter.setPublicKey(pkey);
            safe_password = encrypter.encrypt(safe_password); //得出最终需要给我的密码

            var loginDate = {
                'account': user_account,
                'password': safe_password,
                'source': 'web'
            };

            $.ajax({
                    url: login_URL,
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(loginDate)
                })
                .done(function(data) {
                    showServerMsg('登录成功！','serve-msg-success');
                    setTimeout(function() {window.location.assign('/im/' + data.data.enuid);}, 2000); // 2秒后跳转
                })
                .fail(function(data) {
                    showServerMsg(JSON.parse(data.responseText).error_message,'serve-msg-error');
                });
        }
    });






    // 手机号注册
    $('#signupForm').validator().on('submit', function(e) {

        if (e.isDefaultPrevented()) {

        } else {
            event.preventDefault();

            // 密码混淆，依赖 jsencrypt.js，建议机密混淆此段代码
            var safe_password = $("#signupPassword").val() + ";" + rd;
            var encrypter = new JSEncrypt;
            encrypter.setPublicKey(pkey);
            safe_password = encrypter.encrypt(safe_password); //得出最终需要给我的密码

            var signupAccountPhoneVal = $('#signupAccountPhone').val(), // 手机号
                getCodeInputVal = $('#getCodeInput').val(), // 验证码
                signupDate = {
                    'ltype': 0,
                    'phone': signupAccountPhoneVal,
                    'password': safe_password,
                    'keycode': parseInt(getCodeInputVal),
                    'source': 'web'
                };
            $.ajax({
                    url: register_URL,
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(signupDate),
                })
                .done(function(data) {
                    showServerMsg('注册成功！','serve-msg-success');
                    setTimeout(function() {window.location.assign('/im/' + data.data.enuid);}, 2000); // 2秒后跳转
                })
                .fail(function(data) {
                    showServerMsg(JSON.parse(data.responseText).error_message,'serve-msg-error');
                });

        }
    });



    // 邮箱注册
    $('#signupEmailForm').validator().on('submit', function(e) {

        if (e.isDefaultPrevented()) {

        } else {
            event.preventDefault();

            // 密码混淆，依赖 jsencrypt.js，建议机密混淆此段代码
            var safe_password = $("#signupEmailPassword").val() + ";" + rd;
            var encrypter = new JSEncrypt;
            encrypter.setPublicKey(pkey);
            safe_password = encrypter.encrypt(safe_password); //得出最终需要给我的密码

            var signupEmailAccountVal = $('#signupEmailAccount').val(), // 邮箱
                signupDate = {
                    'ltype': 1,
                    'email': signupEmailAccountVal,
                    'password': safe_password,
                    'source': 'web'
                };
            $.ajax({
                    url: register_URL,
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(signupDate),
                })
                .done(function(data) {
                    showServerMsg('注册成功！','serve-msg-success');
                    setTimeout(function() {window.location.assign('/im/' + data.data.enuid);}, 2000); // 2秒后跳转
                })
                .fail(function(data) {
                    showServerMsg(JSON.parse(data.responseText).error_message,'serve-msg-error');
                });
        }
    });



    // 点击设置密码
    $('#setPasswordForm').validator().on('submit', function(e) {
        var setPswPasswordInput = $('#setPswPasswordInput');
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
        } else {
            e.preventDefault();

            var safe_password = setPswPasswordInput.val() + ";" + rd;
            var encrypter = new JSEncrypt;
            encrypter.setPublicKey(pkey);
            safe_password = encrypter.encrypt(safe_password); //得出最终需要给我的密码

            data = {
                'password': safe_password
            };
            $.ajax({
                    url: set_password_URL,
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(data),
                })
                .done(function() {
                    showServerMsg('密码设置成功！','serve-msg-success');
                    setTimeout(function() {window.location.assign('/im/' + getSecretCookie('dandan'));}, 2000); // 2秒后跳转
                })
                .fail(function() {
                    console.log("error");
                });
        }
    });

    // 绑定帐号页面切换账号类型（手机/邮箱）
    $('#bindAccountForm').on('click', '#toggleAccountTypeBtn', function(event) {
        if ($(this).hasClass('bind-phone')) {
            $('.form-group-getcode').hide();
            $('.form-group-phone').hide();
            $('.form-group-email').show();
            $(this).text('使用手机号绑定').removeClass('bind-phone');
        } else {
            $('.form-group-getcode').show();
            $('.form-group-phone').show();
            $('.form-group-email').hide();
            $(this).text('使用邮箱绑定').addClass('bind-phone');
        }
    });

    // 绑定帐号
    $('#bindAccountForm').validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {} else {
            event.preventDefault();

            // 密码混淆，依赖 jsencrypt.js，建议机密混淆此段代码
            var safe_password = $("#signupPassword").val() + ";" + rd;
            var encrypter = new JSEncrypt;
            encrypter.setPublicKey(pkey);
            safe_password = encrypter.encrypt(safe_password); //得出最终需要给我的密码

            var signupAccountPhoneVal = $('#signupAccountPhone').val(), // 手机号
                signupAccountEmailVal = $('#signupAccountEmail').val(), // 邮箱
                getCodeInputVal = $('#getCodeInput').val(), // 验证码
                bindDate;
            if ($('#toggleAccountTypeBtn').hasClass('bind-phone')) { // 说明填的是手机号
                bindDate = {
                    'account': signupAccountPhoneVal,
                    'keycode': parseInt(getCodeInputVal),
                    'password': safe_password,
                    'source': 'web'
                };
            } else {
                bindDate = {
                    'account': signupAccountEmailVal,
                    'password': safe_password,
                    'source': 'web'
                };
            }
            $.ajax({
                    url: bind_account_URL,
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(bindDate),
                })
                .done(function(data) {
                    showServerMsg('绑定成功！','serve-msg-success');

                    setTimeout(function() {window.location.assign('/im/' + data.data.enuid);}, 2000); // 2秒后跳转
                })
                .fail(function(data) {
                    showServerMsg(JSON.parse(data.responseText).error_message,'serve-msg-error');
                    $('#getCodeBtn').removeAttr('disabled').text('短信获取');
                });
        }
    });






    var FindPasswordForm = $('#FindPasswordForm');
    // 切换找回密码的方式
    FindPasswordForm.on('click', '#fpEmailToggle', function() {
        if (FindPasswordForm.attr('data-ftype') === 'phone') {
            FindPasswordForm.attr('data-ftype', 'email');
            $('.form-show-phone').hide();
            $('.form-show-email').show();
            $(this).removeClass('fpemail-show').text('手机找回');
            $('button[type=submit]').text('发送邮件');
        } else {
            FindPasswordForm.attr('data-ftype', 'phone');
            $('.form-show-phone').show();
            $('.form-show-email').hide();
            $(this).addClass('fpemail-show').text('邮箱找回');
            $('button[type=submit]').text('设置新密码');
        }
    });

    // 找回密码
    FindPasswordForm.validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {} else {
            e.preventDefault();
            // 密码混淆，依赖 jsencrypt.js，建议机密混淆此段代码
            var safe_password = $("#fpPassword").val() + ";" + rd;
            var encrypter = new JSEncrypt;
            encrypter.setPublicKey(pkey);
            safe_password = encrypter.encrypt(safe_password); //得出最终需要给我的密码

            var fpInputPhoneVal = $('#signupAccountPhone').val(), // 手机号
                getCodeInputVal = $('#getCodeInput').val(), // 验证码
                fpInputEmailVal = $('#fpInputEmail').val(), // 邮箱
                successMessage = '',
                fpDate;

            if (FindPasswordForm.attr('data-ftype') === 'phone') {
                fpDate = {
                    account: fpInputPhoneVal,
                    password: safe_password,
                    keycode: parseInt(getCodeInputVal),
                };
                successMessage = '设置成功！请使用新密码登录';
            } else {
                fpDate = {
                    account: fpInputEmailVal
                };
                successMessage = '邮件发送成功！';
            }

            $.ajax({
                    url: find_password_URL,
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(fpDate),
                })
                .done(function(data) {
                    showServerMsg(successMessage,'serve-msg-success');
                    setTimeout(function() {window.location.assign('/user/login');}, 2000); // 2秒后跳转
                })
                .fail(function(data) {
                    showServerMsg(JSON.parse(data.responseText).error_message,'serve-msg-error');
                    $('#getCodeBtn').removeAttr('disabled').text('短信获取');
                });

        }
    });


})();
