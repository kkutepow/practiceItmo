var express = require('express');
var router = express.Router();

/* ======= index.ejs (Главная) ======= */
router.get('/', function(req, res, next) {
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

module.exports = router;
