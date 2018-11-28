const express = require('express');
const router = express.Router();
const userprofile = require('../controllers/userProfileController');
var { isAdmin } = require('../auth/authServices');

const prefix = '/userprofile'

// Retrieve a single User with userId
router.get(prefix+'/favoritos', userprofile.find);

// Update a User with userId
router.put(prefix+'/favoritos', userprofile.update);

// Delete a User with userId
router.delete(prefix+'/', userprofile.delete);

module.exports = router;