const { check, body } = require('express-validator/check')

const express = require('express');

const User = require('../models/users')

const authController = require('../controllers/auth');

const router = express.Router();


router.get('/login',authController.getlogin)
router.post('/login', [body('email').normalizeEmail(), body('password').trim()], authController.postLogin)
router.post('/logout', authController.logOut)
router.get('/signup', authController.signUp)
router.post('/signup', [
    check('email')
    .isEmail()
    .withMessage('please enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({email : value}).then(userDoc => {
            if(userDoc) {
              return Promise.reject('Email already Exist')
            } 
        })
    }).normalizeEmail(),
    check('password').isLength({min : 5}).withMessage('Please enter password at leat 5 character long').trim()
    ,
    body('confirmPassword').trim().custom((value, { req }) => {
        if(value !== req.body.password) {
            throw new Error('Password do not match')
        } 
        return true
    })
    
] 
,authController.postSignUp)
router.get('/reset-password', authController.getReset)
router.post('/reset-password', authController.postReset)
router.get('/reset/:token', authController.getNewPass)
router.post('/new-password', authController.postNewpass)

module.exports = router;