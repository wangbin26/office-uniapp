const db_config = require('../model/config');
const formattime = require('../model/format_time');
var express = require('express');
var json = require('../utils/returnjson');
var uuid = require('node-uuid');
// 密码加密模块
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10); // 加密级别

// 获取注册的用户详情
// function getUserInfo(id) {
//     const sql = 'select * from users where id';
//     const sql_arr = [id];
//     return db_config.sql_connect_async(sql, sql_arr);
// }

async function phoneLoginBind(res, user_mail, password) {
    const sql = 'select * from users where user_name=? or user_mail=?';
    const sql_arr = [user_mail, user_mail];
    let res_sql = await db_config.sql_connect_async(sql, sql_arr);
    if (res_sql.length) {
        // res_sql[0].userinfo = await getUserInfo(res_sql[0].id);
        // return res;
        result = {
            code: 300,
            msg: '该账号已存在',
        };
        // return result;
        res.json(result);
    } else {
        let result = await registerUser(res, user_mail, password);
        // res[0].userinfo = await getUserInfo(res[0].id);
        return result;
    }
}

async function registerUser(res, user_mail, password) {
    // let regUser = async()=>{
    let user_headportrait =
        'https://liyafei-wang.oss-cn-shanghai.aliyuncs.com/images/161676284995191.png';
    console.log(user_headportrait.length);
    // var $sql = 'select * from users where user_mail=?';
    // await connection.query($sql, [user_mail], function (err, result) {
    // var resultJson = result;
    // console.log(resultJson.length);
    create_time = formattime.formattime();
    let userid = 'users_' + uuid.v1();
    let username = '默认昵称'
    console.log(userid);
    // 2.2.2 对密码加密
    password = bcrypt.hashSync(password, salt);
    const sql =
        'insert into users(user_id, user_name, user_headportrait, user_mail, password, create_time, update_time) values(?, ?,?,?, ?, ?, ?)';
    const sql_arr = [userid, username, user_headportrait, user_mail, password, create_time, create_time];
    const res_sql = await db_config.sql_connect_async(sql, sql_arr);
    if (res_sql.affectedRows == 1) {
        result = {
            code: 200,
            msg: '注册成功',
        };
        res.json(result);
    } else {
        result = {
            code: 400,
            msg: '注册失败',
        };
        res.json(result);
    }

    // } else {
    //     //账号不存在，可以注册账号
    //     // 建立连接，向表中插入值  数据库表名为user-info会出错
    //     var $sql1 = 'INSERT INTO users(user_mail, password, user_headportrait) VALUES(?,?,?)';
    //     connection.query($sql1, [user_mail, password, user_headportrait], function (err, result) {
    //         console.log(result);
    //         if (result) {
    //             result = {
    //                 code: 200,
    //                 msg: '注册成功',
    //             };
    //         } else {
    //             result = {
    //                 code: 400,
    //                 msg: '注册失败',
    //             };
    //         }
    //         res.json(result); // 以json形式，把操作结果返回给前台页面
    //         connection.release(); // 释放连接
    //     });
    // }
}

async function getUserInfo(user_mail) {
    console.log(user_mail);
    const sql = 'select * from users where user_mail=?';
    const sql_arr = [user_mail];
    let res_sql = await db_config.sql_connect_async(sql, sql_arr);
    // console.log(res_sql);
    return res_sql;
}

userVacate = async (req, res) => {
    // console.log(req.body);
    let start_time = req.body.start_time;
    let end_time = req.body.end_time;
    let classify = req.body.vacation_data;
    let user_mail = req.body.user_mail;
    let title = '休假审批';
    let userinfo = await getUserInfo(user_mail);
    // console.log(userinfo);
    if (userinfo.length) {
        console.log(userinfo[0].user_id, '打印查询信息');
        let user_headportrait = userinfo[0].user_headportrait;
        let users_id = userinfo[0].user_id;
        let create_time = formattime.formattime();
        const sql =
            'insert into user_commissions(title,classify,user_headportrait, users_id, start_time, end_time, create_time, update_time) values(? ,? ,?, ?, ?, ?, ?, ?)';
        const sql_arr = [
            title,
            classify,
            user_headportrait,
            users_id,
            start_time,
            end_time,
            create_time,
            create_time,
        ];
        const res_sql = await db_config.sql_connect_async(sql, sql_arr);
        if (res_sql.affectedRows == 1) {
            result = {
                code: 200,
                msg: '提交成功',
            };
            res.json(result);
        } else {
            result = {
                code: 400,
                msg: '提交失败',
            };
            res.json(result);
        }
    } else {
        console.log('失败');
    }
};

