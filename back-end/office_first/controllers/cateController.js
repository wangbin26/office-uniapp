var dbConfig = require('../model/config');

getCate = (req, res) => {
    var sql = 'select id,username from test';
    var sqlArr = [];
    var callBack = (err, data) => {
        if (err) {
            console.log('连接错了');
        } else {
            res.send({
                list: data,
            });
        }
    };

    dbConfig.sql_connect(sql, sqlArr, callBack);
};

getPostCate = (req, res) => {
    let { id } = req.query;
    var sql = `select * from test where id=?`;
    var sqlArr = [id];
    var callBack = (err, data) => {
        if (err) {
            console.log('连接出错');
        } else {
            res.send({
                list: data,
            });
        }
    };
    dbConfig.sql_connect(sql, sqlArr, callBack);
};

module.exports = {
    getCate,
    getPostCate,
};
