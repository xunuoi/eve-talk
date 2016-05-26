
var https = require('https');
var http = require('http');
// var jsdom = require("jsdom"); 
// var jqMod = require("jquery");
var fs = require('fs');

var Iconv = require('iconv').Iconv;

String.format = function() { 
    var s = arguments[0]; 
    for (var i = 0; i < arguments.length - 1; i++) { 
        var reg = new RegExp("\\{" + i + "\\}", "gm"); 
        s = s.replace(reg, arguments[i + 1]); 
    }

    return s; 
};

/*res.on(‘data’) 监听data事件。
res.on(‘end’) 数据获取完毕事件。
Buffer.concat(chunks, size); 连接多次data的buff。
data.toString() 将data二进制数据转换成utf-8的字符串，如果页面是GBK的时候，请使用iconv模块进行转换，原生Node.js不支持GBK*/

//rewrite http.get

var _http_get = http.get;
var _reqCount = 0,
	_resCount = 0;

//数据
var areaList = [];

http.sGet = function (){
	// _reqCount++;
	var args = [].slice.call(arguments, 0);

	return http.get.apply(http, args);

}

function spider (url, cb){
	http.get(url, function(res){
		var size = 0;
	    var chunks = [];
		res.on('data', function(chunk){
		    size += chunk.length;
		    chunks.push(chunk);
		});
	  	res.on('end', function(){
	    	var buffer = new Buffer(size), pos = 0;
	        for(var i = 0, l = chunks.length; i < l; i++) {
	            chunks[i].copy(buffer, pos);
	            pos += chunks[i].length;
	        }
			//buffer不支持GBK
	        var gbk_to_utf8_iconv = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
	        var utf8_buffer = gbk_to_utf8_iconv.convert(buffer);

	        var htmlSource = utf8_buffer.toString();
	        cb ? cb(htmlSource) : "";
	  	});
	})
	/*http.sGet(url, function(res) {
	    var size = 0;
	    var chunks = [];
		res.on('data', function(chunk){
		    size += chunk.length;
		    chunks.push(chunk);
		});
	  	res.on('end', function(){

	    	var buffer = new Buffer(size), pos = 0;

	        for(var i = 0, l = chunks.length; i < l; i++) {
	            chunks[i].copy(buffer, pos);
	            pos += chunks[i].length;
	        }
			//buffer不支持GBK
	        var gbk_to_utf8_iconv = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
	        var utf8_buffer = gbk_to_utf8_iconv.convert(buffer);

	        var htmlSource = utf8_buffer.toString();

	        jsdom.env({  
				html: htmlSource,
				scripts: [
					'http://static.vzhen.com/h5/lib/jquery/jquery-2.1.1.min.js'
				],
				done: function (err, window) {
					var $ = window.jQuery;	
					//release memory
					buffer = null;
					htmlSource = null;
					gbk_to_utf8_iconv = null;
					utf8_buffer = null

					//--------------
					cb ? cb($) : '';

				},
				fail: function(e){
					console.log('******E:', e);
					
				}
			});

	  	});

	}).on('error', function(e) {
	 	console.log("Got error: " + e.message);
	});*/

}

function parseRS (rs, cb){
	var sObj;
	function parse_content(obj){
		sObj = obj;
	}
	try {
		eval(rs);
	}catch(err){
		sObj = {
			s: []
		}
	}
	cb(sObj);
}

var preUrl = ['http://suggestion.baidu.com/su?wd=',':@KEYWORD','&json=1&p=3&sid=1466_8235_8488_8057_8504_8593_8580_7798_8482_8318_7962_8129_8509_8436&req=2&bs=do%20you%20want%20eat%20shitk&cb=parse_content&_=1409746925140'];
// var preUrl = ['http://www.baidu.com/s?tn=utf8kb_oem_dg&ie=utf-8&f=8&wd', ':@keyword','&rsv_bp=1&rsv_enter=1&rsv_sug3=12&rsv_sug4=2108&rsv_sug1=6&rsv_sug2=0&inputT=4807'];

exports.search = function(key, cb){
	var rsCb = cb;
	var url = (preUrl[1] = key) && preUrl.join('');
	spider(url, function(rs){
		parseRS(rs, cb);
	});
}
//开始抓取
// spider('http://beijing.haodf.com/', parseResult);


