import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // Keep as String if stored in HH:mm
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: String, default: null }, // ✅ Changed from ObjectId to String
  meetingLink: { type: String, default: null }
});
const Slot = mongoose.model("Slot", SlotSchema);

export default Slot;