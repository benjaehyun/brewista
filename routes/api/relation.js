const express = require('express')
const router = express.Router()
const relationCtrl = require('../../controllers/api/relation')
// const ensureLoggedIN = require('../../config/ensureLoggedIn')


router.get ('/:id/followers', relationCtrl.followersIndex)

module.exports = router;