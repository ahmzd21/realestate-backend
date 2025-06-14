// server/models/SellerInquiry.js
const mongoose = require('mongoose');

const SellerInquirySchema = new mongoose.Schema({
    // Property Details (from AddPropertyPage + your SellPage)
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    price: { // Changed from askingPrice for consistency with Property model
        type: Number,
        required: true,
        min: 0
    },
    bedrooms: {
        type: Number,
        min: 0
    },
    bathrooms: {
        type: Number,
        min: 0
    },
    area: { // Area can be a string (e.g., "10 Marla", "2500 Sq. Ft.")
        type: String,
        required: true,
        trim: true
    },
    type: { // propertyType in your SellPage
        type: String,
        required: true,
        enum: ['House', 'Apartment', 'Plot', 'Commercial', 'Farmhouse']
    },
    status: { // Default status for an inquiry
        type: String,
        default: 'Pending Review', // e.g., 'Pending Review', 'Contacted', 'Approved'
        enum: ['Pending Review', 'Contacted', 'Approved', 'Rejected']
    },
    image: { // Image URL provided by seller
        type: String,
        default: 'https://via.placeholder.com/400x300/F0F2F5/CCCCCC?text=No+Image'
    },
    description: {
        type: String,
        required: true,
        minlength: 20
    },
    amenities: { // Array of strings (e.g., 'Parking', 'Gym')
        type: [String],
        default: []
    },

    // Seller Contact Information (from your SellPage)
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    preferredContactMethod: {
        type: String,
        enum: ['Email', 'Phone', 'Any'],
        default: 'Any'
    },
    bestTimeToContact: {
        type: String, // e.g., "Morning", "Afternoon", "Evening"
        default: ''
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update 'updatedAt' field on save
SellerInquirySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const SellerInquiry = mongoose.model('SellerInquiry', SellerInquirySchema);

module.exports = SellerInquiry;