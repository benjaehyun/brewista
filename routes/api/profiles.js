const express = require('express')
const router = express.Router()
const profilesCtrl = require('../../controllers/api/profiles')
// const ensureLoggedIN = require('../../config/ensureLoggedIn')

router.get ('/', profilesCtrl.details)
router.post ('/', profilesCtrl.update)
router.post ('/create', profilesCtrl.create)

module.exports = router;