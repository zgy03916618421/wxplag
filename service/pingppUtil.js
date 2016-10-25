/**
 * Created by Administrator on 2016/10/24.
 */
var pingpp = require('pingpp')('sk_test_nzvPuDHizb1SWnD0eLfDmffL')
exports.chargeCreate = function *(opt) {
    return new Promise(function (resolve,reject) {
        pingpp.charges.create(opt,function (err,charge) {
            if(err) reject(err);
            else resolve(charge);
        })
    })
}