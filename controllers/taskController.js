var mongoose = require("mongoose");
var _ = require("underscore-node");
debugger;
//var Tasks = mongoose.model("Tasks");
var Tasks = require('../models/Tasks.js');
var taskController = {};
var newOrder = [];
var taskObj = {};

function nestData(tasks) {
    newTaskOrder = [];
    taskObj = {};
    _.each(tasks, function(task) {
        if (task.parent == '' || task.parent == null) {
            if (_.isUndefined(taskObj[''])) {
                taskObj[''] = {};
            }
            taskObj[''][task._id] = {
                'name': task.name,
                'status': task.status,
                'priority': task.priority,
                'parent': task.parent,
                'user': task.user,
                '_id': task._id,
                'children': {},
                '_level': 0
            }
        } else {
            if (_.isUndefined(taskObj[task.parent])) {
                taskObj[task.parent] = {};
            }
            taskObj[task.parent][task._id] = {
                'name': task.name,
                'status': task.status,
                'priority': task.priority,
                'parent': task.parent,
                'user': task.user,
                '_id': task._id,
                'children': {},
                '_level': 0
            }
        }
    });
    _.each(taskObj[''], function(parentRow, parentId) {
        newTaskOrder.push(parentRow);
        getChildren(parentRow, parentId);

    });

    function getChildren(parentRow, parentId) {
        _.each(taskObj[parentId], function(childObj, childId) {
            parentRow.children[childId] = childObj;
            childObj._level = parentRow._level + 1;
            newTaskOrder.push(childObj);
            if (taskObj[childId]) {
                getChildren(childObj, childId);
            }
        });
    }
    return newTaskOrder;
}
taskController.list = function(req, res) {
    Tasks.find({
        'user': req.query.user
    }).exec(function(err, tasks) {
        if (err) {
            console.log("Error:", err);
        } else {
            debugger;
            var user = '';
            if (req.query.user != '') {
                user = req.query.user;
            } else {
                res.redirect("/");
            }
            var orderedTasks = nestData(tasks)
            res.render("../views/tasks/index", {
                task: orderedTasks,
                user: user
            });
        }
    });
};
taskController.getAll = function(req, res) {
    Tasks.find({
        'user': req.query.user
    }).exec(function(err, tasks) {
        if (err) {
            console.log("Error:", err);
        } else {
            var orderedTasks = nestData(tasks)
            res.json(orderedTasks);
        }
    });
};

taskController.filter = function(req, res) {
    debugger;
    var query = {};
    if (req.query.status != '') {
        query['status'] = req.query.status;
    }
    if (req.query.priority != '') {
        query['priority'] = req.query.priority;
    }
    query['user'] = req.query.user;

    Tasks.find(query).exec(function(err, tasks) {
        if (err) {
            console.log("Error:", err);
        } else {
            var orderedTasks = nestData(tasks)
            res.json(orderedTasks);
        }
    });
};


taskController.add = function(req, res) {
    debugger;
    var parentID = (req.query.id != undefined) ? req.query.id : '';
    var name = (req.query.name != undefined) ? req.query.name : '';
    var data = {
        name: name,
        status: "New",
        priority: "Medium",
        parent: parentID,
        user: req.query.user
    }
    var task = new Tasks(data);
    task.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("successfully added task");
            res.redirect("/task/getAll/?user=" + req.query.user);
        }
    });
};



taskController.updateSingle = function(req, res) {
    debugger;
    var requiedSet = {};
    requiedSet[req.query.key] = req.query.value;
    Tasks.findByIdAndUpdate(req.params.id, {
        $set: requiedSet
    }, {
        new: true
    }, function(err, task) {
        if (err) {
            console.log(err);

        }
        req.query.key;
        console.log("update completed");
        if (req.query.key != 'name') {
            res.json({
                "val": req.query.value,
                "key": req.query.key,
                "id": req.params.id
            });
        }

    });
};

taskController.delete = function(req, res) {
    Tasks.remove({
        _id: req.params.id
    }, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Tasks deleted!");
            res.redirect("/task/getAll/?user=" + req.query.user);
        }
    });
};

taskController.deleteAll = function(req, res) {
    mongoose.connection.collections['tasks'].drop(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('collection dropped');
        }
    });
};

module.exports = taskController;
