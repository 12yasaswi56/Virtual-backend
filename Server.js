import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from './models/User.js';
import Slot from "./models/Slot.js";
import Startup from "./models/Startup.js";
import Mentor from "./models/Mentor.js";
import axios from "axios";
import { google } from "googleapis";
import { fileURLToPath } from "url";
import moment from "moment-timezone"
import jwt from "jsonwebtoken";
import multer from "multer";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import path from "path";
dotenv.config();
import helmet from 'helmet';

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const corsOptions = {
//   origin: "https://yasaswi-v-frontend-1g3b.vercel.app/", // Only allow your frontend
//   methods: ["GET", "POST","PUT"], // Restrict to only necessary methods
//   allowedHeaders: ["Content-Type", "Authorization"], // Only allow specific headers
//   credentials: true, // Allow cookies if needed
//   optionsSuccessStatus: 204 // Handle preflight requests efficiently
// };

const corsOptions = {
  origin: ["https://yasaswi-v-frontend-1g3b.vercel.app","http://localhost:5173"], // ✅ No trailing slash!
  methods: ["GET", "POST", "PUT", "DELETE"], // Add DELETE if needed
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};



app.use(cors(corsOptions));


// cimport helmet from "helmet";onst helmet = require("helmet");

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"], // Allow only same-origin content
//         scriptSrc: [
//           "'self'",
//           "'unsafe-inline'", // If inline scripts are used
//           "https://apis.google.com", // Google APIs
//           "https://virtual-frontend-six.vercel.app", // Your frontend
//         ],
//         styleSrc: [
//           "'self'",
//           "'unsafe-inline'", // Inline styles (needed for some libraries)
//           "https://fonts.googleapis.com", // Google Fonts
//         ],
//         imgSrc: [
//           "'self'",
//           "data:", // Allow images from base64 data
//           "https://your-image-source.com", // If you're fetching images externally
//           "https://virtual-frontend-six.vercel.app",
//         ],
//         connectSrc: [
//           "'self'",
//           "https://virtual-frontend-six.vercel.app", // Allow API requests from frontend
//           "wss://virtual-backend-4.onrender.com", // WebSockets for real-time communication
//         ],
//         frameSrc: [
//           "'self'",
//           "https://www.youtube.com", // Allow embedding YouTube videos
//         ],
//         fontSrc: [
//           "'self'",
//           "https://fonts.gstatic.com", // Google Fonts
//         ],
//         objectSrc: ["'none'"], // Block plugin content (e.g., Flash)
//         upgradeInsecureRequests: [], // Upgrade HTTP to HTTPS
//       },
//     },
//   })
// );

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

app.get("/", (req, res) => {
  res.send("Backend is working fine");
});

// 📌 Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));





// const userSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   nationality: String,
//   email: { type: String, unique: true, required: true },
//   mobile: String,
//   password: String,
//   otp: String,
//   otpExpires: Date, // ✅ OTP expiration time
//   isVerified: { type: Boolean, default: false },

//   // Password Reset Fields
//   passwordResetToken: String,  // ✅ Stores the last used reset token
//   passwordResetExpires: Date,  // ✅ Expiration time for reset token
// });


// const User = mongoose.model("User", userSchema);



// const SlotSchema = new mongoose.Schema({
//   date: { type: Date, required: true },
//   startTime: { type: String, required: true }, // Keep as String if stored in HH:mm
//   endTime: { type: String, required: true },
//   isBooked: { type: Boolean, default: false },
//   bookedBy: { type: String, default: null }, // ✅ Changed from ObjectId to String
//   meetingLink: { type: String, default: null }
// });
// const Slot = mongoose.model("Slot", SlotSchema);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and JPEG files are allowed."));
    }
  },
});

// API endpoint to handle contact form submission
app.post('/contact', upload.single('file'), (req, res) => {
  try {
    // Extract form data
    const { firstName, lastName, email, contactNumber, gender, profession, state, city, queryType, comments } = req.body;
    const file = req.file;

    // Check if all required fields are present
    if (!firstName || !lastName || !email || !contactNumber || !comments || !file) {
      return res.status(400).json({ message: 'Please fill all the required fields.' });
    }

    // Simulate saving form data (for example, saving to database)
    console.log("Form Data:", req.body);
    console.log("Uploaded File:", file);

    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: 'There was an issue processing your request.' });
  }
});




// //schema for startUp
// const startupSchema = new mongoose.Schema({
//   startupName: String,
//   founderName: String,
//   email: String,
//   phone: String,
//   industry: String,
//   description: String,
// });

// const startupSchema = new mongoose.Schema({
//   startupName: { type: String, required: true },
//   founderName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   industry: { type: String, required: true },
//   description: { type: String, required: true },
//   stage: { type: String, required: true },
//   personalNote: { type: String },
//   pptFile: { type: String }, // Store file path or URL
// }, { timestamps: true });

// const Startup = mongoose.model("Startup", startupSchema);


