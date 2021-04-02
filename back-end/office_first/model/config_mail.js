var nodemailer = require('nodemailer');

var config = {
    host: 'smtp.qq.com', //网易163邮箱 smtp.163.com
    port: 465, //网易邮箱端口 25
    auth: {
        user: '2237503735@qq.com', //邮箱账号
        pass: 'mxfqfionncmbebge', //邮箱的授权码
    },
};

var transporter = nodemailer.createTransport(config);

function send(mail) {
    console.log(mail);
    transporter.sendMail(mail, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
        return 200;
    });
}

// function send(mail) {
//     transporter.sendMail(mail, function (error, info) {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('mail sent:', info.response);
//         return 200;
//     });
// }

// module.exports = app;
exports.send = send;

//   var mail = {
//     // 发件人
//     from: '邮件<2237503735@qq.com>',
//     // 主题
//     subject: '联系我们',
//     // 收件人
//     to: '[email protected]',
//     // 邮件内容，HTML格式
//     text: '测试', //文本格式，
//     html:'这是h5格式'
//   };
