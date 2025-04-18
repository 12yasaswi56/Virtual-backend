import mongoose from "mongoose";

const startupSchema = new mongoose.Schema({
  startupName: { type: String, required: true },
  founderName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  industry: { type: String, required: true },
  description: { type: String, required: true },
  stage: { type: String, required: true },
  personalNote: { type: String },
  pptFile: { type: String }, // Store file path or URL
}, { timestamps: true });

const Startup = mongoose.model("Startup", startupSchema);

export default Startup;