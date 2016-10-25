/**
 * Created by Administrator on 2016/9/21.
 */
var underscore = require('underscore');
exports.sample = function (list,n) {
    return underscore.sample(list,n);
}
exports.range = function (n) {
    return underscore.range(n);
}