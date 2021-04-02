var express = require('express');
var router = express.Router();
const usercon = require('../controllers/userController');
const db_config = require('../model/config');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// 实现登陆功能
router.post('/login', async (req, res, next) => {
    // 1、获取表单信息
    let user_mail = req.body.user_mail;
    let password = req.body.password;
    // 2、依据手机号查询有没有该用户
    const sql = 'select * from users where user_name=? or user_mail=?';
    const sql_arr = [user_mail, user_mail];
    let res_sql = await db_config.sql_connect_async(sql, sql_arr);
    // 2.1 判断有么有该用户
    if (res_sql.length === 0) {
        // 2.2 没有该用户
        result = {
            code: 306,
            msg: '此用户不存在',
        };
        res.json(result);
    } else {
        // 2.3 有该用户，验证密码
        // 2.3.1 获取数据库中的密码
        let pwd = res_sql[0].password;
        // 2.3.2 比较 输入的 密码和数据库中的密码
        var flag = bcrypt.compareSync(password, pwd); // 前为输入，后为数据库
        if (flag) {
            // 2.3.3 密码正确,生成token
            let userid = res_sql[0].user_id;
            let user_mail = res_sql[0].user_mail;
            let token = jwt.sign({ userid, user_mail }, 'office', {
                expiresIn: 60 * 60 * 24, // 授权时效24小时
            });
            console.log(token, '打印生成的token');
            // console.log(req);
            res.send({
                code: '10010',
                message: '登陆成功',
                token: token,
                user: user_mail,
            });
        } else {
            // 2.3.4 密码错误
            res.send({
                code: '10100',
                message: '密码错误',
            });
        }
    }
});

router.post('/vacate', usercon.userVacate);

router.post('/eventlist', usercon.userGetlist);

router.post('/updateImg', usercon.updateImg);

router.post('/updateUsername', usercon.updateUsername);

router.post('/getuserinfo', usercon.getUserInfos);

router.post('/commission', usercon.userCommission);

router.post('/getmineinfo', usercon.mineinfo);

module.exports = router;
