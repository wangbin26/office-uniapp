let config_mail = require('../model/config_mail');
let redis_config = require('../model/config_redis');

function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function romdon() {
    code = '';
    var codeLength = 6; //验证码的长度
    var random = new Array(
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'm',
        'l',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z'
    ); //随机数
    for (var i = 0; i < codeLength; i++) {
        //循环操作
        var index = Math.floor(Math.random() * 60); //取得随机数的索引（0~35）
        code += random[index]; //根据索引取得随机数加到code上
    }
    return code; //把code值赋给验证码
}

sendCode = (req, res) => {
    let phone = req.body.user_mail;
    // let code = rand(1000, 9999);
    let msg_code = romdon();
    res.send({
        code: msg_code,
        msg: '发送成功',
    });
    console.log(code);
};

sendMail = (req, res) => {
    let user_mail = req.body.user_mail;
    console.log(req.body);
    let msg_code = romdon();
    var mail = {
        // 发件人
        from: '邮件<2237503735@qq.com>',
        // 主题
        subject: '联系我们',
        // 收件人
        to: user_mail,
        // 邮件内容，HTML格式
        text: '你好请查收验证码', //文本格式，
        html: msg_code,
    };
    redis_config.setItem('mail_code', msg_code, 120);
    //调用自己邮箱的发送接口，这里为了开发只打印
    console.log(msg_code);
    // 发送邮件
    // config_mail.send(mail);
};

module.exports = {
    sendCode,
    sendMail,
};
