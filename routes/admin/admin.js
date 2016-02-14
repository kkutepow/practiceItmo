var express = require('express');
var router = express.Router();

// forward to 'adminView/index.ejs'
router.get('/admin', function (req, res) {   
    var chefCount, restCount;
    knexSQL('chefs')
        .select()
        .count()
        .then(function(chefs){

        for(var count in chefs[0]) { chefCount = chefs[0][count]; break; }    

        knexSQL('restaurants')
            .select()
            .count()
            .then(function(restaurants){

            for(var count in restaurants[0]) { restCount = restaurants[0][count]; break; }   

            res.render('adminView/index.ejs', {
                title: "Добро пожаловать",
                chefCount: chefCount,
                restCount: restCount
            });
        });
    });
});
// forward to 'adminView/restaurants.ejs'
router.get('/admin/restaurants', function (req, res) {   
    knexSQL('restaurants')
        .select()
        .then(function(restaurants){

        res.render('adminView/restaurants.ejs', {
            title: "Рестораны",
            restaurants: restaurants
        });
    });
});
// forward to 'adminView/chefs.ejs'
router.get('/admin/chefs', function (req, res) {   
    knexSQL('chefs')
        .select()
        .leftJoin('restaurants', 'chefs.restaurants_id', 'restaurants.restaurantId')
        .leftJoin('jobcycle', 'chefs.jobCycle_id', 'jobcycle.cycleId')
        .orderBy('restaurantId', 'chefId')
        .then(function(chefs){

        knexSQL('jobcycle')
            .select()
            .then(function(cycles){

            knexSQL('restaurants')
                .select()
                .then(function(restaurants){

                res.render('adminView/chefs.ejs', {
                    title: "Управление персоналом",
                    chefs: chefs,
                    cycles: cycles,
                    restaurants: restaurants
                });
            });
        });
    });
});
// forward to 'adminView/sсhedule.ejs'
router.get('/admin/schedule', function (req, res) {   
    knexSQL('restaurants')
        .select()
        .then(function(restaurants){

        res.render('adminView/schedule.ejs', {
            title: "Расписание",
            restaurants: restaurants
        });
    });
});

module.exports = router;