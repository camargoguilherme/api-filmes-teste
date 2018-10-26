const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');
var { isAdmin } = require('../auth/authServices');

const prefix = '/users'

// Create a new User
router.post(prefix, users.create);

// Retrieve all Users
router.get(prefix, users.findAll);

// Retrieve a single User with userId
router.get(prefix+'/:userId', users.findOne);

// Update a User with userId
router.put(prefix+'/:userId', users.update);

// Delete a User with userId
router.delete(prefix+'/:userId', users.delete);

module.exports = router;