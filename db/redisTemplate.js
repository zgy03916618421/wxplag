/**
 * Created by Administrator on 2016/10/12.
 */
exports.get = function (key) {
    return new Promise(function (resolve,reject) {
        redis.get(key,function (err,value) {
            if (err) reject(err);
            else resolve(value);
        })
    })
}
exports.set = function (key,value) {
    return new Promise(function (resolve,reject) {
        redis.set(key,value,function (err,result) {
            if (err) reject(err);
            else resolve(result);
        })
    })
}
exports.expire = function (key,time) {
    return new Promise(function (resolve,reject) {
        redis.expire(key,time,function (err,result) {
            if(err) reject(err);
            else resolve(result);
        })
    })
}