app.post("/startup", upload.single("pptFile"), async (req, res) => {
  try {
    const { startupName, founderName, email, phone, industry, description, stage, personalNote } = req.body;
    const pptFile = req.file ? req.file.path : null; // Store file path

    const newStartup = new Startup({
      startupName,
      founderName,
      email,
      phone,
      industry,
      description,
      stage,
      personalNote,
      pptFile
    });

    await newStartup.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/startup", async (req, res) => {
  try {
    const startups = await Startup.find();
    res.status(200).json(startups);
  } catch (error) {
    console.error("Error fetching startups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// const mentorSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   phone: { type: String, required: true, trim: true },
//   expertise: { type: String, required: true, trim: true },
//   experience: { type: Number, required: true },
//   bio: { type: String, required: true, trim: true },
//   linkedin: { type: String, trim: true },
//   resume: { type: String, required: true },
//   status: { type: String, default: "Pending", enum: ["Pending", "Approved", "Rejected"] },
//   isAvailable: { type: Boolean, default: false },
//   appliedAt: { type: Date, default: Date.now },
// });

// const Mentor = mongoose.model("Mentor", mentorSchema);

app.post("/mentor-apply", async (req, res) => {
  try {
    console.log("Received Mentor Data:", req.body); // Debugging Step

    let { name, email, phone, expertise, experience, bio, linkedin, resume } = req.body;

    if (!name || !email || !phone || !expertise || !experience || !bio || !resume) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({ message: "Mentor with this email already applied." });
    }

    const experienceNumber = Number(experience); // Ensure experience is stored as a number
    if (isNaN(experienceNumber)) {
      return res.status(400).json({ message: "Experience must be a valid number." });
    }

    const mentor = new Mentor({ 
      name, 
      email, 
      phone, 
      expertise, 
      experience: experienceNumber, 
      status: "Pending", // Correct capitalization
      isAvailable: false, // Fix field name
      bio, 
      linkedin, 
      resume 
    });

    console.log("Mentor being saved:", mentor); // Debugging Step

    await mentor.save();
    res.status(201).json({ message: "Mentor application submitted successfully!" });
  } catch (error) {
    console.error("Error saving mentor:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});


// Endpoint to fetch all mentor applications (for admin)
app.get("/mentor-applications", async (req, res) => {
  try {
    // Fetch all mentor applications from the database
    const applications = await Mentor.find();
    res.status(200).json(applications);
  } catch (err) {
    console.error("Error fetching mentor applications:", err);
    res.status(500).json({ message: "Error fetching mentor applications." });
  }
});





// Update mentor status (Approved, Pending, Rejected)
app.put("/update-status", async (req, res) => {
  const { email, status } = req.body;

  // Ensure only valid statuses are accepted
  const validStatuses = ["Approved", "Pending", "Rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const mentor = await Mentor.findOneAndUpdate(
      { email },
      { 
        status, 
        isAvailable: status === "Approved" // Automatically available only if approved
      },
      { new: true } // Return updated document
    );

    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    res.json({ message: `Mentor status updated to ${status}`, mentor });
  } catch (error) {
    console.error("Error updating mentor status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update mentor availability (Only for approved mentors)
app.put("/update-availability", async (req, res) => {
  const { email, isAvailable } = req.body;

  try {
    const mentor = await Mentor.findOne({ email });
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    if (mentor.status !== "Approved") {
      return res.status(400).json({ message: "Only approved mentors can change availability" });
    }

    mentor.isAvailable = isAvailable;
    await mentor.save();

    res.json({ message: `Availability updated to ${isAvailable}`, mentor });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Server error" });
  }
});







// 📌 Generate OTP function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 📩 Send OTP Email
const sendOTPEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log("Email sent: " + info.response);
  });
};


// 📝 Register Route
app.post("/register", async (req, res) => {
  const { firstName, lastName, nationality, email, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const newUser = new User({
      firstName,
      lastName,
      nationality,
      email,
      mobile,
      password: hashedPassword,
      otp,
      isVerified: false,
    });

    await newUser.save();

    sendOTPEmail(email, otp);
    res.status(201).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});



app.post("/assign-mentor", async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) return res.status(400).json({ message: "User is required" });

    // ✅ Find an available and approved mentor
    const mentor = await Mentor.findOne({ isAvailable: true, status: "Approved" });

    if (!mentor) {
      return res.status(404).json({ message: "No available mentors at the moment" });
    }

    return res.status(200).json({ mentor });
  } catch (error) {
    console.error("Error assigning mentor:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// 🔹 OTP Verification Route
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.json({ message: "Verification successful, you can now login" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 🔐 Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { firstName: user.firstName, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 🔄 Forgot Password Route
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `https://yasaswi-v-frontend-1g3b.vercel.app/Resetpassword?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>This link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset link has been sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Try again later." });
  }
});

// 🔄 Reset Password Route

app.post("/Resetpassword", async (req, res) => {
  const { token, newPassword } = req.body;

  // Validate input
  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is correctly used
    console.log("Decoded Token:", decoded); // Debug: Check if the token is correctly decoded

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Invalid token or user does not exist" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error:", error.message); // Log error to debug
    res.status(400).json({ message: "Invalid or expired token" });
  }
});



app.get("/slots", async (req, res) => {
  try {
      const currentDate = moment().startOf("day").toDate(); // Convert to Date object
      const currentTime = moment().toDate(); // Get current time as Date object

      const availableSlots = await Slot.find({
          isBooked: false,
          $or: [
              { date: { $gt: currentDate } }, // Future dates
              { date: currentDate, endTime: { $gt: currentTime } } // Today's remaining slots
          ],
      });

      // ✅ If no slots exist, generate slots for the next 7 days
      if (availableSlots.length === 0) {
          const timeSlots = ["10:00", "11:30", "14:00", "15:30"];
          const slotsToInsert = [];

          for (let i = 0; i < 7; i++) {
              const date = moment().add(i, "days").startOf("day").toDate();

              for (const time of timeSlots) {
                  const startTime = moment(date).set({ 
                      hour: parseInt(time.split(":")[0]), 
                      minute: parseInt(time.split(":")[1])
                  }).toDate();

                  const endTime = moment(startTime).add(1, "hour").toDate();

                  slotsToInsert.push({ date, startTime, endTime, isBooked: false });
              }
          }

          await Slot.insertMany(slotsToInsert);
          return res.json(slotsToInsert);
      }

      res.json(availableSlots);
  } catch (error) {
      res.status(500).json({ message: "Server Error", error });
  }
});


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email
    pass: process.env.EMAIL_PASS, // Use App Password (if using Gmail)
  },
});



// import moment from 'moment' ;// Import moment.js for date comparison

app.get("/AdminMeetings", async (req, res) => {
  try {
    const currentDateTime = moment();
    const meetings = await Slot.find({
      isBooked: true,
      $or: [
        { date: { $gt: currentDateTime.format("YYYY-MM-DD") } },
        { 
          date: currentDateTime.format("YYYY-MM-DD"),
          endTime: { $gte: currentDateTime.format("HH:mm") }  // ✅ Fix: Ensure stored format matches
        }
      ]
    }).select("date startTime bookedBy meetingLink");

    // ✅ Convert `startTime` and `endTime` to HH:mm before sending response
    const formattedMeetings = meetings.map(meeting => ({
      ...meeting._doc,
      startTime: moment(meeting.startTime).format("HH:mm"),
      // endTime: moment(meeting.endTime).format("HH:mm"),
    }));

    res.json(formattedMeetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
});



 import { v4 as uuidv4 } from "uuid"; // Correct import syntax


 // Generate Zoom Access Token
// ✅ Generate Zoom Access Token
const getZoomAccessToken = async () => {
  try {
    const response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "account_credentials",
        account_id: process.env.ZOOM_ACCOUNT_ID,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("❌ Error fetching Zoom access token:", error.response?.data || error.message);
    throw new Error("Failed to get Zoom token");
  }
};

// ✅ Create a Zoom Meeting
const createZoomMeeting = async (userEmail) => {
  try {
    const token = await getZoomAccessToken();
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Scheduled Meeting",
        type: 2,
        start_time: new Date().toISOString(),
        duration: 30,
        timezone: "UTC",
        agenda: "Mentor session",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          approval_type: 0, // No manual approval needed
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.join_url;
  } catch (error) {
    console.error("❌ Error creating Zoom meeting:", error.response?.data || error.message);
    throw new Error("Failed to create Zoom meeting");
  }
};

// ✅ Send Email with Zoom Link
const sendConfirmationEmail = async (userEmail, zoomLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your Scheduled Zoom Meeting",
      text: `Hello,\n\nYour meeting is scheduled. Join here: ${zoomLink}\n\nThank you!`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Error sending email:", error.response?.data || error.message);
    throw new Error("Failed to send email");
  }
};


app.post("/book-slot", async (req, res) => {
  const { slotId, userEmail } = req.body;

  try {
    // Fetch the slot
    const slot = await Slot.findById(slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: "Slot not available" });
    }

    // Convert startTime & endTime correctly
    const slotDate = slot.date.toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format
    const startTimeFormatted = moment(`${slotDate} ${slot.startTime}`, "YYYY-MM-DD HH:mm").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const endTimeFormatted = moment(`${slotDate} ${slot.endTime}`, "YYYY-MM-DD HH:mm").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    // Create Zoom meeting link
    const zoomLink = await createZoomMeeting(userEmail);

    // Update the slot
    slot.isBooked = true;
    slot.bookedBy = userEmail; // ✅ Store as string
    slot.startTime = new Date(startTimeFormatted); // ✅ Convert to Date
    slot.endTime = new Date(endTimeFormatted); // ✅ Convert to Date
    slot.meetingLink = zoomLink;
    await slot.save();

    // Send confirmation email
    await sendConfirmationEmail(userEmail, zoomLink);

    res.json({ message: "Slot booked successfully!", zoomLink });
  } catch (error) {
    console.error("❌ Error booking slot:", error);
    res.status(500).json({ message: "Error booking slot", error: error.message });
  }
});






// 🚀 Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
