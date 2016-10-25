/**
 * Created by Administrator on 2016/9/20.
 */
var koa = require('koa');
var bodyParse = require('koa-bodyparser');
var cors = require('koa-cors');
var logger = require('koa-logger');
var serve = require('koa-static');
require('./middleware/connectMongo');
require('./middleware/wechatInit');
require('./middleware/connectRedis')
var router = require('./router/router');
var app = koa();
app.use(logger());
app.use(cors());
app.use(bodyParse());
app.use(serve(__dirname +'/static'));
app.use(router.routes()).use(router.allowedMethods());
app.listen(10006);
