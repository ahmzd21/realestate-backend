// src/server/models/Property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  bedrooms: { type: Number, min: 0 },
  bathrooms: { type: Number, min: 0 },
  area: { type: Number, min: 0 }, // in sqft or sq meters
  propertyType: {
    type: String,
    required: true,
    enum: ['House', 'Apartment', 'Villa', 'Plot', 'Commercial', 'Farmhouse', 'Industrial', 'Agricultural', 'Townhouse']
  },
  status: {
    type: String,
    required: true,
    enum: ['For Sale', 'For Rent', 'Sold', 'Rented'],
    default: 'For Sale'
  },
  // --- CHANGE THIS LINE ---
  photo: { type: String, default: 'https://via.placeholder.com/600x400?text=No+Image' },
  // ------------------------
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This references the 'User' model
    required: true // A property must have an owner
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;