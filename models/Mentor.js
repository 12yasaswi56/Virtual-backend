import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  expertise: { type: String, required: true, trim: true },
  experience: { type: Number, required: true },
  bio: { type: String, required: true, trim: true },
  linkedin: { type: String, trim: true },
  resume: { type: String, required: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Approved", "Rejected"] },
  isAvailable: { type: Boolean, default: false },
  appliedAt: { type: Date, default: Date.now },
});

const Mentor = mongoose.model("Mentor", mentorSchema);

export default Mentor;