var express = require('express');
var router = express.Router();

//---ajax--- Add new chef
router.post('/admin/chefAdd', function (req, res){

	var name = req.body.name;
    var surname = req.body.surname;
    var patronymic = req.body.patronymic;
    var japskill = req.body.jap;
    var itaskill = req.body.ita;
    var russkill = req.body.rus;
    var cycle = req.body.cycle_id;
    var begin = req.body.begintime;
    var end = req.body.endtime;
    var restaurant = req.body.rest_id;

    knexSQL('restaurants')
        .where({restaurantId: restaurant})
        .update({scheduleIsReady: false})
        .then(function(rests){
    
    	knexSQL('chefs')
            .insert({
            	name: name,
            	surname: surname,
            	patronymic: patronymic,
            	hasJapSkills: japskill,
            	hasItaSkills: itaskill,
            	hasRusSkills: russkill,
            	daysBeginTime: begin,
            	daysEndTime: end,
            	jobCycle_id: cycle,
            	restaurants_id: restaurant
            })
            .then(function(chef){

            res.send(!!chef);
        });
    });
});

//---ajax--- get chef info
router.post('/admin/getChefInfo', function(req, res){

	var chefID = req.body.id;

	knexSQL('chefs')
        .select()
        .where({chefId: chefID})
        .leftJoin('restaurants', 'chefs.restaurants_id', 'restaurants.restaurantId')
        .leftJoin('jobcycle', 'chefs.jobCycle_id', 'jobcycle.cycleId')
        .orderBy('restaurantId', 'chefId')
        .then(function(chefs){

        res.send(chefs ? chefs[0] : chefs);
    });
});

//---ajax--- Delete chef
router.delete('/admin/chefDelete', function (req, res){
	
	var chefID = req.body.id;

    knexSQL('chefs')
        .where({chefId: chefID})
        .then(function(chefs){

        knexSQL('restaurants')
            .where({restaurantId: chefs[0].restaurants_id})
            .update({scheduleIsReady: false})
            .then(function(rests){

            knexSQL('chefs')
                .where({chefId: chefID})
                .del()
                .then(function(){

                res.send(true);
            });
        });
    });
});

//---ajax--- Update chef
router.post('/admin/chefUpdate', function (req, res){
	
	var chefID = req.body.id;
	var name = req.body.name;
    var surname = req.body.surname;
    var patronymic = req.body.patronymic;
    var japskill = req.body.jap;
    var itaskill = req.body.ita;
    var russkill = req.body.rus;
    var cycle = req.body.cycle_id;
    var begin = req.body.begintime;
    var end = req.body.endtime;
    var restaurant = req.body.rest_id;
    
    knexSQL('chefs')
        .select()
        .where({chefId: chefID})
        .then(function(chefs){

        var restId = chefs[0].restaurants_id;
        knexSQL('restaurants')
            .where("restaurantId", restId)
            .orWhere("restaurantId", restaurant)
            .update({scheduleIsReady: false})
            .then(function(rests){
            
            knexSQL('chefs')
                .where({chefId: chefID})
                .update({
                    name: name,
                    surname: surname,
                    patronymic: patronymic,
                    hasJapSkills: japskill,
                    hasItaSkills: itaskill,
                    hasRusSkills: russkill,
                    daysBeginTime: begin,
                    daysEndTime: end,
                    jobCycle_id: cycle,
                    restaurants_id: restaurant})
                .then(function(chef){

                res.send(!!chef);
            });
        });
    });
});

//---ajax--- Set schedule offset
router.post('/admin/setSchedule', function (req, res){
    
    var chefID = req.body.chefId;
    var restID = req.body.restId;
    var offset = req.body.offset;

    knexSQL('chefs')
        .where({chefId: chefID})
        .update({offsetSchedule: offset})
        .then(function(chef){

        knexSQL('restaurants')
            .where({restaurantId: restID})
            .update({scheduleIsReady: true})
            .then(function(rests){

            res.send(!!rests);
        });
    });
});

module.exports = router;