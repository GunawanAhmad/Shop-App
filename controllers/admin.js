const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title : title,
    price : price,
    imageUrl : imageUrl,
    description : description
  }).then(result => {
    // console.log(result)
    console.log('Product Created')
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
  Product.findById(prodId, product => {
    
    if (!product) {
      return res.redirect('/')
    }
    res.render('admin/edit-product', {
      pageTitle : 'Edit Product',
      path : '/edit-product',
      editing : true,
      product : product
    })
  }) 
}

exports.postEditProduct = (req,res,next) => {
  const prodId = req.body.productId
  const newTitle = req.body.title
  const newImageUrl = req.body.imageUrl
  const newPrice = req.body.price
  const newDesc = req.body.description
  const newProduct = new Product(prodId, newTitle, newImageUrl,newDesc, newPrice)
  newProduct.save()
  res.redirect('/admin/products')
}

exports.deleteProduct = (req,res,next) => {
  const prodId = req.body.productId
  Product.delete(prodId)
  res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {

  Product.findAll().then(result => {
    res.render('admin/products', {
      prods: result,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => {
    console.log(err)
  })
 
};
