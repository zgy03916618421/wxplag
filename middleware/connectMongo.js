/**
 * Created by Administrator on 2016/9/21.
 */
var config = require("../config/config");
var MongoClient = require('mongodb').MongoClient;
if(process.env.BS_ENV == 'dev'){
    var _auth = '';
}else{
    var _auth = config.mongo.user+':'+config.mongo.pass+'@';
}
var host = config.mongo.host + ':27017';
MongoClient.connect('mongodb://192.168.100.2:27017/plag',function (err,db) {
    if (err) {
        console.error("connect to mongo error");
        process.exit(1);
    } else {
        global.mongodb = db;
        console.log("connect to mongo success!");
    }
})