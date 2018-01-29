var mongoose = require("mongoose");
debugger;
var TaskSchema = new mongoose.Schema({
    name: String,
    status: String,
    priority: String,
    parent: String,
    user: String,
    updated_at: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('Tasks', TaskSchema);
