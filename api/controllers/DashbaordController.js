/**
 * DashbaordController
 *
 * @description :: Server-side logic for managing dashbaords
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index (req, res) {
        res.render('dashboard/dashboard')
    }
};

