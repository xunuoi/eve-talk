/*
 * For Robot
 * @Author: Cloud Xu
 * xwlxyjk@gmail.com
 * 31th September 2014 
 */


var robotConf = require('./robot.config'),
    record = require('./record'),
    hooks = require('./hooks/hook'),
    stone = require('./stone.bro'),
    bg = require('../bgTrans');

//config set
var conf = {}, enableSocket = false;

var socket;

// remove a workflow
var Kill = function(tar){
    if(tar ==  undefined) {return false; }

    for(var attr in tar) {
        delete tar[attr];
    }
    //BaseParams.curParams.__proto__ = Object.prototype;
    if(tar.__proto__ != undefined){ tar.__proto__ = null; }
    else {tar = null;}

    return true;        
};

var robot = function(){
    var INFO = {name: 'Eve', age: 1};
    var _myConf = {
        'contextmenu': false
    };
    var _MenuConf = [
        {
            html: 'menu1',
            click: function (event) {
                alert('ddd');
            }
        }
    ];

    var _autoOperation = {
        'kiss': function(cmd){
            //CMD FUNCTION LIST ============================================
            //MUST BE PLAIN OBJECT
            var cmdFns = {
                hello: function(mes){
                    alert(mes);
                }
            };
            //END: CMD FUNCTION LIST ========================================
            exports.runCmdFn(cmd, cmdFns);
            exports.showResponse({
                placeholder: 'Task Finished.',
                response: 'Auto Tasks Succeed: '+cmd 
            });

            return true;
        },

        //
        'noop': stone.noop
    };    

    //Local Shared Vars =====================
    var $goinput = $('.x-rb-dialog-input');
    //Lazy Shared Vars
    var $ctn, $body, $dialog, $continput, $gobtn, $talkcont   

    record = record.init($goinput)
    //=============================================
    var exports = {};
    exports.dialog = function(){
        $goinput.click(function(event){
            stone.killEvent(event);
  
        }).keydown(function(event){
            // stone.killEvent(event);

            if(stone.inArray(event.keyCode, [13, 37, 39])){
                $('#content').attr('keyEventTimeStamp', event.timeStamp);
            }

            if(event.keyCode == 13){
                $('#x_rb_btngo').trigger('click');
                stone.killEvent(event);
            }else if(event.keyCode == 38){
                record.printPre();
            }else if(event.keyCode == 40){
                record.printNext();
            }else {
                //
            }

        });

        var exp1 = {};

    }();///exports.dialog
    exports.showResponse = function (dataObj) {
        $dialog.show();
        dataObj.placeholder = dataObj.placeholder || 'Chat with me';
       
        $continput.val('').attr('placeholder',dataObj.placeholder);
        $gobtn.find('.x-rb-goimg').attr('src', robotConf.getB64Img('arrow_0'));
        $talkcont.html(dataObj.response).slideDown();
    };

    exports.runCmdFn = function(cmd, cmdFnObj){
        var cmdArray = cmd.match(/\s\w*\([\w\S]*\)/g), cmdLen = cmdArray.length;

        cmdArray = stone.each(cmdArray, function(cmd){
            //'from(2011-01-01,2012-01-01)'.match(/\w+\(([\w\S]*)\)/);
            var argp = stone.trim(cmd).replace(/(\w+\()([\w\S]*)(\))/, '$1\'$2\'$3').replace(/([\w\S\s]+)(,)([\w\S\s]+)/, '$1\'$2\'$3');//.match(/\w+\(([\w\S]*)\)/)[1].split(',');
            try{
                eval('cmdFnObj.'+argp);
            }catch(er){
                console.log('ErroLog: '+er.mes);
            }

            return argp;
        });        
    };        
    exports.message = function (text, cb) {
        $.ajax({
            url: '/message',
            data: {
                'c': text
                // 'type': type
            },
            type:'GET',
            dataType: 'json',
            success: function(data){
                // console.log(data);
                cb ? cb(data) : '';
            },
            error: function(err){
                console.log(err);
                exports.showResponse({
                    response: 'Hi,a net error: '+err.status
                })
            }
        });

    };
    exports.autoOperate = function(task, cmd){
        var rsTask = _autoOperation[task];
        rsTask ? rsTask(cmd) : '';

        return true;             
    };

    exports.checkHooks = function(word){
        let len = hooks.list.length
        let rs = true

        for(let i=0;i<len;i++){
            let hookFn = hooks.list[i]

            if(hookFn(word, exports) !== false){

            }else {
                rs = false
                break;
            }
        }

        return rs
    }


    exports.read = function(word){
        /*if(word.match(/::/)){
            this.learn(word, function(res){
                //learn status
                exports.showResponse({
                    placeholder: res.message,
                    response: res.data
                });
            })
            
        }else */
        if(word.match(/^:@clear/)){
            // store.clear();
            localStorage.clear();
            location.reload();
            exports.showResponse({
                placeholder: 'Bye',
                response: 'See you.'
            });
        }else if(word.match(/^:/)){
            bg.play(word.slice(1));
        }else {
            if(!enableSocket){
                this.message(word, exports.onAnswer);
            }else {
                this.socketRequest(word);
            }
            // not used suocket
            
        }

    };
    exports.socketRequest = function(word){
        if(socket.connected){
            socket.emit('message', {message: word});
        }else {
            socket.connect();
            socket.emit('message', {message: word});
        }

    }   
    exports.onAnswer = function(res){
        // console.log(res);
        if(res.status == 1){
            var ans = res.data,
                ipt = 'Wow';
        }else if(res.status == 2){
            var ans = res.data,
                ipt = 'Sorry...';
        }else if(stone.ins(res.status, [3, 7, 101])){
            //101 学习成功
            var ans = res.data,
                ipt = res.message;
        }else{
            var ans = res.message,
                ipt = 'Execuse me';
        }
        //显示结果
        exports.showResponse({
            placeholder: ipt,
            response: ans
        }); 
    };

    exports.hide = function(){
        $('#x_robot_ctn').attr('x-robot-display', 'hide').fadeOut('slow');
        $.cookie('isrobotShow', 'false');
    };
    exports.show = function(){
        $('#x_robot_ctn').attr('x-robot-display', 'show').fadeIn();
        $.cookie('isrobotShow', 'true');
    };

    exports.action = function(){
        var _curAction = 'normal';

        var baseImgSrc = conf.imgBasePath || '/static/app/robot/img/';
        $body = $('#x_robot_body');
        $ctn = $('#x_robot_ctn');

        var Action = function(actionName, img, actAuto, injectFn){
            var $bdImg = $body.find('.x-rb-body-img');
            var actCounter = {};
            var _getCount = function(){
                return actCounter[this.actionName] || 0;
            };
            function actFn(){
                var imgSrc = baseImgSrc+img;
                _curAction = actionName;

                if(imgSrc != $bdImg.attr('src')){
                    $bdImg.attr('src', imgSrc);
                }

                typeof injectFn == 'function' ? injectFn(actFn) : '';
                actCounter[actionName] ? actCounter[actionName]++ : actCounter[actionName] = 1 ;
                if(actCounter[actionName] > 5000){
                    actCounter[actionName] = 1;
                }
            };

            actFn.actionName = actionName;
            actFn.count = _getCount;

            typeof actAuto == 'function' ? actAuto(actFn) : '';

            //end---------------------------
            return actFn;
        };

        var exp1 = {};

        exp1.sleep = new Action('sleep', 'ani_sleep.gif', function(rsSelf){
            var t_0 = stone.now();     
            var pos_0 = stone.mousePos();
            var pos_now = stone.mousePos();

            stone.bind(document, 'mousemove', function(event){
                if(_curAction == 'sleep'){
                    //wake up;
                    exp1.normal();//should wake
                }
            });

            stone.repeatTimer(function(){
                pos_now = stone.mousePos();
                if(pos_now.x0 == pos_0.x0 && pos_now.y0 == pos_0.y0){
                    rsSelf();
                }else {
                    exp1[_curAction];
                }
                //update position
                pos_0.x0 = pos_now.x0;
                pos_0.y0 = pos_now.y0;

            }, 5000);

        });
        //exp1.wake = new Action('wake', 'wake.gif')
        exp1.hello = new Action('hello', '2.png', function(){
            $body.mouseover(function(event){
                exports.action.hello();
            });                
        });
        exp1.normal = new Action('normal', '0.png', function(){
            $body.mouseout(function(event){
                exports.action.normal();
            });                 
        });

        return exp1;
    }();

    exports.ui = function(){
        var exp1 = {};
        exp1.savePos = function(){
            var posX = $('#x_robot_ctn').css('left');
            var posY = $('#x_robot_ctn').css('top');
            localStorage.robotPosX = posX;
            localStorage.robotPosY = posY;
        };
        exp1.readPos = function(){
            if(localStorage.robotPosX){
                $('#x_robot_ctn').css({'left': localStorage.robotPosX, 'top': localStorage.robotPosY});
            }
        };

        exp1.hideMenu = function($ctn ,$body, $dialog){
            if($ctn.attr('x-moveing') != 'true'){
                //stone.killEvent(event);
                $talkcont.slideUp();
                $dialog.stop().fadeOut();
            }
        };
        exp1.showMenu = function($ctn ,$body, $dialog){
            if($ctn.attr('x-moveing') != 'true'){
                //stone.killEvent(event);//prevent trigger document.click --> hidemenu
                $dialog.stop().fadeIn('fast');
                $continput.select();
            }                
        };

        exp1.init = function(){

            $ctn = $('#x_robot_ctn').attr('x-robot-inited', 'true');
            $body = $('#x_robot_body');
            $dialog = $('#x_robot_dialog');
            $continput = $('.x-rb-dialog-input');
            $gobtn = $('#x_rb_btngo');
            $talkcont = $('.x_rbchatcont');

            $ctn.fadeIn('slow').attr('x-robot-display', 'show')
            .bind('click', function (event) {
                var $target = $(stone.getTarget(event));
                $target.hasClass('x-rb-body-img') ? ($dialog.is(':hidden') ? exp1.showMenu($ctn ,$body, $dialog) : exp1.hideMenu($ctn ,$body, $dialog) ) : '';                  
                //stone.killEvent(event);
            })[0]
            .oncontextmenu = function (event){//define contextmenu
                if(!_myConf.contextmenu){
                    var event = stone.getEvent(event);
                    //return false;
                }
            };

            $(document).click(function(event){
                var $target = $(stone.getTarget(event));
                if( !$.contains($ctn.get(0), $target.get(0)) ){
                    exp1.hideMenu($ctn ,$body, $dialog);
                }
                //exp1.hideMenu($ctn ,$body, $dialog);
            }); 

            var fnOnMove = function(event){
                $ctn.attr('x-moveing') != 'true' ? $ctn.attr('x-moveing', 'true') : '';
            };

            exp1.readPos();
            stone.drag({
                target: $ctn.get(0),
                fn: {
                    onup: function(event){
                        exp1.savePos();
                        stone.delay(function(){ $ctn.attr('x-moveing', 'false')}, 500 );
                    },
                    onmove: fnOnMove
                }                        
            });
            //remove drag effects ,stop event spread to $ctn;
            $dialog.click(function(event){/*stone.killEvent(event);*/})
            .mousemove(function(event){stone.killEvent(event);});

            $gobtn.click(function(event){
                var word = $goinput.val();
                $gobtn.find('.x-rb-goimg').attr('src', robotConf.getB64Img('loading_0'));                        
                
                record.save(word);

                if(exports.checkHooks(word) !== false){
                    exports.read(word);
                }
            });
            /*$(window).resize(function(){

                $ctn.css({'left': '60px', 'bottom': '60px'});                        
            });*/

        };

        return exp1;
    }();
    exports.auto = function(){
        if(stone.ins( $.cookie('isrobotShow'),['true', null]) ){
            robot.ui.init();
            robot.show();
        } 
        return this;           
    };
    exports.init = function(){
        var $rbctn = $('#x_robot_ctn');

        if($rbctn.attr('x-robot-inited') == 'true'){
            if($rbctn.attr('x-robot-display') == 'hide'){
                exports.show();
            }else {
                exports.hide();
            }
        }else {

            this.ui.init();
            exports.show();
        }

        return this;
    };

    return exports;
}();

