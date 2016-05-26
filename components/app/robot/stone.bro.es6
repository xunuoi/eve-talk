// for robot util

var _handleHash = {},
	_handlerIndex = 0,
	_guidBase = {},
	_autoIncrement = {};

module.exports =  {
	
	noop: function(){},
	_version: '1.4',
	typeCheckOff: function(){
		this.typeCheck = function(){
			return exports;
		};
	},
			
	/* EventUtil Tools ============================================== */
	bind: function(element, type, handler, scope){

			if(!element){ return false; }//object not exists

			var scope = scope || null;
		    if( scope && (!(scope instanceof Object)) ) throw new Error('Invalid scope!');
		    if(scope)  {handler = handler.bind(scope);} //返回一个绑定了作用域的新的函数
			if (element.addEventListener){
				element.addEventListener(type, handler, false) ;
			} else if (element.attachEvent){
				element.attachEvent('on' + type, handler);
			}else {
				element['on' + type] = handler ;
			}
			_handleHash[++ _handlerIndex] = {"handler": handler};

			return _handlerIndex;//用于保存对匿名函数的引用索引
	},
	unbind: function(element, type, handler,handlerIndex){
		    if(handlerIndex) { handler = _handleHash[handlerIndex].handler; }
			if(element.removeEventListener){
		        element.removeEventListener(type, handler, false) ;
			} else if (element.detachEventListener){
			    element.detachEventListener('on' + type, handler);
			} else {
				element['on' + type] = null;//解除所有事件绑定，这样处理有问题
			}
	},
	getEvent: function(event){
		return event ? event : window.event; // or default e
	},
	getTarget: function(event) {//currentTarget是处理事件的调用者，如果document.body.onclick = function(event){}中event.currentTarget ===this===document.body  target是目标
		return event.target || event.srcElement;
	},
	getScriptNode: function(){	 	
			var s = document.getElementsByTagName('script');	 	
			return s;	 	
	},
	preventDefault: function(event){
		if (event.preventDefault != undefined) {event.preventDefault();}
		else {event.returnValue = false;}//for IE
	},
	stopPropagation: function(event){
		if(event.stopPropagation != undefined) {event.stopPropagation();}
		else {	event.cancelBubble = true;} 
	},	
	killEvent: function(event){
		if(typeof event == 'object' && this.getTarget(event) != undefined){
			this.stopPropagation(event);
			this.preventDefault(event);
		}else {
			return false;
		}
	},

	mousePos: function(){
		var x0,y0;
		var self = this;
		var posObj = {
			x0: 0,
			y0: 0
		};

		var _initPos = function(){
			self.bind(document, 'mousemove', function(event){
				var event = self.getEvent(event);

				if(event.pageX || event.pageY){ 
					posObj = {
						x0:event.pageX, 
						y0:event.pageY
					};
				}else{						
					posObj = {
						x0: event.clientX + document.body.scrollLeft - document.body.clientLeft,
				    	y0: event.clientY + document.body.scrollTop - document.body.clientTop
				    };
				}

			    self.mousePos = _getPos;
			});///self.bindd	
		}();

		var _getPos = function(){
			return posObj;
		};

		return posObj;
	},

	//judge the mouse direction
	slideLeft: function(){},
	slideRight: function(){},
	toBottom: function(elm){
		elm.scrollTop = elm.scrollHeight - elm.offsetHeight;

		return this;
	},
	//drag tool
	drag: function(){
		var util = {
		    index:1000, 
		    getFocus:function (target){ 
		        if(target.style.zIndex != this.index){ 
		            this.index += 2; 
		            var idx = this.index; 
		            target.style.zIndex=idx; 
		        } 
		    },
		    abs:function (element) {
		        var result = { x: element.offsetLeft, y: element.offsetTop};
		        element = element.offsetParent;
		        while (element) {
		            result.x += element.offsetLeft;
		            result.y += element.offsetTop;
		            element = element.offsetParent;
		        }
		        return result;
		    }
		};
		 
		var _drag = function (argObj){
		/*argObj = {
				ctrl: '',
				target: '',
				offSetX: '',
				offSetY: '',
				zIndex: '',
				fn: {
					onmove: stone,noop,
					onup: stone.noop,
					ondown: stone.noop
				}
			}*/
			var ctrl = argObj.ctrl || argObj.target, tar = argObj.target, offSetX = argObj.offSetX || 0, offSetY = argObj.offSetY || 0,
				index = argObj.zIndex || 1000, fnObj = argObj.fn || {};

		    ctrl = typeof(ctrl) == "object" ? ctrl : document.getElementById(ctrl);
		    tar = typeof(tar) == "object" ? tar : document.getElementById(tar);

		    var x0=0, y0=0, x1=0, y1=0, moveable=false, isOut = false, NS=(navigator.appName == 'Netscape'), IE9=this.isIE(9);
		    //set style position
		    //ctrl.style.position = 'absolute';
		    //stone.inArray(tar.style.position, ['absolute', 'fixed']) ? '' : tar.style.position = 'absolute';
		    //start drag
		    this.bind(ctrl, 'mousedown', function(e){
		        var e = stone.getEvent(e);
		        //console.log(e);
		        util.getFocus(tar);
		        if(e.button == (NS ? 0 : (IE9 ? 0 : 1) ) )  {
		        	//alert('sdfwf');
		            if(!NS){
		            	this.setCapture ? this.setCapture() : '';
		            }
		            x0 = e.clientX ; 
		            y0 = e.clientY ; 
		            x1 = parseInt(util.abs(tar).x); 
		            y1 = parseInt(util.abs(tar).y);   
		            moveable = true; 
		        }

		        stone.killEvent(e);				    	
		    });
		    //drag;
		    this.bind(ctrl, 'mousemove', function(e){
		        var e = stone.getEvent(e);
		        if(moveable){ 
		            tar.style.left = (x1 + e.clientX - x0 - offSetX) + "px"; 
		            tar.style.top  = (y1 + e.clientY - y0 - offSetY) + "px";
		            if(typeof fnObj.onmove == 'function'){
		            	fnObj.onmove();
		            }				            
		        }
		        stone.killEvent(e);
		    });
		    this.bind(ctrl, 'mouseout', function(e){
		    	stone.killEvent(e);
				isOut = true;				    	
		    });
		    //stop drag;
		    this.bind(ctrl, 'mouseup', function(e){
		        if(moveable)  {  
		            if(!NS){
		            	this.releaseCapture ? this.releaseCapture() : '';
		            }
		            moveable = false;
		            if(typeof fnObj.onup == 'function'){
		            	fnObj.onup();
		            }
		            stone.killEvent(e);
		        }
		    });
	        
	        //prevent lost drag tar
	        this.bind(document, 'mouseup', function(e){
	            var e = stone.getEvent(e);
	            if(isOut && moveable){
		            tar.style.left = (x1 + e.clientX - x0 - offSetX) + "px"; 
		            tar.style.top  = (y1 + e.clientY - y0 - offSetY) + "px";  

		            isOut = false;
		            moveable = false;
		            if(fnObj.onup){
		            	fnObj.onup();
		            }				            
		            stone.killEvent(e);		            	
	            }			        	
	        });

		};//var _drag

		return _drag;
	}(),
	//****** not finished !===============================
	contextmenu: function(argObj){
		/*argObj: {
			target: '',
			menu: [
				{
					text: 'menu1',
					icon: 'sdf.jpg',
					click: function(){}
				},
				{
					text: 'menu2',
					icon: 'sdf.jpg',
					click: function(){}						
				}
			]
		}*/
	},
	/* /EventUtil Tools ============================================= */
	availWinSize: function() {//Get Available Window Size
		//Width
        if (window.innerWidth){ winWidth = window.innerWidth; }
        else if ((document.body) && (document.body.clientWidth)){ winWidth = document.body.clientWidth; }

         //Height
        if (window.innerHeight) { winHeight = window.innerHeight; }
        else if ((document.body) && (document.body.clientHeight)){ winHeight = document.body.clientHeight; }
       
        //Hack
        if (document.documentElement  && document.documentElement.clientHeight && document.documentElement.clientWidth)
        {
            winHeight = document.documentElement.clientHeight;
            winWidth = document.documentElement.clientWidth;
        }

        return {
        	width: winWidth,
        	height: winHeight
        };
		},

	cloneArray: function (a) {
		var r = a.concat([]);
		return r;
	},

	clone: function(tar) {	 	
		var t = this.getType(tar), rt;	 	
		t == 'array' ? rt = this.cloneArray(tar) : 	 	
		(t == 'object' ? rt = this.cloneObj(tar) : 	 	
		(t == 'string' ? rt = tar : ''));	 	

		return rt;	 	
	},
	//return a new reversed array
	reArray: function(a){
		var b = a.concat([]).reverse()
		return b;
	},
	unique: function(list){
		var res = [], hash = {};
	    for(var i=0, elem; (elem = list[i]) != null; i++)  {
	        if (!hash[elem]){
	            res.push(elem);
	            hash[elem] = true;
	        }
	    }
	    return res;
	},
	arrayDel: function(arr, index, ifClone){
		ifClone ? arr = stone.clone(arr) : '';
	  	for(var i=index, len=arr.length-1; i<len; i++){
	         arr[i] = arr[i + 1];
	    }
	    arr.length = len;				
	    return arr;
	},
	sort: function(list, sortFn, subSortFn){
		if(!sortFn) { return list.sort(); }
		else {
			//this.typeCheck(list[0], 'object');
			var listCopy = stone.clone(list),
				rsList = [],
				objList = [],
				strList = [],
				tmpObj = {};

			this.every(listCopy, function(curObj){
				var sortKey = sortFn.call(curObj, curObj);
				//console.log(sortKey)
				strList.push(sortKey);
				objList.push({
					'key': sortKey,
					'obj': curObj
				});
			});

			strList.sort(subSortFn);
			//console.log(strList);
			stone.every(strList, function(curKey){
				var tarObj;
				var len = objList.length
				for(var i=0; i<len; i++){
					var obj = objList[i];
					if(obj['key'] === curKey){
						tarObj = obj['obj'];
						obj['key'] = '__used_key__';
						break;
					}
				}

				if(tarObj){ rsList.push(tarObj);}
				else { throw Error('Unknow Error.');}
			});

			return rsList;
			
		}
	},
    listEach: function(a, eachfn){
        var len = a.length;
        var newa = [];
        for(var i=0;i<len; i++){
            newa.push(eachfn.call(a[i], i, a[i])); 
        }
        //invalid return value
        newa.length == 0 ? newa = undefined : '';
        return newa;
    },
    every: function(a, eachfn){
        var len = a.length;
        var curRs;
        for(var i=0;i<len; i++){
            curRs = eachfn.call(a[i], i, a[i]); 
        }

        return curRs;
    },

    attrEach: function(obj, fn){
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                fn.call(obj[key], key, obj[key]);
            }
        }

        return this;
    },
    each: function(obj, fn){
        //if it is list 
        if(this.getType(obj) == 'array'){
            return this.every(obj, fn);
        }
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                fn.call(obj, key, obj[key]);
            }
        }

        // return this;
    },
	attrNum: function(obj){
		var num = 0;
		stone.attrEach(obj, function(val){
			num++;
		});
		return num;
	},
	bindThis: function(fnThis, fnbody, isReturnAll){
		return function(){
			var fnArgs = arguments;	
			if(!isReturnAll){
				var rtVal = stone.every(fnThis, //this: [svg Object]
					function(item){ 
						return fnbody.apply(item, fnArgs);
					} );
			}else {
				var rtVal = stone.each(fnThis, 
					function(item){ 
						return fnbody.apply(item, fnArgs);
					} );
			}
			return (rtVal !== undefined ? rtVal : fnThis);
		};
	},
	forIn:function(obj,call1,call2){
		var len = obj.length,
			i = 0,
			fn = function(){
			if(i<len){
				call1(i,obj[i]);
				i++;
				setTimeout(function(){
					fn();
				});
			}else{
				call2();
			}
		};
		fn();
	},
	
	forEach:function(obj,callback){
		/*
			分段遍历策略
		*/
		if(!obj){
			return;
		}
		var len = obj[0].length,i;
		if(len<=6){
			/*
				普通方式
			*/
			for (i=0; i < len; i++) {
				if ( callback.apply( obj[0][i],[obj[0][i],i]) === false ) {
					break;
				}
			}
		}else{
			var fn = function(s){
				callback.apply( obj[0][s],[obj[0][s],s]);
				callback.apply( obj[0][s+1],[obj[0][s+1],s+1]);
				callback.apply( obj[0][s+2],[obj[0][s+2],s+2]);
				callback.apply( obj[0][s+3],[obj[0][s+3],s+3]);
				callback.apply( obj[0][s+4],[obj[0][s+4],s+4]);
				callback.apply( obj[0][s+5],[obj[0][s+5],s+5]);
			};
			var remainder = len % 6;
			var section = Math.floor( len / 6);
			if(section){
				i = 0;
				while(i<section){
					fn(i*6);i++;
				}
			}
			if(remainder){
				i = len-remainder;;
				while(i<len){
					callback.apply( obj[0][i],[obj[0][i],i]);i++;
				}
			}
		}
	},			
	isEmpty: function(tar){
		var type = this.getType(tar);
		var rs = true;
		if(type == 'object'){
			this.attrEach(tar, function(){
				rs = false; 
			});
		}else if(type == 'array'){
			this.every(tar, function(){
				rs = false;
			});
		}else if(type == 'string'){
			if(tar === ''){
				rs = true;
			}
		}else {
			throw Error('TypeError: stone.isEmpty([string/array/object])');
		}

		return rs;
	},
	toggleAttr: function(tar, attr, val){
		var val = val || attr;
		if(!tar.getAttribute(attr)){
			tar.setAttribute(attr, val);
		}else {
			tar.removeAttribute(attr);
		}

		return this;
	},
	isEditable: function(tar){
		return !!tar.getAttribute('contenteditable');
	},
	//ONLY FOR STRING/NUMBER ARRAY
	arrayMinus: function(a, b, intersection){
		var intersection = intersection || false;
		//rs = a - b
		var tA = this.getType(a), tB = this.getType(b);
		tA == 'array' ? (tB == 'array' ? '' : (b = [].concat(b) )) : (a = [].concat(a));

		var rs = [];
		var rsI = [];
		var aLen = a.length;

		for(var i=0; i<aLen; i++){
			if(!stone.inArray(a[i], b)){ // if not in b
				rs.push(a[i]);
			}else {
				rsI.push(a[i]);
			}
		}
		if(!intersection){
			return rs;
		}else {
			return rsI;
		}
	},
	//ONLY FOR STRING/NUMBER ARRAY
	arrayUnion: function(a, b){
		//rs = a + b;
		this.typeCheck(a, 'array').typeCheck(b, 'array');
		var intersection = this.arrayMinus(a, b, true);

		return this.arrayMinus(a.concat(b), intersection).concat(intersection);
	},
	rmEmpty: function(tar){
		var len = tar.length,
			rt = [];
		for(var i=0; i<len; i++){
			var curVal = tar[i];
			curVal !== '' ? rt.push(curVal) : '';
		}
		return rt;
	},
	renderTmpl: function(tmpl ,data){
        var dataType = stone.getType(data);
        var rsHtml = tmpl;
        if(dataType == 'array'){
            var len = data.length;
            for(var i=0; i<len; i++){
                rsHtml = rsHtml.replace(/%(\{\w*\})?%/, data[i]);
            }
        }else if(dataType == 'object'){
            for(var key in data){
                if(data.hasOwnProperty(key)){
                    var valPt = new RegExp('%\\{?'+key+'\\}?%', 'g');
                    rsHtml = rsHtml.replace(valPt, data[key]);
                }
            }
        }else {throw TypeError('Invalid Type: '+dataType);}

        return rsHtml;
    },
    attr: function(tar, key, val){
    	var list = [],
    		rs, rtOne = false;
    	tar.length ? list = tar : (list = [].concat(tar), rtOne = true);
    	
    	val === undefined ? rs = this.each(list, function(cur){
    		return cur.getAttribute(key, val);
    	}) : ( this.every(list, function(cur){
    		cur.setAttribute(key, val);
    	}), rtOne = false ); 
    	//rs.length == 1 ?  rs = rs[0] : (rs.length == 0 ? rs = undefined : '');
    	rtOne === true ? rs = rs[0] : '';

    	return rs;
    },
    pureSelector: function(str){
    	if(stone.inArray(str.charAt(0), ['#', '.'])){
    		return str.slice(1);
    	}else {
    		return str;
    	}
    },
    random: function(dis) {
    	//like dis = [1, 10]
    	var dis = dis || [0, 1];
		return parseInt(Math.random() * (dis[1] - dis[0] + 1) + dis[0])
	},
    _loadedScript: function(){
    	var scripts = document.getElementsByTagName('script'),
			srcs = [], len = scripts.length;
		for(var i=0; i<len; i++){
			srcs.push(scripts[i].getAttribute('src'));
		}

		return srcs;
    }(),
    /*
	 * script/or errorfn
     */
    requireScript: function(url, onloadfn, scriptId){//script dynacmic load
  		//console.log('toloadQueu: '+module.toLoadQueue);
  		if(stone.isIE()){
  			if(module.isGettingScript === true){
	  			module.toLoadQueue.push(function () {
					stone.requireScript.call(null, url, onloadfn, scriptId);
				});

				return;
			}
  		}

		var script = document.createElement('script');
		script.type = 'text/javascript';
		var errorfn = onloadfn || this.noop;
		//get 
		scriptId ? 
			(typeof scriptId == 'string' ? 
				script.setAttribute('id',scriptId ) : 
				(typeof scriptId == 'function' ? 
					errorfn = scriptId : 
					'' ) )
			: '';
		
		if(stone.isIE() && script.readyState){ //for IE // or use && script.readyState
			var ieLoaded = function(){
				script.onreadystatechange = null;
				onloadfn ? onloadfn.call(script, url) : '';

				delete module.isGettingScript; 
				if(module.toLoadQueue.length > 0){
					module.toLoadQueue.shift()();
					/*stone.fnRun(module.toLoadQueue);
					module.toLoadQueue = [];*/
				}
			};
			//if loaded js file
			if(stone.inArray(url, stone._loadedScript)){
				ieLoaded();
				return;
			}
			script.onreadystatechange = function(){
				if(script.readyState == 'loading'){
					//console.log('onLoading: || ' + script.src);
				}else if(script.readyState == 'loaded' || script.readyState == 'complete') {
					ieLoaded();
					//console.log('loaded: || ' + script.src);
				}else {
					//console.log(script.readyState);
				}
			};
			//script.defer = true;

		}else {//other browser
			script.onload = function(event){
				script.onload = null;	
				onloadfn ? onloadfn.call(script, url) : '';
			};
			script.onerror = function(){
				script.onerror = null;
				errorfn ? errorfn.call(script, url, onloadfn) : '';
			};
			//script.async = false;
			//if async == true, other broser also keep sequence load
		}
		module.isGettingScript = true;
		require.charset ? script.charset = require.charset : '';

		script.src = url;
		stone._loadedScript.push(url);
		//if the body node is not created, then append this script node in head
		document.body ? document.body.appendChild(script) : document.getElementsByTagName('head')[0].appendChild(script); 
		return this;
	},
	getScript: function(url, onloadfn, scriptId){
		var script = document.createElement('script');
		script.type = 'text/javascript';
		var errorfn = onloadfn || this.noop;
	
		/*if(scriptId != undefined && typeof scriptId == 'string' ) { 
			script.setAttribute('id',scriptId ); 
		}*/
		scriptId ? 
			(typeof scriptId == 'string' ? 
				script.setAttribute('id',scriptId ) : 
				(typeof scriptId == 'function' ? 
					errorfn = scriptId : 
					'' ) )
			: '';
		
		if(stone.isIE() && script.readyState){ //for IE // or use && script.readyState
			var ieLoaded = function(){
				script.onreadystatechange = null;
				onloadfn ? onloadfn.call(script, url) : '';
			}
			script.onreadystatechange = function(){
				if(script.readyState == 'loading'){
					//console.log('onLoading: || ' + script.src);
				}else if(script.readyState == 'loaded' || script.readyState == 'complete') {
					ieLoaded();
					//console.log('loaded: || ' + script.src);
				}else {
					//console.log(script.readyState);
				}
			};
			//script.defer = true;
		}else {//other browser
			script.onload = function(event){
				script.onload = null;	
				//console.log(url)
				if(onloadfn && !onloadfn.isJSONPLoadedCallback) {//if not the jsonp callback
					onloadfn.call(script, url);
				}
			};
			script.onerror = function(){
				script.onerror = null;
				errorfn ? errorfn.call(script, url, onloadfn) : '';
			};
			//script.async = false;
			//if async == true, other broser also keep sequence load
		}
		require.charset ? script.charset = require.charset : '';

		script.src = url;
		stone._loadedScript.push(url);
		//if the body node is not created, then append this script node in head
		document.body ? document.body.appendChild(script) : document.getElementsByTagName('head')[0].appendChild(script); 
		return this;
	},			
	getJSONP: function(obj){ //			
		var url = obj.url, dataObj = obj.data, success = obj.success || this.noop, error = obj.error || this.noop ;
		var defCallfn = obj.callback || 'stoneJSONP_'+stone.getAutoIncrement('s_jsonp_fn');
		obj.data ? obj.data['callback'] = defCallfn : 
		obj.data = {'callback': defCallfn};

		if(url.indexOf('?') > -1) { url += '&';}else {url += '?';}
		url += stone.resolveJSON(dataObj);
		var scriptId = 'x_jsonp_'+this.getAutoIncrement('x_stonejsonp') +'_'+ new Date().getTime();
		window[defCallfn] = function(dataGot){//the default callback fn
			document.getElementById(scriptId).setAttribute('guid',scriptId);//set the guid attr
			success(dataGot);//get the returned servers data
			//document.getElementById(scriptId).removeNode();
		};
		var JSONPLoaded = function(){//the error fn
			if(stone.isIE()){
				if( document.getElementById(scriptId).getAttribute('guid') != scriptId) {
					error();//if not run st.JSONCallback ，then do error fn
				}
			}else {
				error();
			}
		};
		//set marks for getScript;
		JSONPLoaded.isJSONPLoadedCallback = true;
		this.getScript(url, JSONPLoaded, scriptId);
	},			

	sendImgPing : function(url, callback){ /*dataObj,*/
		var img = new Image();
		img.onload = img.onerror = callback;
		img.src = url;
	},
    parseObject: function(url){//translate the URL resolve to Object
		return (new Function('return' +	
		' {' + 
		      url.substring(url.indexOf('?')+1).replace(/&/g,'",').replace(/=/g,': "') +
		'" }'))();//before '}' add " for:the end parameters. eg: rs=true  ,then rs: "true ,need  "  to end this 
	},
	objToArray: function(obj){
		var list = [];
		stone.each(obj, function(){

		});
	},
	calUrl: function(base, tar){
		return base.replace(/^.\//g, '');
	},
	urlToObj: function(url){//
		return (new Function('return' +	
		' {' + 
		      url.substring(url.indexOf('?')+1).replace(/&/g,'",').replace(/=/g,': "') +
		'" }'))();
	},

	objToUrl: function(parObj,curUrlRoot){
		//this.typeCheck(parObj, 'object');
		var curUrl = curUrlRoot || '';
		for(var key in parObj) {
			if(parObj.hasOwnProperty(key)){
				curUrl = this.addURLParam(curUrl, key, parObj[key] );
			}
		}
		return curUrl;
	},

	objGetUrl: function(parObj,curUrlRoot){
		this.typeCheck(parObj, 'object');
		var curUrl = curUrlRoot || '';
		for(var key in parObj) {
			if(parObj.hasOwnProperty(key)){
				curUrl = this.addParam(curUrl, key, parObj[key] );
			}
		}
		return curUrl;
	},

	getObj: function(argObj){

		var regSymbol = '^$.*+?=!:|\/()[]{}';

        var s = argObj.string,
        	a = argObj.linker,
        	b = argObj.separator;
        if(s == undefined || s == null || s == '' || s == 'undefined' || s == 'null'){
        	throw new TypeError('Invalid String : ' + s + ' ,Please Check !' );
        }

        if(regSymbol.indexOf(a) != -1){
        	a = '\\'+a;
        }
        if(regSymbol.indexOf(b) != -1){
        	b = '\\'+b;
        }   
        //console.log('return {"' + s.replace(new RegExp(b, 'g'), '",').replace(new RegExp(a, 'g'), '": "') + '" }');
        return (new Function('return {"' + s.replace(new RegExp(b, 'g'), '", "').replace(new RegExp(a, 'g'), '": "') + '" }'))();			
	},

	resolveJSON: function(obj){
		this.typeCheck(obj,'object');
		var str = '';
		for(var i in obj){
			str += ( i + '=' + encodeURIComponent(obj[i]) + '&' );	

		}
		str = str.slice(0,-1);
		return str;

	},

	trim: function(str){
		return str.replace(/(^\s*)|(\s*$)/g, '');
	},
	trimAll: function(str){
		return str.replace(/\s/g, '');
	},
	//For String Util
	//use for mixed with english words and chinese words
	subMixstr : function(str, cutLen){
       //resolve to array
	    var pt = /[^\x00-\xff]/,temp = [],rs=[];
	    if ( !pt.test(str))  {
	    	return str.substring(0,cutLen-1);
	    }
	    else {
	       for(var i=0, len = str.length; i<len; i++){
               pt.test(str[i]) ? temp.push([str[i],2]) : temp.push([str[i],1]);
	       }
	    }
	    for(var p =0,lenCounter = 0; p<len; p++){
		  var tStr = temp[p][0];
		  rs.push(tStr);
	      if( (lenCounter+=temp[p][1]) >= cutLen ){return rs.join('');}
	    }
    },
	HTMLEncode: function (html) { 
		var temp = document.createElement ("div"); 
		(temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html); 
		var output = temp.innerHTML; 
		temp = null; 
		return output; 
	},
	HTMLDecode: function (text) { 
		var temp = document.createElement("div"); 
		temp.innerHTML = text; 
		var output = temp.innerText || temp.textContent; 
		temp = null; 
		return output; 
	}, 
	getCookie: function(name){
		var cookieName = encodeURIComponent(name) + '=',
			cookieStart = document.cookie.indexOf(cookieName),
			cookieValue = null;
		
		if (cookieStart > -1){
			var cookieEnd = document.cookie.indexOf(';',cookieStart);//从cookieStart这个位置向后查找
			if (cookieEnd == -1) {
				cookieEnd = document.cookie.length;
			}
			cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
		}
		
		return cookieValue;
	},
	
	setCookie: function(name,value,expires,path,domain,secure){
		var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
		
		if (expires instanceof Date) {
			cookieText += '; expires=' + expires.toGMTString();
		}
		
		if (path) {
			cookieText += '; path=' + path;
		}
		
		if (domain) {
			cookieText += '; domain=' + domain;
		}
		
		if (secure) {
			cookieText += '; secure';
		}
		
		document.cookie = cookieText;
	},
	
	delCookie: function (name, path, domain, secure){//document.cookie = name+"=;expires="+(new Date(0)).toGMTString();
		//this.setCookie(name,"",new Date(0), path, domain,secure);
		var name = name || '';
		document.cookie = name+"=;expires="+(new Date(0)).toGMTString();
	},  
	getTimeName: function(){
		var now = new Date(),
			hour = now.getHours(),
			rs = 'day';

		if (hour > 4 && hour < 12){
			rs = 'morning'
		}else if (hour < 18){
			rs = "afternoon"
		}else if (hour < 20){
			rs = "evening"
		}else {
			rs = "night"
		}

		return rs
	},
	compareDate: function(a,b){ //for yyyy-mm-dd
		var arr = a.split('-'),
		    starttime = new Date(arr[0],arr[1],arr[2]),
			startTimes = starttime.getTime();//
			
		var arr2 = b.split('-'),
			lktime = new Date(arr2[0],arr2[1],arr2[2]),
			lkTimes = lktime.getTime();
			
		if(startTimes >= lkTimes) { return false;}
		else {return true;}
		    
	},

	now: function(){

		return (new Date()).getTime();
	}, 	
	getCHTime: function () { //get the Chinese-format time
        var now = new Date();
       
        var year = now.getFullYear();       //year
        var month = now.getMonth() + 1;     //month
        var day = now.getDate();            //day
       
        var hh = now.getHours();            //hour
        var mm = now.getMinutes();          //minute
       
        var clock = year + "-";				//clock the final time show
       
        if(month < 10){
           clock += "0";
         }
           clock += month + "-";
		
        if(day < 10){
           clock += "0";
          }   
          clock += day + " ";
		
        if(hh < 10){
          clock += "0";
         }   
          clock += hh + ":";
		
        if (mm < 10) {
		  clock += '0'; 
        }
		  clock += mm; 
		
        return(clock); 
	},
	getCHDate:function(){
		return this.getCHTime().slice(0,10);
	},

	classOf: function(o,note){
	          if (o === null) return 'Null';
	          if( o === undefined) return 'Undefined';
			  if( !note ) return Object.prototype.toString.call(o).slice(8,-1);
			  if(note) return Object.prototype.toString.call(o);
	},//classOf
	typeCheck: function(obj,type,mes){
	 	var errorMes = 'TyperError';
	 	if(this.classOf(obj) == 'Array'){//if check a package of targets in a Array
	 		if(typeof arguments[1] == 'string' ) {
	 			var obj = [ [obj, arguments[1]] ];
	 		}
	 		for(var p = 0, len = obj.length; p < len; p++){
	 			if(obj[p][1].toLowerCase() == 'array'){
	 				if( this.classOf(obj[p][0]).toLowerCase() != 'array'){
	 						errorMes = mes || 'The Parameter Type Expected to be '+obj[p][1]+' But got '+this.classOf(obj[p][0]);
  							throw new TypeError(errorMes);
	 				}
	 			}
	 			else if (typeof obj[p][0] != obj[p][1] ){
	 				errorMes = mes || 'The Parameter Type Expected to be '+obj[p][1]+' But got '+(typeof obj[p][0]) ;
  					throw new TypeError(errorMes);
	 			}

	 		}
	 		return this;//ok
	 	}

 	 	else if(typeof obj != type) {//other type check
  			errorMes = mes || 'The Parameter Type Expected to be '+type+' But got '+(typeof obj) ;
  			throw new TypeError(errorMes);

  		}
  		return this;//ok

 	},//typeCheck

 	getType: function(t){
 		var cur = this.classOf(t).toLowerCase();
 		return cur;
 	},
 	
 	typeIn: function(tar, ts){
 		var curType = this.classOf(tar).toLowerCase();
 		return this.inArray(curType, ts);
 	},
 	classIn: function(tar, ts){
  		var curType = this.classOf(tar);
 		return this.inArray(curType, ts);		
 	},

 	validate: function(tar, type){
 		//stone.typeCheck([[type, 'string'], [tar, 'string'] ]);
 		
 		switch(type) {

 			case 'number':
 				return _number_pt = /^\d+(\.\d+)?$/.test(tar);
			case 'integer':
				var _integer_pt = /^(-|\+)?\d+$/ ;
	            return _integer_pt.test(tar);

			case 'mail':
				//MAIL : "^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$",
				var _email_pt = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
	            return _email_pt.test(tar);

			case 'tel':
				//TEL : "^0(10|2[0-5789]|\\d{3})-\\d{7,8}$",
				var _tel_pt = /^[0-9]{3,4}(\-|\s)[0-9]{7,8}$/;
	            return _tel_pt.test(tar);
	        case 'mobile':
	            var _mobile_pt = new RegExp('^1(3[0-9]|5[0-35-9]|8[0235-9])\\d{8}$');
	            return _mobile_pt.test(tar);
	        case 'url' :
	        	var _url_pt = new RegExp('^http[s]?://[\\w\\.\\-]+$');
	        	return _url_pt.test(tar);
	        case 'idcard':
	        	var _id_pt = new RegExp('((11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65|71|81|82|91)\\d{4})((((19|20)(([02468][048])|([13579][26]))0229))|((20[0-9][0-9])|(19[0-9][0-9]))((((0[1-9])|(1[0-2]))((0[1-9])|(1\\d)|(2[0-8])))|((((0[1,3-9])|(1[0-2]))(29|30))|(((0[13578])|(1[02]))31))))((\\d{3}(x|X))|(\\d{4}))');		
	        	return _id_pt.test(tar);
	        case 'ip':
	       		var _ip_pt = new RegExp('^((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]|[*])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]|[*])$');
	       		return _ip_pt.test(tar);
	       	case 'chinese':
	       		var _ch_pt = new RegExp('^([\u4E00-\uFA29]|[\uE7C7-\uE7F3])*$');
	       		return _ch_pt.test(tar);

	        // default ==========================================================
			default: 
				this.throwError('TypeError', 'No Type Matched: ' + type );

		}

		return false;
 	},///validate

 	cloneObj: function(obj){
 	 	var objClone ;
 	 	if (obj.constructor == Object){
			objClone = new obj.constructor();
		}else{
			objClone = new obj.constructor(obj.valueOf());
		}

		for(var key in obj){

			if ( objClone[key] != obj[key] ){
				if ( typeof obj[key] == 'object' ){
					objClone[key] = this.cloneObj(obj[key]);//深度克隆
				}else{
					objClone[key] = obj[key];
				}
			}
		}

		objClone.toString = obj.toString;
		objClone.valueOf = obj.valueOf;

		return objClone;

 	},

 	updateObj: function(base, newFea){//a is base obj, newFea's attr will rewrite a's accoding attr
		/*for(var key in base){
 			if(base.hasOwnProperty(key)){
 				if(newFea.hasOwnProperty(key)){
					base[key] = newFea[key];
 				}
 			}
 		}*/
 		for(var key in newFea){
 			if(newFea.hasOwnProperty(key)){
					base[key] = newFea[key];
 			}
 		}		 		
 		return base;
 	},

 	delAttr: function(_obj, delAttr){
 		stone.typeCheck(_obj, 'object');

        if(typeof delAttr =='string'){
            delete _obj[delAttr];
        }else if(stone.classOf(delAttr) == 'Array'){
            var len = delAttr.length;
            for(var i=0 ; i<len; i++){
                delete _obj[delAttr[i]];
            }
        }else {
        	throw TypeError('Stone.delAttr() Expected String or Array, But got '+stone.classOf(delAttr));
        }	

        return _obj;
 	},

 	hasAttr: function(obj, attr){
 		//not finished
 		var attr = [].concat(attr);
 		var len = attr.length;
 		var notHas = [];
 		for(var i=0; i<len; i++){
 			if(!obj.hasOwnProperty(attr[i])){
 				return false;
 			}
 		}	

 		return true;	 		
 	},

 	getNotHasAttr: function(obj, attr){

 		var attr = [].concat(attr);
 		var len = attr.length;
 		var notHas = [];
 		for(var i=0; i<len; i++){
 			if(obj.hasOwnProperty(attr[i])){

 			}else {
 				notHas.push(attr[i]);
 			}
 		}

 		return notHas;
 	},

 	getFullName : function(ori,ext,type){
 	 	if(ori == '') {
 	 		this.throwError('Error','The original FileName can\'t be empty!');
 	 	}
 	 	//this.typeCheck([[ori,'string'],[ext,'string']]);
 	 	var rs = ori;
 	 	var pt = new RegExp('$\\.'+ext,'g');
 	 	
 	 	(!type) && (ori.indexOf('.'+ext) == -1) && (!pt.test(ori)) && (rs+=('.'+ext)) ;//------------------------------------------------not all finished

 	 	return rs;
 	 	
 	},

 	getShortName: function(ori, ext, type){

 	 	//this.typeCheck([[ori,'string'],[ext,'string']]);
 	 	var pt = new RegExp('\\.'+ext+'$','g');
 	 	var rs = ori.replace(pt,'');//----del the extension

 	 	return rs;
 	},

	addLinkCSS: function(href,callback){
		var link = document.createElement('link');
		link.type = 'text/css';
		link.rel = 'stylesheet';
		this.bind(link, 'load', function(event){
				callback ? callback() : void(0);
			});
		link.href = href;
		document.getElementsByTagName('head')[0].appendChild(link);
		return this;
	},
	addStyleCSS: function(str){
		var style = document.createElement('style');
		style.textContent = str;
		document.getElementsByTagName('head')[0].appendChild(style);
		return this;
	},
	addScript: function (src) {
		if(typeof src != 'string'){
		    throw new TypeError('script src expected to be string');	
	    }
		var script = document.createElement('script');
		script.src = src;
		document.body.appendChild(script);
		return this;
	},
	appendDiv: function(divObj){
		var div = document.createElement('div');
		divObj.id ? div.id = divObj.id : '';
		
		if (typeof divObj.html == 'string') { div.innerHTML = divObj.html; }
		if (typeof divObj.style == 'string') { div.setAttribute('style', divObj.style); }
		
		document.body.appendChild(div);

	},
	currentStyle:function(dom,name){
		if(dom.currentStyle){
			name = name.replace(/-\w/,function(m){return m.toUpperCase();});
			name = name.replace("-","");
			return dom.currentStyle[name];
		}else{
			return window.getComputedStyle(dom).getPropertyValue(name);
		}
	},
	delay: function(fn, time){
		var task = setTimeout(fn, time);
		return task;
	},
	repeatTimer: function(callback,time){
		var _hash = this.hash = stone.noop;
		var _fn = this.repeatTimer;

		setTimeout(function(){
		    if(typeof callback == 'function') { callback();}
		    _hash = _fn;
			setTimeout(_fn,time);	
		},time);
	},
	removeTimer: function(){
		this.removeTimer.hash = null;
	},
	isOpera: function(){
		var isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]';
		return isOpera;
	},

	ltIE: function(verson){
		var num = verson || '9';
		var IEtester = document.createElement('div');
		IEtester.innerHTML = '<!--[if lt IE ' + num + ']><i></i><![endif]-->';

		return !!IEtester.getElementsByTagName('i')[0];
	},
	isIE : function (verson){//check for ie
		var num = verson || '';
		var IEtester = document.createElement('div');
		IEtester.innerHTML = '<!--[if IE ' + num + ']><i></i><![endif]-->';

		this.isIE = function(){
		    return !!IEtester.getElementsByTagName('i')[0];
		};
		return !!IEtester.getElementsByTagName('i')[0];
    },


	addURLParam : function(url,name,value){//put the parameters into url

		url += (url.indexOf('?') == -1 ? '?' : '&');
		url += encodeURIComponent(name) + '=' + encodeURIComponent(value);

		return url;
	},

	addParam: function(url,name,value){
		url += (url.indexOf('?') == -1 ? '?' : '&');
		url += name + '=' + value;
		return url;				
	},

	getUpper: function(str, pos){
		var pos = pos || 0;
		console.log(str[pos]);
		var rsStr = str[pos].toUpperCase()+str.slice(pos+1);

		return rsStr;
	},


	inString: function(tar, str){
		return !!(str.indexOf(tar) + 1);
	},

	ins: function(tar, source){
		var stype = this.getType(source);
		if(stype == 'array'){ return this.inArray(tar, source);}
		else if( stype == 'string'){ return this.inString(tar, source);}
		else {
			throw Error('TypeError: Expected arguments[1] string or array.');
		}
	},

    inArray: function(t,a,isRemove){
		if(this.classOf(a) == 'Array'){
			if(!a.length) { return false; }
			var len = a.length;
			for(var i=0; i<len; i++){
				if(t === a[i]){
					return true;
				}
			}

			return false;
		}else {
			this.throwError('TypeError', 'Argumegs[1] Expected Array in Stone.inArray()');
		}
    },

    fnRun: function(fnCtn){
    	var argType = this.getType(fnCtn);
    	if(argType == 'array'){
    		var len = fnCtn.length;
    		for(var i=0; i<len; i++){
    			fnCtn[i]();
    		}
    	}else if(argType == 'object'){
			for(var key in fnCtn) {
				if(fnCtn.hasOwnProperty(key)){
					fnCtn[key]();//	key();
				}
			}
    	}else {
    		throw new TypeError('fnRun Expected Param Array Or Object,But got ' + argType);
    	}
    },

    gotoAnchor: function (anchorId, offTop) {
    	var alink = document.createElement('a');
    	alink.href = '#' + anchorId;
    	alink.style = "display:none;";
    	document.body.appendChild(alink);
    	alink.click();
    	alink.remove();
    },
    trimHtmlTag: function(str){
    	return str.replace(/<[^>].*?>/g,"");
    },
    getAutoIncrement: function(forId, baseNum){
    	
    	if(typeof _autoIncrement[forId] == 'number'){
    		return ++_autoIncrement[forId];
    	}else if(_autoIncrement[forId] == undefined){
    		_autoIncrement[forId] = baseNum || 0;
    		return _autoIncrement[forId];
    	}else {
    		stone.throwError('UncaughtError', 'Sorry,I don\' know. ');
    	}

    },
    readAutoIncrement: function(forId){
    	//stone.typeCheck(forId, 'string');
    	return _autoIncrement[forId];
    },
	getGUID: function(forWhat){//create the GUID
		var curGUID = 'xxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
									    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
										return v.toString(16);	
									}).toUpperCase();

		if(typeof forWhat == 'string') {
			_guidBase[forWhat] = curGUID;
		}	
							 
	    return curGUID;
	},
	readGUID: function(forWhat){
		if(typeof forWhat == 'string'){
			return _guidBase[forWhat];
		}else {
			return _guidBase;
		}
	},
    throwError: function (errType,errMes,config,e){
	    var e = e || { message:'There is an UnDescribed customError.'}, config = config || 'throw',errType = errType || 'ErrorFound', errMes = errMes || e.message || 'There is an UnDescribed customError.';

	    switch(config){
		  case 'throw':
		    throw new Error(errType+': ' +errMes);
		    break;
		  case 'alert':
		    alert(errType+': ' +errMes);
		    break;
		  case 'define':
		  
		    break;
	    }///switch
    },
    language: function(){
    	if(navigator.appName == 'Netscape')  {
			var lan = navigator.language;  
		}else{  
			var lan = navigator.browserLanguage;  
		}
		return lan;
    }(),
	divLog: function(){
		var mesCounter = 0;
		return function(mes, style){
	  		//var guid = this.getGUID();
	  		var info = mes || '';
	  		this.appendDiv({
	  			//id: guid,
	  			html: '<span style="margin:0; padding:0; font-weight:bold;">'+ (++mesCounter) + '-</span> '+ this.getCHTime() + ':  &nbsp;&nbsp;'+ info, 
	  			style: style || 'display:block; background-color: #A5D1B2; /*#A8BE00 red*/'
	  		});

  		};///return function(){...}

  	}()
};

window.stone = module.exports

