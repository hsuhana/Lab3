const mongoose = require("mongoose");
const schemaObj = {
    countryName: {type: String, required: true, trim: true, unique: true},
    currency: {type: String, required: true, trim: true}
}
const mongooseSchema = mongoose.Schema(schemaObj);
module.exports = mongoose.model("Country", mongooseSchema);