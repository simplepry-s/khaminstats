const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var dateFormat = require('dateformat');
var now = new Date();
 
const getDate = dateFormat(now, "yyyy-mm-dd");


//Create Schema

const StatSchema = new Schema({
    stats: {
        type: Number,//
        require: true
    },
    date: {
        type: Date,
        default: getDate
    }
});

module.exports = stats = mongoose.model('stats',StatSchema);