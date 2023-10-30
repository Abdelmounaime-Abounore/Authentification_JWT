const express = require('express')
const router = express.Router();

const authController = require('../controllers/authContoller')

router.get("/verify/:role/:token", authController.emailVerification)
// router.post("/logout", authController.logout)
router.post('/reset-password/:token', authController.resetPassword);
router.post('/edit-password', authController.editPassword);

module.exports = router