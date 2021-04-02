var express = require('express');
var router = express.Router();
const db_config = require('../model/config');
const config_redis = require('../model/config_redis');
const users = require('../controllers/userController');
// 实现与MySQL交互
var mysql = require('mysql');
// 使用连接池，提升性能
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('register', { title: 'register' });
});
router.post('/userRegister', function (req, res, next) {
    var user_mail = req.body.user_mail;
    var password = req.body.password;
    var code = req.body.code; //获取前台请求的参数
    redis_get_code = config_redis
        .getItem('mail_code')
        .then(data => {
            console.log(data, '打印redis验证码'); // This is a value
            if (data == null) {
                console.log('验证码失效打印');
                result = {
                    code: 300,
                    msg: '验证码已失效，请重新发送',
                };
                res.json(result);
            } else if (code != data) {
                result = {
                    code: 305,
                    msg: '验证码输入有误',
                };
                res.json(result);
            } else if (code == data) {
                users.phoneLoginBind(res, user_mail, password);
            }
        })
        .catch(e => console.log(e));
    // return;
});
module.exports = router;
