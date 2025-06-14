// server/models/Agent.js
const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  tagline: { type: String },
  bio: { type: String },
  photo: { type: String }, // URL to agent's photo
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  social: {
    linkedin: String,
    facebook: String,
    instagram: String
  },
  areasServed: [{ type: String }], // Array of strings
  // REVIEWS FIELD REMOVED FROM HERE, as they will be in their own collection
}, {
  timestamps: true
});

const Agent = mongoose.model('Agent', AgentSchema);

module.exports = Agent;