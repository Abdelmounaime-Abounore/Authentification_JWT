const express = require('express')
const router = express.Router();

const authController = require('../controllers/authContoller')

router.get("/admin/verify/:token", authController.emailVerification)
// router.post("/admin/logout", authController.logout)
router.post('/admin/reset-password/:token', authController.resetPassword);
router.post('/admin/edit-password', authController.editPassword);