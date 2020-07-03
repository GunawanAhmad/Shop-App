const Product = require('../models/product');
// const getDb = require('../util/database').getDb

const { ObjectID } = require('mongodb');

exports.getProducts = (req, res, next) => {
  //you can use .populate() to get all user data not just the userID
  //in mongoose, req.user only return the user._id not all the data, use populate to fetch all the data
  //u also can use select() method to filter which data or field you want to fetch
  //but we dont need that method in this project
  Product.find()
  // .select('title price -_id' )
  // .populate('userId')
  .then(result => {
    res.render('shop/product-list', {
      prods: result,
      pageTitle: 'All Products',
      path: '/products',
      // isAuthenticated : req.session.isLoggedIn
    });
  }).catch(err => {
    console.log(err)
  })
  
};

exports.getIndex = (req, res, next) => {
  Product.find().then(result => {
    res.render('shop/index', {
      prods: result,
      pageTitle: 'Shop',
      path: '/',
      // isAuthenticated : req.session.isLoggedIn
    });
  }).catch(err => {
    console.log(err)
  })
};

exports.getProductbyId = (req,res,next) => {
  const prodId = new ObjectID(req.params.productId)
  Product.findById(prodId)
  .then((product) => {  
    res.render('shop/product-detail',{
       product : product,
       pageTitle : 'Product Detail', 
       path : '/products',
      //  isAuthenticated : req.session.isLoggedIn
      })
  })
  .catch(err => {
    console.log(err)
  }) 
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products : products,
        // isAuthenticated : req.session.isLoggedIn
      });
    })
  .catch(err=> {
    console.log(err)
  })
};

exports.postCart = (req,res,next) => {
  const productId = new ObjectID(req.body.productId)
  Product.findById(productId)
  .then(product => {
    return req.user.addToCart(product)
  }).then(result =>  {
    res.redirect('/cart')
  })
  .catch(err => console.log(err))
}

exports.deleteCartItem  = (req,res,next) => {
  const prodId = req.body.productId
  req.user.deleteCart(prodId)
  .then(respons => {
    res.redirect('/cart')
  })
  .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user.getOrder()
  .then(orders => {
    console.log(orders)
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders : orders,
      // isAuthenticated : req.session.isLoggedIn
    });
  })
  .catch(err => console.log(err))
  
};


exports.postOrder = (req,res,next) => {
  req.user.addOrder()
  .then(result => {
    res.redirect('/orders')
  })
  .catch(err =>  console.log(err))
}

