// server/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import route files
const propertyRoutes = require('./routes/propertyRoutes');
const agentRoutes = require('./routes/agentRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); // <--- Import review routes
const sellerInquiryRoutes = require('./routes/sellerInquiryRoutes'); // NEW: Import seller inquiry routes
const contactRouter = require('./routes/contactRoutes'); // <--- ADD THIS LINE
const authRoutes = require('./routes/authRoutes'); // <--- Import auth routes

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas Connected successfully!');
    // Start the server only if DB connection is successful
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Access at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    if (err.name === 'MongooseServerSelectionError') {
      console.error('Possible causes:');
      console.error('- Incorrect MONGO_URI (username, password, cluster name)');
      console.error('- Network access not configured correctly in Atlas (IP Whitelist)');
      console.error('- Firewall blocking connection');
    }
    process.exit(1);
  });

// Basic route
app.get('/', (req, res) => {
  res.send('Real Estate API is running!');
});

// Use API routes
app.use('/api/properties', propertyRoutes); // <--- Use property routes
app.use('/api/agents', agentRoutes);       // <--- Use agent routes
app.use('/api/reviews', reviewRoutes);     // <--- Use review routes
app.use('/api/seller-inquiries', sellerInquiryRoutes); // NEW: Use seller inquiry routes
app.use('/api/contact', contactRouter); // <--- ADD THIS LINE: Mount the contact routes at /api/contact
app.use('/api/auth', authRoutes); // <--- Use the authentication routes