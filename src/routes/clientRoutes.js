const express = require('express')
const router = express.Router();

const checkAuth = require('../Midelwears/authMidelwear')

const authController = require('../controllers/authContoller')

router.get("/verify/:role/:token", authController.emailVerification)
// router.post("/logout", authController.logout) // add midleware
router.post('/reset-password/:token', authController.resetPassword);
router.post('/edit-password/:token', authController.editPassword); 

module.exports = router