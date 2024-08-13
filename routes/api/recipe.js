const express = require('express')
const router = express.Router()
// const gearCtrl = require('../../controllers/api/gear')
const ensureLoggedIn = require('../../config/ensureLoggedIn')
// const ensureLoggedIN = require('../../config/ensureLoggedIn')

router.get('/', ensureLoggedIn, gearCtrl.getGear)
router.post('/', ensureLoggedIn, gearCtrl.addGear)
router.get ('/brands', gearCtrl.searchBrands)
router.get ('/models', gearCtrl.searchModelsByBrand)
router.get ('/modifications', gearCtrl.searchModificationsByBrandAndModel)
router.delete('/:gearId', ensureLoggedIn, gearCtrl.removeGearFromProfile);


module.exports = router;