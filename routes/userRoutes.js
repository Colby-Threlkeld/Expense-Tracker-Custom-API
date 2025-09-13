const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken); // requires jwt token for each route

// get all users
router.get('/', userController.getAllUsers);

// get specific user by id
router.get('/:id', userController.getUserById);

// update specific user by id
router.put('/:id', userController.updateUserById);

// delete specific user by id
router.delete('/:id', userController.deleteUserById);

module.exports = router;