/**
 * Created by Administrator on 2016/9/22.
 */
var config = require('../config/config');
var OAuth = require('co-wechat-oauth');
global.client = new OAuth(config.weixin.appID,config.weixin.appsecret);