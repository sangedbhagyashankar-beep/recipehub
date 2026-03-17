const express = require('express');
const {
  getAllRecipes, getRecipe, createRecipe,
  updateRecipe, deleteRecipe, rateRecipe
} = require('../controller/recipeController');

const router = express.Router();

// Public routes
router.get('/', getAllRecipes);
router.get('/:id', getRecipe);

// Protected routes (auth checked inside controller)
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);
router.post('/:id/rate', rateRecipe);

module.exports = router;
