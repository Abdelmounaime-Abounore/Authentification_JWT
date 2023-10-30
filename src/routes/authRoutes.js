const express = require('express')
const router = express.Router();

const authController = require('../controllers/authContoller')

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/logout", authController.logout)
router.post('/forgot-password', authController.forgetPassword);
// router.post('/reset-password/:token', authController.resetPassword);
// router.post('/edit-password', authController.editPassword);

module.exports = router