const express = require('express');
const router = express.Router();
const userController = require('../controller/users');
const auth = require('../middleware/authMiddleware');
router.get('/', auth, userController.findAll);
router.get('/:id', auth, userController.findById);
router.put('/:id', auth, userController.update);
router.delete('/:id', auth, userController.delete);
module.exports = router;
