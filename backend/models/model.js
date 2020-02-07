var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({ //similar like SQL table entities
    email: {
        type: String,
        unique: true,
        required: true
    },
    pswd: {
        type: String,
        required: true
    },
    name: {
        type: String
    }
});

var user = mongoose.model('user', userSchema);

module.exports = {user};