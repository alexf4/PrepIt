/**
 * Created by alexf4 on 7/12/15.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var subcategorySchema = new Schema({
    subcategoryTitle: String

});


var subcategory = mongoose.model("subcategory", subcategorySchema);

module.exports = subcategory;