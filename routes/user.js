const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register 
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const user = new User({ username, password, email });
    await user.save();
    res.status(201).json({
      status: 'Account successfully created',
      status_code: 200,
      user_id: user._id
    });
  } catch (error) {
    res.status(400).json({
      status: 'Error registering user',
      status_code: 400,
      error: error.message
    });
  }
});

// Login 
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({
        status: 'Incorrect username/password provided. Please retry',
        status_code: 401,
      });
    }

    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });

    res.status(200).json({
      status: 'Login successful',
      status_code: 200,
      user_id: user._id,
      access_token: token
    });
  } catch (error) {
    res.status(500).json({
      status: 'Server error',
      status_code: 500,
      error: error.message
    });
  }
});

module.exports = router;
