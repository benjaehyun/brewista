const express = require('express');
const router = express.Router();
const recipeVersionCtrl = require('../../controllers/api/recipeVersion');
const ensureLoggedIn = require('../../config/ensureLoggedIn');


router.get('/:id/versions', recipeVersionCtrl.getVersionHistory);
router.get('/:id/version/:version', recipeVersionCtrl.getSpecificVersion);
router.get('/:id/isCurrentVersion/:version', recipeVersionCtrl.isCurrentVersion);

router.post('/:id/version', ensureLoggedIn, recipeVersionCtrl.createVersion);
router.post('/:id/branch', ensureLoggedIn, recipeVersionCtrl.createBranch);
router.post('/copy', ensureLoggedIn, recipeVersionCtrl.copyRecipe);

module.exports = router;