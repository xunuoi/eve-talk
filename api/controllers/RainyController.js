/**
 * RainyController
 *
 * @description :: Server-side logic for managing rainies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
        return res.render('rainy/rainy')
    }
};

