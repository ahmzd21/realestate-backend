// src/server/controllers/contactController.js
const ContactMessage = require('../models/ContactMessage'); // Import the ContactMessage model

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation (more robust validation can be added with libraries like 'express-validator')
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please enter all required fields: Name, Email, and Message.' });
    }

    // Create a new contact message instance
    const newContactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
    });

    // Save the message to the database
    await newContactMessage.save();

    res.status(201).json({ success: true, message: 'Your message has been sent successfully! We will get back to you shortly.' });

  } catch (error) {
    console.error('Error submitting contact message:', error);
    // Handle specific Mongoose validation errors if necessary
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};