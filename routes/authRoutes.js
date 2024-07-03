const express = require('express');
const router = express.Router();
//const verifyToken = require('../middleware/authMiddleware');

const authController = require('../controllers/authControllers');

router.post('/sign-up', authController.userRegister);
//router.get('/getAllUsers',verifyToken, authController.getAllUsers);
//router.put('/:empID', verifyToken, authController.updateUser);
//router.delete('/:empID', verifyToken, authController.deleteUser);
router.post('/login', authController.userLogin);

module.exports = router;

//