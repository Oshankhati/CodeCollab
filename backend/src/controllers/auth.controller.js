
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// 🔥 DEBUG (remove later)
console.log("SMTP CONFIG:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
});

// ✅ Brevo SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🚀 NON-BLOCKING EMAIL (DO NOT WAIT)
    setTimeout(() => {
      transporter.sendMail({
        from: `"CodeCollab" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Welcome to CodeCollab 🚀",
        html: `
          <div style="font-family: Arial;">
            <h2>Welcome to CodeCollab, ${user.name} 🎉</h2>
            <p>You can now collaborate in real-time 🚀</p>
          </div>
        `,
      })
      .then(() => console.log("✅ Welcome email sent"))
      .catch((err) => console.log("⚠️ Email failed (ignored):", err.message));
    }, 0);

    // ✅ Instant response (no waiting)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};


// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 🚀 TRY EMAIL (but NEVER depend on it)
    setTimeout(() => {
      transporter.sendMail({
        from: `"CodeCollab" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Reset Your Password - CodeCollab",
        html: `
          <div style="font-family: Arial;">
            <h2>Password Reset</h2>
            <p>Click below to reset your password:</p>
            <a href="${resetUrl}" 
               style="padding:10px 20px;background:#1976d2;color:#fff;text-decoration:none;border-radius:5px;">
               Reset Password
            </a>
            <p>This link expires in 15 minutes.</p>
          </div>
        `,
      })
      .then(() => console.log("✅ Reset email sent"))
      .catch((err) => console.log("⚠️ Email failed (ignored):", err.message));
    }, 0);

    // 🔥 ALWAYS return reset link (NO WAIT)
    res.json({
      message: "Reset link generated successfully",
      resetLink: resetUrl,
    });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reset password failed" });
  }
};