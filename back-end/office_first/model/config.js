const mysql = require('mysql');

module.exports = {
    mysql: {
        host: '101.132.125.151',
        user: 'root',
        password: '123456',
        database: 'express',
        port: 3306,
    },

    sql_connect: function (sql, arr, callBack) {
        var pool = mysql.createPool(this.mysql);
        pool.getConnection((err, conn) => {
            if (err) return console.log(err + 'dbconfig连接函数出错');
            conn.query(sql, arr, callBack);
            conn.release();
        });
    },

    sql_connect_async: function (sysql, sql_arr) {
        return new Promise((resolve, reject) => {
            var pool = mysql.createPool(this.mysql);
            pool.getConnection((err, conn) => {
                if (err) return reject(err);
                else {
                    conn.query(sysql, sql_arr, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                    conn.release(); // 释放连接
                }
            });
        }).catch(err => {
            console.log(err + 'sql_connect_async函数出错');
        });
    },
};
