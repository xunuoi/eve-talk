/**
 * DetailController
 *
 * @description :: Server-side logic for managing Details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Bigpipe = require('node-bigpipe').Bigpipe;

function articlePipe(bp){
    return new Promise((resolve, reject)=>{
        let rdata = {
            'article': 'Your data 0000'
        }

        /**
         * Here call the Express/Sails `render` api
         * 
         * It's async API.
         */
        setTimeout(() => {
           bp.res.render('dashboard/dog', rdata, (err, html)=>{
                bp.render('#wrapper', html)
                console.log('\narticle render html ok')
                resolve()
            }) 

       }, 6000)
        
    })
}


function tagPipe(bp){
    return new Promise((resolve, reject)=>{
        let rdata = {
            'tag': 'your data'
        }

        // simulate the asynchronous response
        setTimeout(()=>{
            let html = '<div><span>TagA</span><span>TagB</span><span>TagC</span><span>TagD</span></div>'
            let pipeData = {
                'html': html,
                'message': 'for tag pipe html',
                'css': ['a.css'],
                'js': ['b.js'],
            }
            // Here the `tag` event names will subscribed by Frontend js code.
            // Here you can use `render`, `append`, `fire`, it depends on your Backend code
            bp.fire('tag', pipeData)
            console.log('\nController fire tag ok')
            resolve()
        }, 3000)
    })
}

module.exports = {
    index: function(req, res) {
        res.render('dashboard/dashboard')
    },
    
	favorite: function (req, res) {
        res.render('dashboard/favorite')
    },

    insights: function(req, res){
        var bp = new Bigpipe('robotBP', req, res);
        bp.start('dashboard/insights')
        .pipe([
            tagPipe,
            articlePipe
            // other ...
        ])
        .end()
        /*setTimeout(() => {
            res.write('<div>first blood</div>')
            res.write('')
        }, 2000)
        setTimeout(() =>{
            res.write('<h3>Second blood</h3>')
        }, 4000)
        setTimeout(() =>{
            res.end();
        }, 6000)*/
        // res.render('dashboard/insights')
    },
    insightsDetail: function(req, res){
        res.render('dashboard/insights_detail')
    }
};

