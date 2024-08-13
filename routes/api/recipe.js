const express = require('express')
const router = express.Router()
const recipeCtrl = require('../../controllers/api/recipe')
const ensureLoggedIn = require('../../config/ensureLoggedIn')

router.post('/add', ensureLoggedIn, recipeCtrl.addRecipe)



module.exports = router;