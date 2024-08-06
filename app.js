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

app.use('/api', userRoutes);

app.use('/api/dining-place', diningPlaceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
