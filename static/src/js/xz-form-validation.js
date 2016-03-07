// xz-form-validation.js


/**
 *
 * @descrition:判断输入的参数是否是个合格标准的邮箱,并不能判断是否有效，有效只能通过邮箱提供商确定。
 * @param:str ->待验证的参数。
 * @return -> true表示合格的邮箱。
 * 
 */
var isEmail = function(str) {
    /**
     * @descrition:邮箱规则
     * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
     * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
     * 3.@符号是必填项
     * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
     * 5.邮件提供商域可以包含特殊字符-、_、.
     */
    var pattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
    return pattern.test(str);
};



var isPhoneAndEmail = function(str) {
    var pattern = /(^1[0-9]{10}$)|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/;
    return pattern.test($.trim(value));
};



/**
 * @descrition:判断输入的参数是否是个合格的URL,由于url的灵活性和多样性，一下代码并不能测试所有的url都是合法的（PS：该正则无法通配所有的URL，请慎用）
 * @param:str->待判断的url参数
 * @return ：true表示符合改正则。
 **/
var isURL = function(str) {
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + //ftp的user@
        "(([0-9]{1,3}.){3}[0-9]{1,3}" + // IP形式的URL- 199.194.52.184
        "|" + // 允许IP和DOMAIN（域名）
        "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
        "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." + // 二级域名
        "[a-z]{2,6})" + // first level domain- .com or .museum
        "(:[0-9]{1,4})?" + // 端口- :80
        "((/?)|" + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);

    return re.test(str);
};


/**
 *
 * @description: 判断传入的参数的长度范围
 * @param: minL->给定的最小的长度
 * @param: maxL->给定的最大的长度
 * @param: str->待验证的参数
 * @return : true表示合理，验证通过
 * 
 */
var isMaxlength = function(maxL, str) {
    return (str.length <= maxL) ? true : false;
};
var isMinlength = function(minL, str) {
    return (str.length >= minL) ? true : false;
};





/**
 *
 * @description: 判断传入的参数的数值范围
 * @param: min->给定的最小值
 * @param: max->给定的最大值
 * @param: str->待验证的参数
 * @return : true表示合理，验证通过
 * 
 */
var isMax = function(max, str) {
    return (str <= max) ? true : false;
};
var isMin = function(min, str) {
    return (str >= min) ? true : false;
};



/**
 *
 * @Dependence : https://gist.github.com/hehongwei44/3e167cfcda47d4c8051a#file-extendstringprototype-js
 * @description : 判断输入的参数是否为空
 * @return : true表示为输入参数为空 
 * 
 */
var isEmpty = function(str) {
    //空引用  空字符串  空输入
    return str === null || typeof str === "undefined" || str.trim() === "" ? true : false;
};





/**
 *
 * @descrition : 该函数的功能是判断转入的参数是否为数字类型。
 * @param->o   : 传入的参数，参数可以为任何类型。
 * @return:   true表示为数字，false为非数字
 * 
 */
var isNumber = function(o) {
    return !isNaN(o);
};






/**
 *
 * @descrition:判断输入的参数是否是正整数
 * @param: str为待验证的参数
 * @return: true表示为合法的参数
 * 
 */
var isPositiveInt = function(str) {
    var pattern = /^\d+$/;
    return pattern.test(str);
};

/**
 *
 * @descrition:判断输入的参数是否是路书编号
 * @param: str为待验证的路书编号
 * @return: true表示为合法的路书编号
 * 
 */
var isLushu = function(str) {
    //路书编号以0-9开头的6为数字
    var pattern = /^[0-9]\d{5}$/;
    return pattern.test(str);
};



/**
 *
 * @descrition:判断输入的参数是否是个合格的手机号码，不能判断号码的有效性，有效性可以通过运营商确定。
 * @param:str ->待判断的手机号码
 * @return: true表示合格输入参数
 * 
 */
var isCellphone = function(str) {
    /**
     *@descrition:手机号码段规则
     * 13段：130、131、132、133、134、135、136、137、138、139
     * 14段：145、147
     * 15段：150、151、152、153、155、156、157、158、159
     * 17段：170、176、177、178
     * 18段：180、181、182、183、184、185、186、187、188、189
     * 
     */
    var pattern = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/;
    return pattern.test(str);
};


/**
 * @descrition:判断输入的参数是否是个合格的固定电话号码。
 * @param:str->待验证的固定电话号码。
 * @return : true表示验证合格。
 * 
 **/
var isfixedphone = function(str) {
    /**
     *
     * @desctition:规则->区号3-4位，号码7-8位,可以有分机号，分机号为3-4为，格式如下："0775-85333333-123"
     * 
     */
    var pattern = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
    return pattern.test(str);
};
