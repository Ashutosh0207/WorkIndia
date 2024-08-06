const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user');
const diningPlaceRoutes = require('./routes/diningPlace');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());

// User Routes
app.use('/api', userRoutes);

// Dining Place Routes
app.use('/api/dining-place', diningPlaceRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
