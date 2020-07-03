const User = require('../models/users')

exports.getlogin = (req, res, next) => {
    console.log(req.session.isLoggedIn)
      res.render('auth/login', {
        path: '/login',
        pageTitle : 'Login Page',
        isAuthenticated : req.session.isLoggedIn
      });
};

exports.postLogin = (req,res,next) => {
    User.findById("5efb0bedb3fa2e0f38e22d0d")
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = new User(user.name, user.email, user.cart, user._id)
        res.redirect('/')
    })
    .catch(err => console.log(err))
}

exports.logOut = (req,res,next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}