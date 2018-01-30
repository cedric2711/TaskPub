var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Task Login'
    });
});

router.post('/error', function(req, res, next) {
    res.render('index', {
        title: 'Task Login'
    });
});

module.exports = router;
