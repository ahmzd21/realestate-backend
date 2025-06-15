// server/routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const Property = require('../models/Property'); // Import Property model
const { protect } = require('../middleware/authMiddleware'); // <--- IMPORT PROTECT MIDDLEWARE

// @route   GET /api/properties
// @desc    Get all properties
// @access  Public (no change needed here)
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({});
    res.json(properties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/properties/:id
// @desc    Get property by ID
// @access  Public (no change needed here)
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/properties
// @desc    Add new property
// @access  Private (now requires authentication)
router.post('/', protect, async (req, res) => { // <--- ADD 'protect' MIDDLEWARE HERE
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

  try {
    const newProperty = new Property({
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
      agentId,
      owner: req.user.id // <--- IMPORTANT: Assign the property to the authenticated user
    });

    const property = await newProperty.save();
    res.status(201).json(property);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/properties/:id
// @desc    Update a property by ID
// @access  Private (now requires authentication)
router.put('/:id', protect, async (req, res) => { // <--- ADD 'protect' MIDDLEWARE HERE
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
    let property = await Property.findById(req.params.id);

    if (!property) return res.status(404).json({ msg: 'Property not found' });

    // <--- OPTIONAL BUT RECOMMENDED: Ensure only the owner can update their property
    if (property.owner && property.owner.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to update this property' });
    }
    // Make sure your Property model has an 'owner' field of type mongoose.Schema.Types.ObjectId, ref: 'User'

    property = await Property.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: propertyFields },
      { new: true }
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
// @access  Private (now requires authentication)
router.delete('/:id', protect, async (req, res) => { // <--- ADD 'protect' MIDDLEWARE HERE
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ msg: 'Property not found' });
    }

    // <--- OPTIONAL BUT RECOMMENDED: Ensure only the owner can delete their property
    if (property.owner && property.owner.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to delete this property' });
    }
    // Make sure your Property model has an 'owner' field of type mongoose.Schema.Types.ObjectId, ref: 'User'


    await Property.findByIdAndDelete(req.params.id);
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