const express = require('express')
const router = express.Router()
const relationCtrl = require('../../controllers/api/relation');
const relation = require('../../models/relation');
// const ensureLoggedIN = require('../../config/ensureLoggedIn')


router.get('/followers/:profileId', relationCtrl.getFollowers)
router.get('/following/:profileId', relationCtrl.getFollowing)

module.exports = router;