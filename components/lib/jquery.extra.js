jQuery.cookie = function(name, value, options) {
    if(name == undefined) {
        return document.cookie;
    }
    if (typeof value != 'undefined') {
        var options = options || {};
        if (value === null) {
            var value = '';
            options = $.extend({}, options);
            options.expires = -1;
        }
        var expires = '; expires=-1';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '; path=/';
        var domain = options.domain ? '; domain=' + (options.domain) : '; domain=*';
        var secure = options.secure ? '; secure' : '';
        //document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        cookie_setup_string = [name, '=', encodeURIComponent(value), expires, path].join('');
        // console.log(cookie_setup_string);
        document.cookie = cookie_setup_string;
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};



/*
Html-sorting plugin
-------------------

This sorting plug-in allows for HTML tags with numeric data. With the 'html' type it will strip the HTML and then sorts by strings, with this type it strips the HTML and then sorts by numbers. Note also that this sorting plug-in has an equivalent type detection plug-in which can make integration easier.

Reference: http://datatables.net/plug-ins/sorting#numbers_html
*/
if(jQuery.fn.dataTableExt){
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    // This function didn't work at all, so i copy its logic into 'num-html-asc' and 'num-html-desc'
    "num-html-pre": function ( a ) {
        var x = String(a).replace( /<[\s\S]*?>/g, "" );
        return parseFloat( x );
    },
 
    "num-html-asc": function ( a, b ) {
        a = parseFloat(String(a).replace( /<[\s\S]*?>/g, "" ));
        b = parseFloat(String(b).replace( /<[\s\S]*?>/g, "" ));
        var x = ((a < b) ? -1 : ((a > b) ? 1 : 0));
        // console.log( x );
        return x;
    },
 
    "num-html-desc": function ( a, b ) {
        a = parseFloat(String(a).replace( /<[\s\S]*?>/g, "" ));
        b = parseFloat(String(b).replace( /<[\s\S]*?>/g, "" ));
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
} );
}
/* == $.url() == */
// JQuery URL Parser plugin - https://github.com/allmarkedup/jQuery-URL-Parser
// Written by Mark Perkins, mark@allmarkedup.com
// License: http://unlicense.org/ (i.e. do what you want with it!)

(function($, undefined) {
    
    var tag2attr = {
        a       : 'href',
        img     : 'src',
        form    : 'action',
        base    : 'href',
        script  : 'src',
        iframe  : 'src',
        link    : 'href'
    },
    
    key = ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","fragment"], // keys available to query
    
    aliases = { "anchor" : "fragment" }, // aliases for backwards compatability

    parser = {
        strict  : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
        loose   :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
    },
    
    querystring_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g, // supports both ampersand and semicolon-delimted query string key/value pairs
    
    fragment_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g; // supports both ampersand and semicolon-delimted fragment key/value pairs
    
    function parseUri( url, strictMode )
    {
        var str = decodeURI( url ),
            res   = parser[ strictMode || false ? "strict" : "loose" ].exec( str ),
            uri = { attr : {}, param : {}, seg : {} },
            i   = 14;
        
        while ( i-- )
        {
            uri.attr[ key[i] ] = res[i] || "";
        }
        
        // build query and fragment parameters
        
        uri.param['query'] = {};
        uri.param['fragment'] = {};
        
        uri.attr['query'].replace( querystring_parser, function ( $0, $1, $2 ){
            if ($1)
            {
                uri.param['query'][$1] = $2;
            }
        });
        
        uri.attr['fragment'].replace( fragment_parser, function ( $0, $1, $2 ){
            if ($1)
            {
                uri.param['fragment'][$1] = $2;
            }
        });
                
        // split path and fragement into segments
        
        uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g,'').split('/');
        
        uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g,'').split('/');
        
        // compile a 'base' domain attribute
        
        uri.attr['base'] = uri.attr.host ? uri.attr.protocol+"://"+uri.attr.host + (uri.attr.port ? ":"+uri.attr.port : '') : '';
        
        return uri;
    };
    
    function getAttrName( elm )
    {
        var tn = elm.tagName;
        if ( tn !== undefined ) return tag2attr[tn.toLowerCase()];
        return tn;
    }
    
    $.fn.url = function( strictMode )
    {
        var url = '';
        
        if ( this.length )
        {
            url = $(this).attr( getAttrName(this[0]) ) || '';
        }
        
        return $.url( url, strictMode );
    };
    
    $.url = function( url, strictMode )
    {
        if ( arguments.length === 1 && url === true )
        {
            strictMode = true;
            url = undefined;
        }
        
        strictMode = strictMode || false;
        url = url || window.location.toString();
                                
        return {
            
            data : parseUri(url, strictMode),
            
            // get various attributes from the URI
            attr : function( attr )
            {
                attr = aliases[attr] || attr;
                return attr !== undefined ? this.data.attr[attr] : this.data.attr;
            },
            
            // return query string parameters
            param : function( param )
            {
                return param !== undefined ? this.data.param.query[param] : this.data.param.query;
            },
            
            // return fragment parameters
            fparam : function( param )
            {
                return param !== undefined ? this.data.param.fragment[param] : this.data.param.fragment;
            },
            
            // return path segments
            segment : function( seg )
            {
                if ( seg === undefined )
                {
                    return this.data.seg.path;                    
                }
                else
                {
                    seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
                    return this.data.seg.path[seg];                    
                }
            },
            
            // return fragment segments
            fsegment : function( seg )
            {
                if ( seg === undefined )
                {
                    return this.data.seg.fragment;                    
                }
                else
                {
                    seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
                    return this.data.seg.fragment[seg];                    
                }
            }
            
        };
        
    };
    
})(jQuery);


 /* == /jQuery Plugins Extend ============================================================================================ */

