var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var {user} = require('./model');

var recipeSchema = new Schema({ //similar like SQL table enities
    foreign_id:
       { 
           type: Schema.Types.ObjectId, ref: 'user',
           required: true
       },
    imgName: {
        type: String
    },
    title: {
        type: String
    },
    categoryName: {
        type: String
    },
    ingrediants:
    {
        type: Array
    }
});

var recipe = mongoose.model('recipe', recipeSchema);
module.exports = {recipe};