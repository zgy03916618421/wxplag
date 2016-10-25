/**
 * Created by Administrator on 2016/9/20.
 */
var config = require('../config/qiniuconfig');
var qiniu = require('node-qiniu');
exports.qiniuhost = 'http://' + config.domain + '/';
qiniu.config({
    access_key : config.access_key,
    secret_key : config.secret_key
});
var bucket = new qiniu.Bucket(config.default_space);
exports.putFile = function *(key,dir) {
    return new Promise(function (resolve,reject) {
        bucket.putFile(key,dir,function (err,reply) {
            if (err) reject(err);
            else resolve(reply);
        })
    })
}
exports.pipe = function *(key,readstream) {
    var putstream = bucket.createPutStream(key);
    return new Promise(function (resolve,reject) {
        readstream.pipe(putstream)
            .on('error',function (err) {
                reject(err);
            })
            .on('end',function (reply) {
                resolve(reply);
            })
        
    })
}
exports.getUrl = function *(key) {
    return new Promise(function (resolve,reject) {
       var pic = bucket.key(key);
       var url = pic.url();
        resolve(url);
    })
}