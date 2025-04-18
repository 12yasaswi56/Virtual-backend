import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  nationality: String,
  email: { type: String, unique: true, required: true },
  mobile: String,
  password: String,
  otp: String,
  otpExpires: Date, // ✅ OTP expiration time
  isVerified: { type: Boolean, default: false },

  // Password Reset Fields
  passwordResetToken: String,  // ✅ Stores the last used reset token
  passwordResetExpires: Date,  // ✅ Expiration time for reset token
});


const User = mongoose.model("User", userSchema);
export default User;