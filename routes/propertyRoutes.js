// server/routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const Property = require('../models/Property'); // Import Property model

// @route   GET /api/properties
// @desc    Get all properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({}); // Fetch all properties
    res.json(properties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/properties/:id
// @desc    Get property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // const property = await Property.findOne({ id: req.params.id }); // Find by the 'id' field
    // In a real app, if you switch to using MongoDB's _id for all data, this would be:
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    console.error(err.message);
    // If the ID format is invalid (e.g., not an ObjectId if using findById), it throws a CastError
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/properties
// @desc    Add new property
// @access  Private (will add authentication later)
router.post('/', async (req, res) => {
  const {
    // id, // For now, we'll allow an 'id' to be passed for mock data migration
    title,
    location,
    price,
    bedrooms,
    bathrooms,
    area,
    type,
    status,
    image,
    description,
    amenities,
    agentId
  } = req.body;

  try {
    // Create a new Property instance
    const newProperty = new Property({
      // id, // Pass it if provided (for mock data)
      title,
      location,
      price,
      bedrooms,
      bathrooms,
      area,
      type,
      status,
      image,
      description,
      amenities,
      agentId
    });

    // Save to database
    const property = await newProperty.save();
    res.json(property);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/properties/:id
// @desc    Update a property by ID
// @access  Private
router.put('/:id', async (req, res) => {
  const {
    title,
    location,
    price,
    bedrooms,
    bathrooms,
    area,
    type,
    status,
    image,
    description,
    amenities,
    agentId
  } = req.body;

  // Build property object
  const propertyFields = {};
  if (title) propertyFields.title = title;
  if (location) propertyFields.location = location;
  if (price) propertyFields.price = price;
  if (bedrooms) propertyFields.bedrooms = bedrooms;
  if (bathrooms) propertyFields.bathrooms = bathrooms;
  if (area) propertyFields.area = area;
  if (type) propertyFields.type = type;
  if (status) propertyFields.status = status;
  if (image) propertyFields.image = image;
  if (description) propertyFields.description = description;
  if (amenities) propertyFields.amenities = amenities;
  if (agentId) propertyFields.agentId = agentId;


  try {
    // let property = await Property.findOne({ id: req.params.id }); // Find by 'id'
    // Or if using MongoDB's _id: 
    let property = await Property.findById(req.params.id);

    if (!property) return res.status(404).json({ msg: 'Property not found' });

    // Update
    property = await Property.findByIdAndUpdate(
      // { id: req.params.id }, // Find by 'id'
      // Or if using MongoDB's _id: 
      { _id: req.params.id },
      { $set: propertyFields },
      { new: true } // Return the updated document
    );

    res.json(property);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a property by ID
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // const property = await Property.findOneAndDelete({ id: req.params.id }); // Find and delete by 'id'
    // Or if using MongoDB's _id: 
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }

    res.json({ msg: 'Property removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;