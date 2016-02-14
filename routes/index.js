var express = require('express');
var router = express.Router();

/* ======= index.ejs (Главная) ======= */
router.get('/', function(req, res, next) {
    res.render('adminView/index.ejs', {
        title: "Добро пожаловать"
    });
});

module.exports = router;
