$(function() {

    // 添加地址
    $('#addLocaBtn').click(function(event) {
        var suggestIdVal = $('#suggestId').val();
        $('#activityAddress').val(suggestIdVal);
    });

    // 添加开始结束时间戳
    $("#activityStartTime").change(function(event) {
        var v = $(this).val();
        $("input[name=activityStartTime]").val(toUnixTimestamp(v));
    });

    $("#activityEndTime").change(function(event) {
        var v = $(this).val();
        $("input[name=activityEndTime]").val(toUnixTimestamp(v));
    });





    // 创建
    $('#activityAddForm').on('submit', function(e) {
        e.preventDefault();

        var submitBtn = $("#submitBtn");

        submitBtn.addClass('disabled').attr('disabled', 'disabled').text('发布中…');


        var images = $('#log img');
        var imagesStr = '';

        for (i = 0; i < images.length; i++) {
            imagesStr += images[i].src.replace("!coupon1", ";");
        }
        // console.log('img length: ' + images.length);
        // console.log('imagesStr: ' + imagesStr);
        var imagesStrVal = imagesStr.substring(0, imagesStr.length - 1); // 去掉最后一个;号

        var myJsonData = {
            activityTitle: $("#activityTitle").val(),
            activityContent: $('#activityContent').val(),
            activityCoverPic: imagesStrVal,
            activityLushuId: parseInt($('input[name="activityLushuId"]').val()),
            activityMiles: parseInt($('input[name="activityMiles"]').val() * 1000),
            activityType: $('input[name=activityType]:checked').val(),
            activityStartTime: parseInt($('input[name="activityStartTime"]').val()),
            activityEndTime: parseInt($('input[name="activityEndTime"]').val()),
            activityCost: parseInt($('input[name="activityCost"]').val()),
            activityUserMaxCount: parseInt($('input[name="activityUserMaxCount"]').val()),
            activityContactMobile: parseInt($('input[name="activityContactMobile"]').val()),
            activityCity: parseInt($('input[name="activityCity"]').val()),
            activityLat: parseFloat($('input[name="activityLat"]').val()),
            activityLon: parseFloat($('input[name="activityLon"]').val()),
            activityAddress: $('input[name="activityAddress"]').val()
        };

        console.log(myJsonData);

        var apiURL = '/api/v4/create_new_activity';

        $.ajax({
                url: apiURL,
                type: 'POST',
                data: JSON.stringify(myJsonData),
                contentType: 'application/json'
            })
            .done(function(data) {
                console.log(data);
                console.log("success!");
                submitBtn.addClass('btn-success').text('发布成功');

                function showTime(count) {
                    submitBtn.text('发布成功 ' + count);
                    if (count === 0) {
                        window.location.assign('/activities/');
                    } else {
                        count -= 1;
                        setTimeout(function() {
                            showTime(count);
                        }, 1000);
                    }
                }
                showTime(3);

            })
            .fail(function(data, textStatus, request) {
                // submitBtn.addClass('btn-danger').text('发布失败，请检查后重试');

                function showTime(count) {
                    if (count === 0) {
                        submitBtn.removeClass('disabled btn-danger').removeAttr('disabled').text('发布');
                    } else {
                        count -= 1;
                        setTimeout(function() {
                            showTime(count);
                        }, 1000);
                    }
                }
                showTime(3);

                for(var j in JSON.parse(data.responseText)) {
                }
                submitBtn.addClass('btn-danger').text(JSON.parse(data.responseText).error_message);

            })
            .always(function(xhr, data) {
                console.log("complete");
            });
    });


    // 修改
    $('#activityEditForm').on('submit', function(e) {
        e.preventDefault();

        var submitBtn = $("#submitBtn"),
            apiURL = '/api/v4/edit_activity';

        submitBtn.addClass('disabled').attr('disabled', 'disabled').text('保存中…');

        var images = $('#log img');
        var imagesStr = '';

        for (i = 0; i < images.length; i++) {
            imagesStr += images[i].src.replace("!coupon1", ";");
        }
        console.log('img length: ' + images.length);
        console.log('imagesStr: ' + imagesStr);

        var imagesStrVal = imagesStr.substring(0, imagesStr.length - 1); // 去掉最后一个;号            

        var myJsonData = {
            activityId: parseInt($("#activityId").val()),
            activityTitle: $("#activityTitle").val(),
            activityContent: $('#activityContent').val(),
            activityCoverPic: imagesStrVal,
            activityLushuId: parseInt($('input[name="activityLushuId"]').val()),
            activityMiles: parseInt($('input[name="activityMiles"]').val() * 1000),
            activityType: parseInt($('input[name=activityType]:checked').val()),
            activityStartTime: parseInt($('input[name="activityStartTime"]').val()),
            activityEndTime: parseInt($('input[name="activityEndTime"]').val()),
            activityCost: parseInt($('input[name="activityCost"]').val()),
            activityUserMaxCount: parseInt($('input[name="activityUserMaxCount"]').val()),
            activityContactMobile: parseInt($('input[name="activityContactMobile"]').val()),
            activityCity: parseInt($('input[name="activityCity"]').val()),
            activityLat: parseFloat($('input[name="activityLat"]').val()),
            activityLon: parseFloat($('input[name="activityLon"]').val()),
            activityAddress: $('input[name="activityAddress"]').val()
        };
        console.log(myJsonData);

        $.ajax({
                url: apiURL,
                type: 'POST',
                data: JSON.stringify(myJsonData),
                contentType: 'application/json'
            })
            .done(function(data) {
                submitBtn.addClass('btn-success').text('修改成功');

                function showTime(count) {
                    submitBtn.text('修改成功 ' + count);
                    if (count === 0) {
                        window.location.assign('/activities/');
                    } else {
                        count -= 1;
                        setTimeout(function() {
                            showTime(count);
                        }, 1000);
                    }
                }
                showTime(3);

            })
            .fail(function(data, textStatus, request) {
                // submitBtn.addClass('btn-danger').text('修改失败，请检查后重试');

                function showTime(count) {
                    if (count === 0) {
                        submitBtn.removeClass('disabled btn-danger').removeAttr('disabled').text('保存修改');
                    } else {
                        count -= 1;
                        setTimeout(function() {
                            showTime(count);
                        }, 1000);
                    }
                }
                showTime(3);
                for(var j in JSON.parse(data.responseText)) {
                }
                submitBtn.addClass('btn-danger').text(JSON.parse(data.responseText).error_message);
            })
            .always(function(xhr, data) {
                console.log("complete");
            });
    });


});
