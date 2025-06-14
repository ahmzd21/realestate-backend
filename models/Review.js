// server/models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  // We will let MongoDB auto-generate _id for this document
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 1000 },

  // References to the entities being reviewed or the reviewer
  agent: {
    type: mongoose.Schema.Types.ObjectId, // This is how you reference another model
    ref: 'Agent', // Name of the model being referenced
    required: false // A review might be for a property OR an agent, so not always required
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: false // A review might be for an agent OR a property
  },
  client: { // This will link to our future User/Client model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming we'll call our Client model 'User'
    required: false // Can be optional if anonymous reviews are allowed, or true if only logged-in users
  },

  // If you still want to link to mock-data style IDs for initial seeding:
  mockAgentId: { type: String, required: false },
  mockPropertyId: { type: String, required: false },
  mockClientId: { type: String, required: false }, // For client reviews if using mock client IDs

}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Add an index to allow efficient querying for reviews related to an agent or property
ReviewSchema.index({ agent: 1, property: 1 });

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;