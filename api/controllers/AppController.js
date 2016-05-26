/**
 * RobotController
 *
 * @description :: Server-side logic for managing robots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


function index(req, res){
    DBService.client.get('pet')
    .then(function (val) {
        res.render('app/index', {
            'pet': val
        })
    })
}


export {
    index
}

