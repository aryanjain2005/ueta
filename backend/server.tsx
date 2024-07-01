import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// Initialize Express app
const app = express();

// Use CORS to allow cross-origin requests
app.use(cors());

// Use body-parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/yourdbname';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to the Express and MongoDB server!');
});

// Example route to handle POST requests
app.post('/words', (req, res) => {
  console.log(req.body); // Access the parsed body data
  res.send('Data received');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
