const Product = require('../models/product');
const getDb = require('../util/database').getDb

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(result => {
    res.render('shop/product-list', {
      prods: result,
      pageTitle: 'All Products',
      path: '/products',
      isAuthenticated : req.isLoggedIn
    });
  }).catch(err => {
    console.log(err)
  })
  
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(result => {
    res.render('shop/index', {
      prods: result,
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated : req.isLoggedIn
    });
  }).catch(err => {
    console.log(err)
  })
};

exports.getProductbyId = (req,res,next) => {
  const prodId = req.params.productId
  Product.findById(prodId).then((product) => {  
    res.render('shop/product-detail',{
       product : product,
       pageTitle : 'Product Detail', 
       path : '/products',
       isAuthenticated : req.isLoggedIn
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
        isAuthenticated : req.isLoggedIn
      });
    })
  .catch(err=> {
    console.log(err)
  })
};

exports.postCart = (req,res,next) => {
  const productId = req.body.productId
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
      isAuthenticated : req.isLoggedIn
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

