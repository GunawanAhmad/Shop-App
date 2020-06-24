const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll().then(result => {
    res.render('shop/product-list', {
      prods: result,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => {
    console.log(err)
  })
  
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(result => {
    res.render('shop/index', {
      prods: result,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => {
    console.log(err)
  })
};

exports.getProductbyId = (req,res,next) => {
  const prodId = req.params.productId
  //findByPk is function from sequelise it self
  //you can use findAll({id : prodId}) method 
  Product.findByPk(prodId).then((product) => {  
    res.render('shop/product-detail',{
       product : product,
       pageTitle : 'Product Detail', 
       path : '/products'
      })
  })
  .catch(err => {
    console.log(err)
  })
  
  
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    return cart.getProducts()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products : products
      });
    })
  }).catch(err=> {
    console.log(err)
  })


  
};

exports.postCart = (req,res,next) => {
  const productId = req.body.productId
  let fatchedcart;
  req.user.getCart()
  .then(cart => {
    fatchedcart = cart
    return cart.getProducts({where  : {id : productId}})
  }).then(products => {
    let product;
    if (products.length > 0) {
      product = products[0]
    }
    let newQuantity = 1
    if (product) {
      let oldQuantity = product.CartItem.quantity + 1
      return fatchedcart.addProduct(product, {through : {quantity : oldQuantity}}).then(result => {
        res.redirect('/cart')
      })
    } 
    return Product.findByPk(productId).then(product => {
      return fatchedcart.addProduct(product, {through : {quantity : newQuantity}})
    }).then(result => {
      res.redirect('/cart')
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
 
  
}

exports.deleteCartItem  = (req,res,next) => {
  const prodId = req.body.productId
  req.user.getCart()
  .then(product => {
    return product.getProducts({where : {id : prodId}})
  }).then(product => {
    const prod = product[0]
    return prod.CartItem.destroy()
  }).then(respons => {
    res.redirect('/cart')
  }).catch(err => {
    console.log(err)
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};


