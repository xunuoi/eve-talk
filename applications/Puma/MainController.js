/**
 * DetailController
 *
 * @description :: Server-side logic for managing Details
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function(req, res, next) {
    	// return res.json({'puma': true})

        res.render('./meta/index')
    }
}

