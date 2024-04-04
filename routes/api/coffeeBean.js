const express = require('express')
const router = express.Router()
const coffeeCtrl = require('../../controllers/api/coffeeBean')
const ensureLoggedIn = require('../../config/ensureLoggedIn')

router.get ('/roasters', coffeeCtrl.searchRoasters)
router.get ('/origins', coffeeCtrl.searchOriginsByRoasters)
router.get ('/roast-levels', coffeeCtrl.searchRoastLevelsByRoasterAndOrigin)
router.get ('/processes', coffeeCtrl.searchProcessesByRoasterOriginAndRoastLevel)


module.exports = router;