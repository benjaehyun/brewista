const express = require('express')
const router = express.Router()
const gearCtrl = require('../../controllers/api/gear')
// const ensureLoggedIN = require('../../config/ensureLoggedIn')

router.get ('/brands', gearCtrl.searchBrands)
router.get ('/models', gearCtrl.searchModelsByBrand)
router.get ('/modifications', gearCtrl.searchModificationsByBrandAndModel)
router.post('/', gearCtrl.addGear)


module.exports = router;