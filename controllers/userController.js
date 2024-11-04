//userController
const User = require('../model/userSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecretKey = "ananthu123"
const mongoose = require('mongoose');
const crypto = require('crypto');

const nodemailer = require('nodemailer'); // For sending email




const createUser = async (req, res) => {
   
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            res.status(409).json({ error: "Email already exists." });
        }

        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        await User.create({
            name: req.body.name,
            location: req.body.location,
            email: req.body.email,
            password: hashedPassword
        });

        res.send("user created successfully")

     
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: "An error occurred" });
    }
};



const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            if (user.banned) {
                return res.status(403).json({ error: 'User is banned', success: false }); // Forbidden status
            }
            const comparePwd = await bcrypt.compare(req.body.password, user.password);

            if (comparePwd) {
                const authToken = jwt.sign({ email: user.email, userId: user._id }, jwtSecretKey, { expiresIn: '1d' });

                res.json({ 
                    success: true, 
                    authToken, 
                    userId: user._id, 
                    username: user.name 
                });
            } else {
                res.status(400).json({ error: 'Incorrect password!', success: false });
            }
        } else {
            res.status(404).json({ error: 'User not found', success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "An error occurred" });
    }
};

const banUser = async (req, res) => {
    try {
        const { userId } = req.params; // Ensure you are using params correctly
        const user = await User.findByIdAndUpdate(userId, { banned: true }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User banned successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while banning the user" });
    }
};

const unbanUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if the userId is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findByIdAndUpdate(userId, { banned: false }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User unbanned successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while unbanning the user" });
    }
};




// Set up nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
      user: 'ananthua025@gmail.com', // Your email
      pass: 'nlqs nfrf ywca xkfs' // Your email password (or an app-specific password if using Gmail)
    }
  });
  
  // Forgot Password Logic
  const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'Email not found' });
      }
  
      // Generate a reset token
      const token = crypto.randomBytes(20).toString('hex');
  
      // Set token and expiry time
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
  
      await user.save();
  
      // Send reset email
      const resetUrl = `http://localhost:3000/reset-password/${token}`; // Frontend reset password URL
  
      const mailOptions = {
        from: 'z', // Your email
        to: user.email,
        subject: 'Password Reset Request',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          ${resetUrl}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };
  
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Error sending email' });
        } else {
          return res.json({ success: true, message: 'Reset email sent successfully' });
        }
      });
    } catch (error) {
        console.error('Forgot password error:', error); 
              res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };
  
  // Reset Password Route
  const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() } // Check if token is still valid
      });
  
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired token' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update user's password and remove the reset token
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      res.json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };
module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    banUser,
    unbanUser,
    forgotPassword, 
    resetPassword 
};