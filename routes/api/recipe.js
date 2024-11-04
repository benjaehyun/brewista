const express = require('express')
const router = express.Router()
const recipeCtrl = require('../../controllers/api/recipe')
const ensureLoggedIn = require('../../config/ensureLoggedIn')

router.get('/all', recipeCtrl.getAllRecipes);
router.get('/me', ensureLoggedIn, recipeCtrl.getCurrentUserRecipes);
router.get('/:id', recipeCtrl.getRecipeById);
router.post('/add', ensureLoggedIn, recipeCtrl.addRecipe);
router.put('/:id', ensureLoggedIn, recipeCtrl.updateRecipe);



module.exports = router;