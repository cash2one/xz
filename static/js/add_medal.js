var inputFile = document.getElementById('inputFile'),
    headerImgThumb = document.getElementById('headerImgThumb');

// 显示上传图片的缩略图
function handleFiles(files) {
    for (var i = 0; i < files.length; i++) {
        var img = document.createElement("img");
        img.className = 'img-rounded';
        img.src = window.URL.createObjectURL(files[i]);
        img.height = 200;
        img.onload = function(e) {
            window.URL.revokeObjectURL(this.src);
        };
        headerImgThumb.appendChild(img);
    }
}
// 开始
window.addEventListener("load", function() {
    // sendData
    function sendData() {
        // HMLHttpRequest
        var XHR = new XMLHttpRequest();
        var FD = new FormData(form);
        var URL = "/add_medal/";
        var buttonSubmit = document.querySelector("#buttonSubmit");
        // 数据成功发送并返回后执行的操作
        XHR.addEventListener("load", function(event) {
            console.log(XHR.response); //返回json
            var jsonParseJson = JSON.parse(event.target.response); // 解析 json
            // 根据json返回值进行的操作（成功添加/添加失败）
            if (jsonParseJson.res == 1) {
                buttonSubmit.setAttribute("class", "btn btn-success");
                buttonSubmit.disabled = "disabled";
                buttonSubmit.innerHTML = '添加成功，正准备跳转';
                setTimeout(function() {
                    window.location.href = '/add_medal/';
                }, 2000);
            } else {
                console.log(jsonParseJson.error_msg);
                buttonSubmit.innerHTML = '<i class="glyphicon glyphicon-ok"></i> 确认添加';
                buttonSubmit.removeAttribute('disabled');
                alert('提交失败：' + jsonParseJson.error_msg);
            };
        });
        XHR.addEventListener("error", function(event) {
            alert('发生未知错误，请尝试重新提交');
        });
        XHR.open("POST", URL);
        XHR.send(FD);
    }
    var form = document.getElementById("myForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        buttonSubmit.innerHTML = '正在添加..';
        buttonSubmit.disabled = "disabled";
        sendData();
    });
});
