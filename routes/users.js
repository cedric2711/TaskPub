var express = require('express');
var router = express.Router();
var userCol = require("../controllers/userController.js");
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/validate', userCol.validate);

router.post('/add', userCol.add);
router.get('/list', userCol.list);

module.exports = router;
