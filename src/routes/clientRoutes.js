const express = require('express')
const router = express.Router();

const authController = require('../controllers/authContoller')

router.get("/client/verify/:token", authController.emailVerification)
router.post("/client/logout", authController.logout) // add midleware
router.post('/client/reset-password/:token', authController.resetPassword);
router.post('/client/edit-password', authController.editPassword); //add midleware