const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
var { isAdmin } = require('../auth/authServices');

const prefix = '/user'

// Create a new User
router.post(prefix, user.create);

// Retrieve all user
router.get(prefix, user.findAll);

// Retrieve a single User with userId
router.get(prefix+'/:userId', user.findOne);

// Update a User with userId
router.put(prefix+'/:userId', user.update);

// Delete a User with userId
router.delete(prefix+'/:userId', user.delete);

module.exports = router;