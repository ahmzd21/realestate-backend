// server/routes/sellerInquiryRoutes.js
const express = require('express');
const router = express.Router();
const SellerInquiry = require('../models/SellerInquiry'); // Import the model

// @route   POST api/seller-inquiries
// @desc    Submit a new seller inquiry
// @access  Public
router.post('/', async (req, res) => {
    try {
        const newInquiry = new SellerInquiry(req.body);
        await newInquiry.save();
        res.status(201).json({ message: 'Seller inquiry submitted successfully!', inquiry: newInquiry });
    } catch (err) {
        console.error('Error submitting seller inquiry:', err);
        // Mongoose validation errors will have an 'errors' object
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ message: 'Server error. Failed to submit inquiry.' });
    }
});

// @route   GET api/seller-inquiries
// @desc    Get all seller inquiries (for internal use/admin dashboard)
// @access  Public (for now, would be private/protected in production)
router.get('/', async (req, res) => {
    try {
        const inquiries = await SellerInquiry.find().sort({ createdAt: -1 }); // Sort by newest first
        res.json(inquiries);
    } catch (err) {
        console.error('Error fetching seller inquiries:', err);
        res.status(500).json({ message: 'Server error. Failed to retrieve inquiries.' });
    }
});

// You can add more routes here for getting a single inquiry, updating, deleting etc.

module.exports = router;