var Work = function(workName, autoFn){
    var messer = new Messenger(workName);
    var exp1 = {};
    exp1.getMes = messer.getMes;
    exp1.destroy = function(){
        Kill(exp1);
        return delete exports[workName];
    };

    exp1.auto = autoFn || stone.noop;
    //END: exp1
    return exp1;   
};

var Messenger = function(forWho){
    var attr = {};
    attr.forWho = forWho;
    attr.getMes = function(hash){
        var forWho = forWho;
        var rs = robotConf.getrobotData('mes', attr.forWho, hash);
        return rs;
    };

    return attr;
};
//WORKFLOW LIST
var _WorkFlow = {

    'robot': function(){
        robot.auto();
    },
    'parallax':function(){
        var scene = document.getElementById('bg_scene');
        var parallax = new Parallax(scene);
        // parallax.enable();
        // parallax.disable();
        // parallax.updateLayers(); // Useful for reparsing the layers in your scene if you change their data-depth value
        
        parallax.calibrate(false, true);
        parallax.invert(false, true);
        parallax.limit(false, false);
        parallax.scalar(2, 8);
        parallax.friction(0.2, 0.8);
        parallax.origin(0.0, 1.0);
    },
    'bgTrans': function(){
        bg.init();
        $('.introduce-wrapper').removeClass('hide');
    },
    'install': function(){
        localStorage['installed'] = true;
    },
    'sayHello': function(){
        var isInstalled = localStorage['installed'];

        var timeN = stone.getUpper(stone.getTimeName());
        if(location.href.search('a=') != -1){
            //播放url参数中的信息
        }else if(isInstalled){
            bg.play('Good|'+timeN+'|');
        }else {
            bg.play('Good|'+timeN+'|I|Am|Eve|#rectangle|#countdown 3');
        }
    },
    'clearTag': function(){
        $('body > script').remove();
    },
    'initSocket': function(){
        var url = 'ws://localhost:3000';

        if(location.href.search('cloud.vzhen.com') != -1){
            url = 'ws://cloud.vzhen.com';
        }
        
        socket = io.connect(url);
        enableSocket = true;
        // window.skt = socket;
        socket.on('connect', function(){
            console.log('*** Socket Connect Succeed ! ***');
            // window.skt = socket;
            // alert('connected');

            socket.on('event', function(data){});
            socket.on('error', function(err){
                console.error(err);
                socket.connect();
            }); 
            socket.on('disconnect', function(){
                console.warn('Socket Disconnected!')
            });
            // socket.emit('message', { from: 'client' });
            socket.on('response', robot.onAnswer);

        });
    }

};
//WORK MEMBERS 
//EXPORTED API ----------------------------------------------
//Manage WorkFlow
exports.workFlow = function(){
    var exp1 = new Work('workFlow');
    exp1.clear = function(){
        _WorkFlow = {};
    };
    exp1.add = function(wfName, wf, fn){
        _WorkFlow[wfName] = wf;
        fn ? fn() : '';//callback fn,can be mtrobot.auto(wfName);
    };
    exp1.remove = function(wfName){
        delete _WorkFlow[wfName];
    };

    //end exp1
    return exp1;
}();
//****** exported to global;
exports.Eve = robot;

exports.auto = function(wlist){
    var self = this;
    var l = wlist.length;
    for(var i=0;i<l;i++){
        var n = wlist[i];
        _WorkFlow[n]();
        // try{
        //     _WorkFlow[n]();
        // }catch(err){
        //     console.log(err);
        // }
    }

}


//init ==========================
exports.init = function(conf_){
    conf = conf_
    //init default workFlow
    exports.auto([
        'robot', 
        // 'parallax', 
        // 'bgTrans',
        // 'sayHello',
        'install', 
        'clearTag'
        // 'initSocket'
    ]);

}; 
