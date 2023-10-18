const express = require('express')
const router = express.Router();

const authController = require('../../controllers/authContoller')

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/verify/:token", authController.emailVerification)

module.exports = router