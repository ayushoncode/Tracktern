const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },

  skills: { type: [String], default: [] },
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastAppliedDate: { type: Date, default: null },

  // ✅ ADD THESE (OTP + verification)
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date }

}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = mongoose.model("User", userSchema);