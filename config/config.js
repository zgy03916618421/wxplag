/**
 * Created by Administrator on 2016/9/22.
 */
var config = {
    mongo : {
        host: process.env.BS_MONGOHOST || '192.168.100.2',
        port: process.env.BS_MONGOPORT || '27017',
        db: process.env.BS_MONGODBNAME || 'plag',
        user : process.env.BS_MONGOUSER || 'rio',
        pass : process.env.BS_MONGOPASS || 'VFZPhT7y'
    },
    weixin : {
        appID : 'wx9a66afce31e4ec8b',
        appsecret : 'c2b679dbd1ea6c0ffc99155123a25697' 
    },
    redis : {
        host: process.env.BS_REDISHOST || '192.168.100.2',
        port : process.env.BS_REDISPORT || 6379
    }
}
module.exports = config;