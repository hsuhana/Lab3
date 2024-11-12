// Naming convention for models: use singular form of the represented entity
// Import mongoose
const mongoose = require("mongoose");
// Define data schema (JSON)
const dataSchemaObj = {
  budget: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
  status: { type: String, enum: ["haven't been there", "completed", "canceled"], default: "haven't been there" },
};
// Create mongoose schema
const travelPlanSchema = mongoose.Schema(dataSchemaObj);
// Create and import mongoose model
module.exports = mongoose.model("TravelPlan", travelPlanSchema);