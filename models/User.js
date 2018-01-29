var mongoose = require("mongoose");
debugger;
var UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    updated_at: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('User', UserSchema);
