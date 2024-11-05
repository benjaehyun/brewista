const express = require('express')
const router = express.Router()
const profilesCtrl = require('../../controllers/api/profiles')
// const ensureLoggedIN = require('../../config/ensureLoggedIn')

router.get ('/', profilesCtrl.details)
router.post ('/', profilesCtrl.update)
router.post ('/create', profilesCtrl.create)
router.post('/saved-recipes', profilesCtrl.toggleSavedRecipe)
router.delete('/gear/:id', profilesCtrl.removeGear) 


module.exports = router;