/**
 * Created by Administrator on 2016/9/20.
 */
var parse = require('co-busboy');
var router = require('koa-router')();
var C = require('../controller/controller');
var fs = require('fs');
router.post('/dev/suriv/login',C.login);
router.get('/dev/suriv/oauth',C.oauth);
router.post('/dev/suriv/uploadpic',C.upPic);
router.post('/dev/suriv/virus',C.createVirus);
router.get('/dev/suriv/virus/:userid',C.fightVirus);
router.put('/dev/suriv/favor',C.favor);
router.put('/dev/suriv/disfavor',C.disfavor);
router.post('/dev/suriv/speed',C.speed);
router.get('/dev/suriv/share/:userid',C.share);
router.post('/dev/suriv/recharge',C.recharge);
router.get('/dev/suriv/getuser/:userid',C.getUserInfo)
router.get('/dev/suriv/path/:userid/:vid',C.path);
router.get('/dev/suriv/tree/:vid',C.tree);
router.get('/dev/suriv/getshare/:carryid/:vid/:userid',C.shareVirus);
router.get('/dev/suriv/graph/:vid',C.graph);
router.get('/dev/suriv/hotvirus',C.hotvirus);
/*router.get('/virusdetail/:vid',C.v);*/
router.get('/dev/suriv/myviruslist',C.myViruslist);
router.get('/dev/suriv/myspeedlist',C.mySpeedlist);
router.post('/dev/suriv/speedcomment',C.speedComment);
router.get('/dev/suriv/virusdetail/:vid',C.getVirusById);
module.exports = router