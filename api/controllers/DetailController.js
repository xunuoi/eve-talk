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
    
	collection: function (req, res) {
        res.render('dashboard/collection')
    }
};

