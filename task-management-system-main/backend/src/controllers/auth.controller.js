const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

// ================= GENERATE JWT TOKEN =================
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// ================= REGISTER USER =================
const register = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    console.log('Register attempt:', {
      name,
      email,
      role
    });

    // ================= VALIDATION =================
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // ================= CHECK EXISTING USER =================
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // ================= HASH PASSWORD =================
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_ROUNDS) || 10
    );

    // ================= CREATE USER =================
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    console.log('User registered successfully');

    // ================= RESPONSE =================
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id)
      }
    });

  } catch (error) {

    console.error('Register error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= LOGIN USER =================
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    // ================= VALIDATION =================
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // ================= FIND USER =================
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // ================= CHECK PASSWORD =================
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('User logged in:', user.email);

    // ================= RESPONSE =================
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });

  } catch (error) {

    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET CURRENT USER =================
const getMe = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {

    console.error('GetMe error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};