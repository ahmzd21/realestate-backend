// server/routes/agentRoutes.js
const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent'); // Import Agent model

// @route   GET /api/agents
// @desc    Get all agents
// @access  Public
router.get('/', async (req, res) => {
  try {
    const agents = await Agent.find({})
    res.json(agents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/agents/:id
// @desc    Get agent by ID (using MongoDB's _id)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // CHANGE THIS LINE:
    const agent = await Agent.findById(req.params.id); // <--- Use findById to query by MongoDB's _id

    if (!agent) {
      return res.status(404).json({ msg: 'Agent not found' });
    }
    res.json(agent);
  } catch (err) {
    console.error(err.message);
    // This 'err.kind === 'ObjectId'' check is now more relevant as findById throws this for invalid _id format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Agent not found: Invalid ID format' }); // More specific message
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/agents
// @desc    Add new agent
// @access  Private
router.post('/', async (req, res) => {
  const {
    name,
    title,
    tagline,
    bio,
    photo,
    contact, // { email, phone }
    social,  // { linkedin, facebook, instagram }
    areasServed
  } = req.body;

  try {
    const newAgent = new Agent({
      name,
      title,
      tagline,
      bio,
      photo,
      contact,
      social,
      areasServed
    });

    const agent = await newAgent.save();
    res.json(agent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/agents/:id
// @desc    Update an agent by ID
// @access  Private
router.put('/:id', async (req, res) => {
  const {
    name,
    title,
    tagline,
    bio,
    photo,
    contact,
    social,
    areasServed
  } = req.body;

  const agentFields = {};
  if (name) agentFields.name = name;
  if (title) agentFields.title = title;
  if (tagline) agentFields.tagline = tagline;
  if (bio) agentFields.bio = bio;
  if (photo) agentFields.photo = photo;
  if (contact) agentFields.contact = contact;
  if (social) agentFields.social = social;
  if (areasServed) agentFields.areasServed = areasServed;

  try {
        // CHANGE THIS LINE: Use findById to check existence based on MongoDB's _id
    let agent = await Agent.findById(req.params.id);

    if (!agent) return res.status(404).json({ msg: 'Agent not found' });

    // CHANGE THIS LINE: Use findByIdAndUpdate to update based on MongoDB's _id
    agent = await Agent.findByIdAndUpdate(
      req.params.id, // Query by _id
      { $set: agentFields }, // Fields to update
      { new: true, runValidators: true } // new: true returns the updated doc, runValidators ensures schema validations apply
    );

    res.json(agent);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Agent not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/agents/:id
// @desc    Delete an agent by ID
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);

    if (!agent) {
      return res.status(404).json({ msg: 'Agent not found' });
    }

    res.json({ msg: 'Agent removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Agent not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;