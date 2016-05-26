var G = require('../dict/dict');

var id_base = {},
    ccTid


exports.preClearContextCache = function(){
    function _setClear(){
        ccTid = setTimeout(function(){
            G.context.clear();
            ccTid = undefined;
        }, 7000);
    }
    //鱼忘七秒，人忘七年
    ccTid ? (clearTimeout(ccTid), _setClear()) : _setClear();
}