const express = require('express')
const router = express.Router();

const authController = require('../controllers/authContoller')

router.get("/livreur/verify/:token", authController.emailVerification)
router.post("/livreur/logout", authController.logout)
router.post('/livreur/reset-password/:token', authController.resetPassword);
router.post('/livreur/edit-password', authController.editPassword);