userCommission = async (req, res) => {
    console.log(req.body);
    let classify = req.body.detail_text;
    let user_mail = req.body.user_mail;
    let title = req.body.commission_text;
    let userinfo = await getUserInfo(user_mail);
    // console.log(userinfo);
    if (userinfo.length) {
        console.log(userinfo[0].user_id, '打印查询信息');
        let user_headportrait = userinfo[0].user_headportrait;
        let users_id = userinfo[0].user_id;
        let create_time = formattime.formattime();
        let start_time = create_time
        const sql =
            'insert into user_commissions(title,classify,user_headportrait, users_id, start_time, create_time, update_time) values(? , ?, ?, ?, ?, ?, ?)';
        const sql_arr = [title, classify, user_headportrait, users_id, start_time, create_time, create_time];
        const res_sql = await db_config.sql_connect_async(sql, sql_arr);
        if (res_sql.affectedRows == 1) {
            result = {
                code: 200,
                msg: '提交成功',
            };
            res.json(result);
        } else {
            result = {
                code: 400,
                msg: '提交失败',
            };
            res.json(result);
        }
    } else {
        console.log('失败');
    }
};

userGetlist = async (req, res) => {
    let user_mail = req.body.user_mail;
    const sql =
        'select * from user_commissions where users_id = (select user_id from users where user_mail=?)';
    const sql_arr = [user_mail];
    res_sql = await db_config.sql_connect_async(sql, sql_arr);
    console.log(res_sql);
    res.send({
        msg: '获取数据成功',
        data: res_sql,
    });
};

updateImg = async (req, res) => {
    let user_mail = req.body.user_mail;
    let user_img = req.body.user_img;
    console.log(req.body);
    const sql = 'update users set user_headportrait=? where user_mail=?';
    const sql_arr = [user_img, user_mail];
    res_sql = await db_config.sql_connect_async(sql, sql_arr);
    console.log(res_sql);
    res.send({
        msg: '修改成功',
        data: res_sql,
    });
};

updateUsername = async (req, res) => {
    let user_mail = req.body.user_mail;
    let user_name = req.body.user_name;
    console.log(req.body);
    const sql = 'update users set user_name=? where user_mail=?';
    // console.log(user_name);
    const sql_arr = [user_name, user_mail];
    res_sql = await db_config.sql_connect_async(sql, sql_arr);
    // console.log(res_sql);
    if (res_sql.affectedRows == 1) {
        res.send({
            msg: '修改成功',
            data: res_sql,
        });
    }
};

getUserInfos = async (req, res) => {
    let user_mail = req.body.user_mail;
    const sql = 'select * from users where user_mail=?';
    const sql_arr = [user_mail];
    res_sql = await db_config.sql_connect_async(sql, sql_arr);
    console.log(res_sql);
    res.send({
        msg: '获取数据成功',
        data: res_sql,
    });
};

mineinfo = async (req, res) => {
    let user_mail = req.body.user_mail;
    let userinfo = await getUserInfo(user_mail);
    const sql = "select count(*) from user_commissions where users_id = (select user_id from users where user_mail=?);";
    const sql_arr = [user_mail];
    res_sql = await db_config.sql_connect_async(sql, sql_arr);
    userinfo[0].count = res_sql[0]['count(*)']
    res.send({
        msg: '获取数据成功',
        data: userinfo,
    });
};


module.exports = {
    phoneLoginBind,
    registerUser,
    userVacate,
    userGetlist,
    updateImg,
    getUserInfo,
    getUserInfos,
    updateUsername,
    userCommission,
    mineinfo
};