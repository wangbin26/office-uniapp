var redis = require('redis');
var conf = {
    redis_port: 6379,
    redis_hostname: '101.132.125.151',
    options: {
        auth_pass: '123456',
    },
};

const _createClient = () => {
    // 如果使用
    // redis.createClient();
    // 表示默认配置 localhost:6379
    var client = redis.createClient(conf.redis_port, conf.redis_hostname);
    client.auth(123456);
    //记录redis错误
    client.on('error', function (err) {
        console.log('redis error: ' + err);
    });
    return client;
};
const redisClient = _createClient();

function setItem(key, value, exprires) {
    redisClient.set(key, value);
    //设置过期 单位：秒
    if (exprires) {
        redisClient.expire(key, exprires);
    }
}
async function getItem(key) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err);
            }
            resolve(val);
        });
    });
}

exports.init = function () {
    var configs = require('../config.json');

    var redis = require('redis'),
        redisClient = redis.createClient(configs.redis);

    redisClient.on('error', function (err) {
        console.log('Error ' + err);
    });

    return redisClient;
};

module.exports = {
    redisClient,
    setItem,
    getItem,
};
