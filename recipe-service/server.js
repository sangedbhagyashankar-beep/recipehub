const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'Recipe Service', status: 'running' });
});

app.use('/api/recipes', recipeRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Recipe Service Error' });
});

app.listen(PORT, () => {
  console.log(`Recipe Service running on port ${PORT}`);
});

module.exports = app;
