const express = require('express')
const router = express.Router();

const authController = require('../../controllers/authContoller')

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/verify/:token", authController.emailVerification)
router.post("/logout", authController.logout)
router.post('/forgot-password', authController.forgetPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router