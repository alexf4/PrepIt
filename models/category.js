/**
 * Created by alexf4 on 7/12/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var categorySchema = new Schema({
    Title: String,
    TestPercent : Number
    //subcategories : [{ type : mongoose.Schema.Types.ObjectId, ref: 'subcategory' }]

});

module.exports = mongoose.model("category", categorySchema);