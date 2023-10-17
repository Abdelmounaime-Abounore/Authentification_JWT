const express = require('express')
const router = express.Router();

const authController = require('../../controllers/authContoller')

router.post("/register", authController.register)

module.exports = router