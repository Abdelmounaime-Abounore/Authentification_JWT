const express = require('express')
const router = express.Router();

const authController = require('../../controllers/authContoller')

router.post("/register", authController.register)
router.get('/verify/:token', authController.verifyEmail);

module.exports = router