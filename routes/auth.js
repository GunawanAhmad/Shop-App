const path = require('path');

const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();


router.get('/login', authController.getlogin)
router.post('/login', authController.postLogin)
router.post('/logout', authController.logOut)
router.get('/signup', authController.signUp)
router.post('/signup', authController.postSignUp)
router.get('/reset-password', authController.getReset)
router.post('/reset-password', authController.postReset)
router.get('/reset/:token', authController.getNewPass)
router.post('/new-password', authController.postNewpass)

module.exports = router;