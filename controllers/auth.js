const User = require('../models/users')

exports.getlogin = (req, res, next) => {
      res.render('auth/login', {
        path: '/login',
        pageTitle : 'Login Page',
        isAuthenticated : req.session.isLoggedIn
      });
};

exports.postLogin = (req,res,next) => {
    User.findById("5eff4961d11ddf021c6c13d9")
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user
        req.session.save(err => {
          console.log(err)
          res.redirect('/')
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