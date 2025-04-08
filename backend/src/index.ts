import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import cors from "cors";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Rate limiter configuration
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 OTP requests per windowMs
  message: 'Too many requests, please try again after 5 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many password reset attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});



const SECRET_KEY = process.env.SECRET_KEY;


app.use(cors());

// Store OTPs in a simple in-memory object
const otpStore: Record<string, string> = {};

// Endpoint to generate and log OTP
app.post('/generate-otp',otpLimiter, (req, res) => {
  console.log(req.body)
  const email = req.body.email;
  if (!email) {
     res.status(400).json({ message: "Email is required" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generates a 6-digit OTP
  otpStore[email] = otp;

  console.log(`OTP for ${email}: ${otp}`); // Log the OTP to the console
  res.status(200).json({ message: "OTP generated and logged" });
});

// Endpoint to reset password
app.post('/reset-password',passwordResetLimiter, async (req, res) => {
  const { email, otp, newPassword, token } = req.body;
  console.log(token);

  let formData = new FormData();
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }
	formData.append('secret', SECRET_KEY);
	formData.append('response', token);

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
	const result = await fetch(url, {
		body: formData,
		method: 'POST',
	});
  const challengeSucceeded = (await result.json()).success;
  console.log(challengeSucceeded);

  if (!challengeSucceeded) {
     res.status(403).json({ message: "Invalid reCAPTCHA token" });
  }

  if (!email || !otp || !newPassword) {
     res.status(400).json({ message: "Email, OTP, and new password are required" });
  }
  if (Number(otpStore[email]) === Number(otp)) {
    console.log(`Password for ${email} has been reset to: ${newPassword}`);
    delete otpStore[email]; // Clear the OTP after use
    res.status(200).json({ message: "Password has been reset successfully" });
  } else {
    res.status(401).json({ message: "Invalid OTP" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

