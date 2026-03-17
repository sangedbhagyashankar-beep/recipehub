const Recipe = require('../models/recipeModel');
const jwt = require('jsonwebtoken');

const getUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch { return null; }
};

// @desc    Get all recipes
// @route   GET /api/recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = {};
    if (category && category !== 'All') query.category = category;
    if (search) query.$text = { $search: search };

    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Recipe.countDocuments(query);
    res.json({ recipes, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Create recipe
// @route   POST /api/recipes
exports.createRecipe = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Not authorized' });

    const recipe = await Recipe.create({ ...req.body, authorId: userId });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
exports.updateRecipe = async (req, res) => {
  try {
    const userId = getUserId(req);
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    if (recipe.authorId.toString() !== userId) return res.status(403).json({ error: 'Not authorized' });

    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res) => {
  try {
    const userId = getUserId(req);
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    if (recipe.authorId.toString() !== userId) return res.status(403).json({ error: 'Not authorized' });

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Rate a recipe
// @route   POST /api/recipes/:id/rate
exports.rateRecipe = async (req, res) => {
  try {
    const { rating } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    const newTotal = recipe.rating * recipe.ratingCount + rating;
    recipe.ratingCount += 1;
    recipe.rating = newTotal / recipe.ratingCount;
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
