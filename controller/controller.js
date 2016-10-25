/**
 * Created by Administrator on 2016/9/20.
 */
'use strict'
var parse = require('co-busboy');
var qiniuUtil = require('../service/qiniuUtil');
var md5 = require('MD5')
var util = require('../service/utilservice');
var infectservice = require('../service/infectedservice');
var redisTemplate = require('../db/redisTemplate');

exports.login = function *() {
    var userInfo = this.request.body;
    var userid = userInfo.openid;
    var has = yield mongodb.collection('user').findOne({'openid':userid});
    if(!has){
        userInfo.createtime = new Date();
        userInfo.balance = parseInt(yield redisTemplate.get("balance"));
        userInfo.income = 0;
        userInfo.viruscount = 0;
        mongodb.collection('user').insertOne(userInfo);
        this.body = {'head':{code: 200,msg:'new user create success'},'data':userInfo};
    }else{
        this.body = {'head':{code: 300,msg:'user has exist'},'data':has};
    }
}
exports.oauth = function *() {
    var code = this.query.code;
    var redircetUrl = this.query.state;
    redircetUrl = redircetUrl.split("/");
    console.log(redircetUrl);
    var _id = redircetUrl[5];
    var vid = redircetUrl[6];
    console.log(redircetUrl);
    var token = yield client.getAccessToken(code);
    var accessToken = token.data.access_token;
    var openid = token.data.openid;
    var userinfo = yield client.getUser(openid);
    var user = yield mongodb.collection('user').find({'openid':userinfo.openid}).toArray();
    if (!user.length){
        userinfo.createtime = Date.parse(new Date());
        userinfo.balance =  parseInt(yield redisTemplate.get("balance"));
        userinfo.income = 0;
        userinfo.viruscount = 0;
        mongodb.collection('user').insertOne(userinfo);
    }
    if(redircetUrl.length<6){
        this.response.redirect(redircetUrl[0]+'//'+redircetUrl[2]+'/'+redircetUrl[3]+'/'+redircetUrl[4]+'/'+'?userid='+userinfo.openid);
    }else{
        this.response.redirect(redircetUrl[0]+'//'+redircetUrl[2]+'/'+redircetUrl[3]+'/'+redircetUrl[4]+'/'+'?userid='+userinfo.openid+'&vid='+vid+'&_id='+_id);
    }

}
exports.upPic = function *() {
        try{
            var parts = parse(this,{limit:'5mb',autoFields: true});
            var part;
            while (part = yield parts){
                if (part != undefined){
                    var names = part.filename.split('.'),
                        ext = names[names.length-1];
                    var name = md5(new Date().valueOf()+Math.random())+'.'+ext;
                    var rs = yield qiniuUtil.pipe(name,part);
                    var url = qiniuUtil.qiniuhost + name;
                }
            }
            this.body = {"head":{code:200,msg:'success'},"data":url};
        }catch (err){
            console.log(err.stack);
            this.body = {'head':{code: 500,msg:err.stack}};
        }
}
exports.createVirus = function *() {
    var bodyparse = this.request.body;
    var virus = {};
    virus.userid = bodyparse.userid;
    virus.type = bodyparse.type;
    if (virus.type == 'img'){
        virus.url = bodyparse.url;
    }
    virus.content = bodyparse.content;
    virus.vid = md5(new Date().valueOf()+Math.random());
    virus.createtime = Date.parse(new Date());
    mongodb.collection('virus').insertOne(virus);
    var carryid = bodyparse.userid;
    mongodb.collection('user').updateOne({'openid':virus.userid},{$inc:{'viruscount':1}});
    var data = {};
    data.virus = virus;
    data.userinfo = yield mongodb.collection('user').findOne({'openid':virus.userid});
    mongodb.collection('infected').insertOne({
        "carryid":carryid,
        "vid":virus.vid,
        "infectid":carryid,
        'createtime':Date.parse(new Date())
    });
    this.body = {'head':{code: 300,msg:'success'},'data':data};
}
exports.fightVirus = function *() {
    var userid = this.params.userid;
    console.log(userid);
    var data = yield infectservice.getVirusV2(userid);
    this.body = data;
}
exports.favor = function *() {
    console.log(this.request.body);
    var userid = this.request.body.userid;
    var vid = this.request.body.vid;
    var speed = this.request.body.speed;
    yield infectservice.favor(userid,vid,speed);
    this.body = {'head':{code: 300,msg:'success'}};
}
exports.disfavor = function *() {
    var userid = this.request.body.userid;
    var vid = this.request.body.vid;
    yield infectservice.disfavor(userid,vid);
    this.body = {'head':{code: 300,msg:'success'}};
}
exports.speed = function *() {
    var vid = this.request.body.vid;
    var userid = this.request.body.userid
    var data = yield infectservice.speedV4(vid,userid);
    this.body = data;
}
exports.share = function*(){
    var userid = this.params.userid;
    console.log(userid);
    yield infectservice.share(userid);
    this.body = {'head':{code: 300,msg:'success'}};
}
exports.recharge = function *() {
    var money = this.request.body.money;
    var userid = this.request.body.userid;
    var data = yield infectservice.recharge(money,userid);
    this.body = {'head':{code: 200,msg:'success'},'data':{balance:data}};
}
exports.getUserInfo = function *() {
    var data = {}
    var userid = this.params.userid;
    var userinfo = yield  mongodb.collection('user').findOne({'openid':userid});
    var speedCount = yield mongodb.collection('order').aggregate([
        {$match:{"userid":userid,"speed":true}},
        {$group:{"_id":null,"count":{$sum:1}}}
    ]).toArray();
    if(!speedCount.length){
        data.speedCount = 0;
    }else{
        data.speedCount = speedCount[0].count;
    }
    data.userinfo = userinfo
    this.body = {'head':{code:200,msg:'success'},'data':data};
}
exports.path = function *() {
    var vid = this.params.vid;
    var userid = this.params.userid;
    console.log(vid);
    console.log(userid);
    var path = yield infectservice.path(vid,userid);
    this.body = {'path':path};
}
exports.tree = function *() {
    var vid = this.params.vid;
    console.log(vid);
    var data = yield infectservice.tree(vid);
    this.body = data;
}
exports.shareVirus = function *() {
    var vid = this.params.vid;
    var carryid = this.params.carryid;
    var userid = this.params.userid;
    var data = yield infectservice.getshareVirus(carryid,vid,userid);
    this.body = data;
}
exports.graph = function *() {
    var vid = this.params.vid;
    var data = yield infectservice.graph(vid);
    this.body = data;
}
exports.hotvirus = function *() {
    var data = yield infectservice.hotvirus();
    this.body=data;
}
exports.myViruslist = function *() {
    var userid = this.query.userid;
    var skip = parseInt(this.query.skip);
    var limit = parseInt(this.query.limit);
    var data = yield infectservice.myViruslist(userid,skip,limit);
    this.body = {'head':{code:200,msg:'success'},'data':data};
}
exports.mySpeedlist = function *() {
    var userid = this.query.userid;
    var skip = parseInt(this.query.skip);
    var limit = parseInt(this.query.limit);
    var data = yield infectservice.mySpeedlist(userid,skip,limit);
    this.body = {'head':{code:200,msg:'success'},'data':data};
}
exports.speedComment = function *() {
    var userid = this.request.userid;
    var vid = this.request.vid;
    var comment = this.request.comment;
    yield infectservice.speedComment(userid,vid,comment);
    this.body = {'head':{code:200,msg:'success'}};
}