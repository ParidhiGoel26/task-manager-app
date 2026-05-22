const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }

}, {
  timestamps: true
});

// IMPORTANT:
// No bcrypt hashing here because
// hashing is already done in auth.controller.js

module.exports = mongoose.model('User', userSchema);