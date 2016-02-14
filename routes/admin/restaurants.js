var express = require('express');
var router = express.Router();

//---ajax--- Add new restaurant
router.post('/admin/restaurantAdd', function (req, res){

	var restName = req.body.restName;

	knexSQL('restaurants')
        .insert({restaurantName: restName})
        .then(function(restaurant){

        res.send(!!restaurant);
    });
});

//---ajax--- Delete restaurant
router.delete('/admin/restaurantDelete', function (req, res){
	
	var restID = req.body.id;
	var restName = req.body.restName;

	knexSQL('chefs')
        .where({restaurants_id: restID})
        .then(function(chefs){
	    
	    if (chefs.length > 0){

	    	res.send(false);

	    } else {

	    	knexSQL('restaurants')
	        .where({restaurantId: restID})
	        .del()
	        .then(function (rests) {
	            res.send(true);
	        });
	    }
    });
});

//---ajax--- Update restaurant
router.post('/admin/restaurantUpdate', function (req, res){
	
	var restID = req.body.id;
	var restName = req.body.restName;

    knexSQL('restaurants')
        .where({restaurantId: restID})
        .update({restaurantName: restName})
        .then(function (rests) {

        res.send(!!rests);
    });
});

//---ajax--- Update restaurant
router.post('/admin/getStaff', function (req, res){
	
	var restID = req.body.id;

    knexSQL('chefs')
        .select()
        .leftJoin('jobcycle', 'chefs.jobCycle_id', 'jobcycle.cycleId')
        .where('restaurants_id', restID)
        .then(function(chefs){

	    knexSQL('restaurants')
	        .where({restaurantId: restID})
	        .then(function(rest){
        	
        	res.send({
        		chefs: chefs, 
        		scheduleIsReady: rest[0].scheduleIsReady
        	});
        });
    });
});

module.exports = router;