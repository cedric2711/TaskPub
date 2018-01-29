function drawPage() {
    var url = "/task/getAll/?user=" + getUser();
    $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        success: function(data) {

            $('.taskToShow').render('/tasks/taskView.ejs', {
                taskList: data
            })
            registerEvents();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });
}

function getUser() {
    return $('.userName').html().trim();
}

function deleteAll() {
    var url = '/task/delete/';
    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        success: function(data) {
            debugger;

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });
}

function drawTasks(tasks) {
    $('.taskToShow').render('/tasks/taskView.ejs', {
        taskList: tasks
    })
    registerEvents();
}

function updateData(id, key, value) {
    var url = "/task/updateSingle/" + id + '?key=' + key + '&value=' + value;
    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        success: function(data) {
            debugger;
            $('#' + id + ' .' + key + 'Button button').html(value);
            //registerEvents();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });
}

function addSubTask(id, textVal) {
    var url = '';
    if (id != '') {
        url = '/task/add/?id=' + id;
    } else {
        url = '/task/add/?name=' + textVal;
    }
    url += "&user=" + getUser();
    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        success: function(data) {
            debugger;
            drawTasks(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });
}

function deleteTask(id) {
    var url = '/task/delete/' + id + '&user=' + getUser();
    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        success: function(data) {
            debugger;
            totalDeleted++;
            if (totalDeleted == idToDelete.length)
                drawTasks(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });
}

function filterData(status, priority) {
    var url = '';

    url = '/task/filter/?status=' + status + '&priority=' + priority + '&user=' + getUser();

    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        success: function(data) {
            debugger;
            drawTasks(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error', errorThrown);
        }
    });
}
var idToDelete = [],
    totalDeleted = 0;

function registerEvents(calledOnce) {
    $('.name').change(function() {
        console.log('ddd');
        var reID = getTaskId(this);
        updateData(reID, 'name', this.value);
    });
    $('.statusButton .dropdown-item').on('click', function() {
        console.log('dropdown');
        var reID = getTaskId(this);
        updateData(reID, 'status', this.getAttribute('data-value'));
    });
    $('.priorityButton .dropdown-item').on('click', function() {
        console.log('dropdown');
        var reID = getTaskId(this);
        updateData(reID, 'priority', this.getAttribute('data-value'));
    });
    $('.addSubTask').on('click', function() {
        console.log('add sub task');
        var reID = getTaskId(this);
        addSubTask(reID);
    });
    $('.deleteTask').on('click', function() {
        console.log('add sub task');
        idToDelete = [];
        totalDeleted = 0;
        var reID = getTaskId(this);
        getIdToDelete(reID);
        for (var i = 0; i < idToDelete.length; i++) {
            deleteTask(idToDelete[i]);
        }

    });
    if (calledOnce) {
        $('.addTask').on('click', function() {
            console.log('add task');

            addSubTask('', $('#taskName').val());
            $('#taskName').val('');
        });
        $('.statusButtonFilter .dropdown-item').on('click', function() {
            $('#statusFilter').html(this.getAttribute('data-value'))
            filterData(this.getAttribute('data-value'), $('#priorityFilter').html())
        });
        $('.priorityButtonFilter .dropdown-item').on('click', function() {
            console.log('dropdown');
            $('#priorityFilter').html(this.getAttribute('data-value'))
            filterData($('#statusFilter').html(), this.getAttribute('data-value'))
        });
        $('.clearFilterButton').on('click', function() {
            console.log('dropdown');
            $('#priorityFilter').html('');
            $('#statusFilter').html('');
            drawPage();
        });


    }

}

function getIdToDelete(parentId) {
    idToDelete.push(parentId);
    var obj = $('[data-parent=' + parentId + ']');
    if (obj.length == 0) return;
    _.each(obj, function(rowBock, rowIndex) {
        debugger;
        getIdToDelete(rowBock.id);
    });
}

function getTaskId(curEl) {
    var parent = curEl;
    do {
        parent = parent.parentElement;
    } while (parent.className.indexOf('taskBlock') == -1)
    return parent.id;
}
setTimeout(function() {
    registerEvents(true);
}, 2000);
