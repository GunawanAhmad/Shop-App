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
  req.user.createProduct({
    title : title,
    price : price,
    imageUrl : imageUrl,
    description : description,
  }).then(result => {
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
  // you can also use findBYPk() method
  req.user.getProducts({where : {id : prodId}})
  .then(product => {
    if (!product) {
      return res.redirect('/')
    }
    res.render('admin/edit-product', {
      pageTitle : 'Edit Product',
      path : '/edit-product',
      editing : true,
      product : product[0]
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
  Product.findByPk(prodId).then(product => {
    product.title = newTitle
    product.imageUrl = newImageUrl
    product.price = newPrice
    product.description = newDesc
    return product.save()
  }).then(result => {
    console.log('PRODUCT UPDATED')
    res.redirect('/admin/products')
  }).catch(err => {
    console.log(err)
  })
  
}

exports.deleteProduct = (req,res,next) => {
  const prodId = req.body.productId
  Product.findByPk(prodId).then(result => {
    return result.destroy()
  }).then(resp => {
      console.log('PRODUCT DELETED')
      res.redirect('/admin/products')
  }).catch(err => {
    console.log(err)
  })
  
}

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  .then(result => {
    res.render('admin/products', {
      prods: result,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => {
    console.log(err)
  })
 
};
