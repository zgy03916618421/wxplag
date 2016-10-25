/**
 * Created by Administrator on 2016/10/7.
 */
exports.path = function *(vid,userid) {
    while (1){
        var parentInfect = yield mongodb.collection('infected').findOne({'infectid':userid,'vid':vid});
        if(parentInfect.carryid == parentInfect[0].infectid){
            path.push(parentInfect.carryid);
            break;
        }
        path.push(parentInfect.carryid);
        userid = parentInfect.carryid;
    }
    return path
}