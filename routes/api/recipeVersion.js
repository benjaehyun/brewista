const express = require('express');
const router = express.Router();
const recipeVersionCtrl = require('../../controllers/api/recipeVersion');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

router.use(ensureLoggedIn);

// version history 
router.get('/:id/versions', recipeVersionCtrl.getVersionHistory);

// specific version of a recipe
router.get('/:id/version/:version', recipeVersionCtrl.getSpecificVersion);

// Create new main version
router.post('/:id/version', recipeVersionCtrl.createVersion);

// Create new branch version
router.post('/:id/branch', recipeVersionCtrl.createBranch);

// Copy recipe with version
router.post('/copy', recipeVersionCtrl.copyRecipe);

module.exports = router;