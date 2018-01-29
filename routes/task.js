var express = require('express');
var router = express.Router();
debugger;

var tasksCol = require("../controllers/taskController.js");

// Get all tasks
router.get('/', tasksCol.list);

router.get('/getAll', tasksCol.getAll);

// Add Task
router.post('/add', tasksCol.add);

// filter Task
router.post('/filter', tasksCol.filter);


// Update single task
router.post('/updateSingle/:id', tasksCol.updateSingle);

// Delete task
router.post('/delete/:id', tasksCol.delete);

router.post('/delete/', tasksCol.deleteAll);

module.exports = router;
