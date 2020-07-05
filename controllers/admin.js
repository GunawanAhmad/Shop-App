const Product = require('../models/product');
const { ObjectID} = require('mongodb');


exports.getAddProduct = (req, res, next) => {
  if(!req.session.isLoggedIn) {
    return res.redirect('/login')
  }
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isAuthenticated : req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title : title,
    price : price,
    description : description,
    imageUrl : imageUrl,
    userId : req.user
  })
  product.save()
  .then(result => {
    // console.log(result)
    console.log('Product Created')
    res.redirect('/admin/products')
  }).catch(er => {
    console.log(er)
  })
};

exports.getEditProduct = (req,res,next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = new ObjectID(req.params.productId)
  Product.findById(prodId)
  .then(product => {
    if (!product) {
      return res.redirect('/')
    }
    res.render('admin/edit-product', {
      pageTitle : 'Edit Product',
      path : '/edit-product',
      editing : true,
      product : product,
      isAuthenticated : req.session.isLoggedIn
    })
  }).catch(err => {
    console.log(err)
  })
}

exports.postEditProduct = (req,res,next) => {
  const prodId = new ObjectID(req.body.productId)
  const newTitle = req.body.title
  const newImageUrl = req.body.imageUrl
  const newPrice = req.body.price
  const newDesc = req.body.description
  Product.findById(prodId)
  .then(product => {
    product.title = newTitle;
    product.price = newPrice;
    product.imageUrl = newImageUrl;
    product.description = newDesc; 
    return product.save()
  })
  .then(result => {
    console.log('PRODUCT UPDATED')
    res.redirect('/admin/products')
  }).catch(err => {
    console.log(err)
  })
  
}

exports.deleteProduct = (req,res,next) => {
  const prodId = new ObjectID(req.body.productId)
  Product.findByIdAndRemove(prodId).then(result => {
    console.log('deleted')
  }).then(resp => {
      console.log('PRODUCT DELETED')
      res.redirect('/admin/products')
  }).catch(err => {
    console.log(err)
  })
  
}

exports.getProducts = (req, res, next) => {
  Product.find()
  .then(result => {
    res.render('admin/products', {
      prods: result,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated : req.session.isLoggedIn
    });
  }).catch(err => {
    console.log(err)
  })
 
};
