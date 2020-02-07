var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

var cb = function(err) {
    if(err) {
        console.log("connection failled!");
    }
    else {
        console.log('connection successfully!');
    }
};


mongoose.connect('mongodb://localhost:27017/foodrecipe', cb); //mongoDB localhost 27017 port
const con = mongoose.connection;
module.exports = {mongoose};