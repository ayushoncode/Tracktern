
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const shouldLogOtp = process.env.LOG_OTP === "true";
const shouldReturnOtp =
  process.env.ALLOW_OTP_IN_RESPONSE === "true" && process.env.NODE_ENV !== "production";

// 🔥 Generate OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const buildOtpResponse = (message, otp) => {
  const response = { message };

  if (shouldReturnOtp) {
    response.otp = otp;
  }

  return response;
};

const getTokenFromRequest = (req) => req.headers.authorization?.split(" ")[1];


// =============================
// 👉 REGISTER (send OTP)
// =============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const otp = generateOTP();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "User already exists" });
      }

      existingUser.name = name;
      existingUser.password = password;
      existingUser.otp = otp;
      existingUser.otpExpiry = Date.now() + 5 * 60 * 1000;
      await existingUser.save();
    } else {
      await User.create({
        name,
        email,
        password,
        isVerified: false,
        otp,
        otpExpiry: Date.now() + 5 * 60 * 1000,
      });
    }

    if (shouldLogOtp) {
      console.log(`🔐 Register OTP for ${email}: ${otp}`);
    }

    await sendEmail(email, "Verify your account", `Your OTP is ${otp}`);

    res.status(201).json(buildOtpResponse("OTP sent to email", otp));

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// =============================
// 👉 VERIFY OTP
// =============================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      message: "Account verified",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        streak: user.streak,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// 👉 LOGIN
// =============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    if (!user.isVerified)
      return res.status(401).json({ message: "Please verify email first" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        streak: user.streak,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// =============================
// 👉 FORGOT PASSWORD (send OTP)
// =============================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify email first" });
    }

    const otp = generateOTP();
    if (shouldLogOtp) {
      console.log(`🔐 Reset OTP for ${email}: ${otp}`);
    }

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(email, "Reset Password OTP", `Your OTP is ${otp}`);

    res.json(buildOtpResponse("OTP sent to email", otp));

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// 👉 RESET PASSWORD
// =============================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (!user.otpExpiry || user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.password = newPassword; // auto hashed by pre-save
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// 👉 GET CURRENT USER
// =============================
router.get("/me", async (req, res) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token)
      return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/change-password", async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    const { currentPassword, newPassword } = req.body;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});



module.exports = router;
