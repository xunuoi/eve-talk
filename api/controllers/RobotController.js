/**
 * RobotController
 *
 * @description :: Server-side logic for managing robots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var path = require('path');
var spider = require('./robot/spider/spider')
var ut = require('./robot/core/util')
var eve = require('./robot/core/eve')

// init global obj and eve
eve.init()


export function message(req, res){
    var c = req.param('c');
        // type = req,param('type');
    var type = 'answer';
    if(c.match(/::/)){
        type = 'learn';
    }

    if(type == 'learn'){
        res.json(eve.learn(c)); 

    }else if(type == 'answer'){
        var rep = eve.answer(c);
        if(rep.status == 2){
            spider.search(c, function(rp){

                var rsAns = rp['s'][0];

                if(rp['s'][1]){
                    rsAns = rp['s'][1];
                }
                if(rsAns){
                    res.json(ut.ansFormat({
                        status: 3,
                        message: 'Got it',
                        data: 'I know this: '+rsAns,
                        emoji: 'lalala'
                    }));
                }else {
                    res.json(ut.ansFormat({
                        status: 2,
                        message: 'failed',
                        data: 'Sorry, I can\'t answer you. Can you <a class="f-blue" href="javascript:;">teach me</a> by the format of <i class="f-red">Q::A</i> ?',
                        emoji: 'shy'
                    }));
                }
            });
            
        }else {
            res.json(rep);
        }

    }else {
        res.json({
            'status': 300,
            'data': 'Unknow Request Type: '+type,
            'message': 'failed'
        });
    }
};



