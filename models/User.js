// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Will use this for pre-save hashing

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'] // Basic email regex validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Minimum password length
  },
  // You can add more fields here like roles, profile picture, etc.
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;