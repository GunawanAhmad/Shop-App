const bcrypt = require('bcryptjs')
const User = require('../models/users')
const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
  service : 'gmail',
  auth : {
    user : 'gunawanleomessi@gmail.com',
    pass : 'kaput123'
  }
})


exports.getlogin = (req, res, next) => {
  let message = req.flash('error')
  if(message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
      res.render('auth/login', {
        path: '/login',
        pageTitle : 'Login Page',
        isAuthenticated : req.session.isLoggedIn,
        errorMessage : message
      });
};

exports.postLogin = (req,res,next) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({email : email})
    .then(user => {
      if(!user) {
        req.flash('error', 'Invalid Email')
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password).then(result => {
        if(result) {
          req.session.isLoggedIn = true;
          req.session.user = user
          return req.session.save(err => {
            console.log(err)
            res.redirect('/')
          })
          
        }
        req.flash('error', 'Invalid Password')
        res.redirect('/login')
      }).catch(err => {
        console.log(err)
        res.redirect('/login')
      })
    })
    .catch(err => console.log(err))
}

exports.logOut = (req,res,next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}

exports.signUp = (req,res,next) => {
  let message = req.flash('error')
  if(message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/signup', {
    path : '/signup',
    pageTitle : 'Sign Up',
    isAuthenticated : false,
    errorMessage : message
  })
}

exports.postSignUp = (req,res,next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword
  User.findOne({email : email}).then(userDoc => {
    if(userDoc) {
      req.flash('error', 'Email is already exist')
      return res.redirect('/signup')
    } 
    return bcrypt.hash(password, 12).then(hashedPassword => {
      const user = new User({
        email : email,
        password : hashedPassword,
        cart : {items : []}
      })
      return user.save()
    })
    .then(result => {
      res.redirect('/login')
      return transporter.sendMail({
        to : email,
        from : 'gunawanleomessi@gmail.com',
        subject : 'Sign Up',
        html : '<h1>Sign Up for LocalHost Shopp App is succes</h1>'
      }, function(error,info) {
        if(error) {
          console.log(error)
        } else {
          console.log('Email Sent ' + info.response )
        }
      })    
    }).catch(err => console.log(err))
  })
  .catch(err => console.log(err))
}