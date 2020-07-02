const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isAuthenticated : req.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, imageUrl, description, null, req.user._id)
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
  const prodId = req.params.productId
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
      isAuthenticated : req.isLoggedIn
    })
  }).catch(err => {
    console.log(err)
  })
}

exports.postEditProduct = (req,res,next) => {
  const prodId = req.body.productId
  const newTitle = req.body.title
  const newImageUrl = req.body.imageUrl
  const newPrice = req.body.price
  const newDesc = req.body.description
  const newProduct = new Product(newTitle,newPrice,newImageUrl,newDesc, prodId);
  newProduct.updateProduct()
  .then(result => {
    console.log('PRODUCT UPDATED')
    res.redirect('/admin/products')
  }).catch(err => {
    console.log(err)
  })
  
}

exports.deleteProduct = (req,res,next) => {
  const prodId = req.body.productId
  Product.deleteProduct(prodId).then(result => {
    console.log('deleted')
  }).then(resp => {
      console.log('PRODUCT DELETED')
      res.redirect('/admin/products')
  }).catch(err => {
    console.log(err)
  })
  
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(result => {
    res.render('admin/products', {
      prods: result,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated : req.isLoggedIn
    });
  }).catch(err => {
    console.log(err)
  })
 
};
