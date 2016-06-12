/**
 * DetailController
 *
 * @description :: Server-side logic for managing Details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function(req, res) {
        res.render('dashboard/dashboard')
    },
    
	favorite: function (req, res) {
        res.render('dashboard/favorite')
    },

    insights: function(req, res){
        res.render('dashboard/insights')
    },
    insightsDetail: function(req, res){
        res.render('dashboard/insights_detail')
    }
};

