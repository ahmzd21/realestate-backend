// server/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Agent = require('../models/Agent'); // Needed to validate agent reference
const Property = require('../models/Property'); // Needed to validate property reference

// @route   POST /api/reviews
// @desc    Add a new review
// @access  Private (requires user authentication later)
router.post('/', async (req, res) => {
  const { rating, comment, agentId, propertyId, clientId } = req.body;

  // Basic validation
  if (!rating || !comment) {
    return res.status(400).json({ msg: 'Please include a rating and a comment' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
  }

  // Ensure at least one target (agent or property) is provided
  if (!agentId && !propertyId) {
    return res.status(400).json({ msg: 'Review must be for an agent or a property' });
  }

  try {
    let reviewAgent = null;
    let reviewProperty = null;

    // Find the actual MongoDB _id for the referenced agent
    if (agentId) {
        reviewAgent = await Agent.findById(agentId);
        // If using MongoDB's _id: reviewAgent = await Agent.findById(agentId);
        if (!reviewAgent) {
            return res.status(404).json({ msg: 'Agent not found for review' });
        }
    }

    // Find the actual MongoDB _id for the referenced property
    if (propertyId) {
        // Find by 'id' field for mock data compatibility
        reviewProperty = await Property.findById(propertyId);
        // If using MongoDB's _id: reviewProperty = await Property.findById(propertyId);
        if (!reviewProperty) {
            return res.status(404).json({ msg: 'Property not found for review' });
        }
    }
    // Note: For clientId, we'll implement this when we have a User model

    const newReview = new Review({
      rating,
      comment,
      agent: reviewAgent ? reviewAgent._id : undefined,     // Store ObjectId reference
      property: reviewProperty ? reviewProperty._id : undefined, // Store ObjectId reference
      // For now,clientId will be a placeholder until User model is ready
      // client: clientId ? clientId : undefined, // This will be the actual User _id
    });

    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/reviews/agent/:agentId
// @desc    Get all reviews for a specific agent
// @access  Public
router.get('/agent/:agentId', async (req, res) => {
    try {
        // First, find the actual Agent by its 'id' to get its _id
        const agent = await Agent.findById(req.params.agentId);
        if (!agent) {
            return res.status(404).json({ msg: 'Agent not found' });
        }
        // Then find reviews referencing that agent's _id
        const reviews = await Review.find({ agent: agent._id });
        // You might want to populate client details here later: .populate('client', 'name')
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/reviews/property/:propertyId
// @desc    Get all reviews for a specific property
// @access  Public
router.get('/property/:propertyId', async (req, res) => {
    try {
        // First, find the actual Property by its 'id' to get its _id
        const property = await Property.findById(req.params.propertyId);
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }
        // Then find reviews referencing that property's _id
        const reviews = await Review.find({ property: property._id });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;