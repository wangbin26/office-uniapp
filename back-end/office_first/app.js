var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mailRouter = require('./routes/mail');
var registerRouter = require('./routes/register');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true })); // 允许post请求

// app.use(function (req, res, next) {
//   // 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验
//   if (req.url != '/user/login' && req.url != '/user/register') {
//       let token = req.headers.token;
//       let jwt = new JwtUtil(token);
//       let result = jwt.verifyToken();
//       // 如果考验通过就next，否则就返回登陆信息不正确
//       if (result == 'err') {
//           console.log(result);
//           res.send({status: 403, msg: '登录已过期,请重新登录'});
//           // res.render('login.html');
//       } else {
//           next();
//       }
//   } else {
//       next();
//   }
// });

// 引入token模块
var jwt = require('jsonwebtoken');
// 全局的路由匹配
app.use((req, res, next) => {
    // 排除登陆注册页面
    console.log(req.url)
    if (req.url !== '/users/login' && req.url !== '/register/userRegister' && req.url !== '/mail/sendMail') {
        // 不同形式获取token值
        let token =
            req.headers.token || req.query.token || req.body.token || req.headers.authorization;
        // 如果存在token ---- 验证
        if (token) {
            jwt.verify(token, 'office', function (err, decoded) {
                if (err) {
                    res.send({
                        code: '401',
                        msg: '登录失效，请重新登录',
                    });
                } else {
                    req.decoded = decoded;
                    console.log('验证成功', decoded);
                    next();
                }
            });
        } else {
            // 不存在 - 告诉用户---意味着未登录
            res.send({
                code: '10119',
                message: '没有找到token.',
            });
        }
    } else {
        next();
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mail', mailRouter);
app.use('/register', registerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;
