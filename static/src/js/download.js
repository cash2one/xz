var qrDownload = document.querySelector(".qr-download"),
    btnAndroid = document.querySelector(".btn-android"),
    btnIos = document.querySelector(".btn-ios"),
    qrcodeImg = document.querySelector(".qrcode-img"),
    wxMark = document.querySelector("#wxMark"),
    downloadBtn = document.querySelector("#downloadBtn");


if (is_ios()) {
    downloadBtn.setAttribute('href', 'https://itunes.apple.com/cn/app/id779325629');
    if (downloadBtn.textContent !== undefined) {
        downloadBtn.textContent = '安装 iPhone 版';
    } else {
        downloadBtn.innerText = '安装 iPhone 版';
    }

} else {
    downloadBtn.setAttribute('href', 'http://cdn.imxingzhe.com/xingzhe.apk');

    if (downloadBtn.textContent !== undefined) {
        downloadBtn.textContent = '下载 Android 版';
    } else {
        downloadBtn.innerText = '下载 Android 版';
    }

    // 获取android app版本号
    var request = new XMLHttpRequest();
    request.open('GET', '/api/v3/get_android_version', true);

    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                var resp = this.responseText;
                document.querySelector("#versionTip").innerText = '当前版本：' + resp.versionName;
            } else {
                console.log('Error :(');
            }
        }
    };

    request.send();
    // request = null;
}




// 切换二维码
btnAndroid.addEventListener("mouseover", btnAndroidMouseover, false);
btnAndroid.addEventListener("mouseout", btnMouseout, false);

btnIos.addEventListener("mouseover", btnIosMouseover, false);
btnIos.addEventListener("mouseout", btnMouseout, false);

function btnAndroidMouseover() {
    qrDownload.style.display = 'block';
    qrcodeImg.setAttribute('style', 'background-image:url("http://cdn.bi-ci.com/dist_v2/image/download/qrcode-xingzhe-download-android.png")');
}

function btnIosMouseover() {
    qrDownload.style.display = 'block';
    qrcodeImg.setAttribute('style', 'background-image:url("http://cdn.bi-ci.com/dist_v2/image/download/qrcode-xingzhe-download-ios.png")');
}

function btnMouseout() {
    qrDownload.style.display = 'none';
    qrcodeImg.setAttribute('style', 'background-image:none');
}



// 微信打开肤层
wxMark.addEventListener('click', function() {
    this.style.display = 'none';
}, false);

downloadBtn.addEventListener('click', function() {
    if (is_weixin()) {
        wxMark.style.display = 'block';
        return false;
    }
}, false);