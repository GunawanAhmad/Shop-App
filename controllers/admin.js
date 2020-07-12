const Product = require('../models/product');
const { ObjectID} = require('mongodb');
const product = require('../models/product');
const fileHelper = require('../util/file')

const ITEM_PER_PAGE = 10;


exports.getAddProduct = (req, res, next) => {
  if(!req.session.isLoggedIn) {
    return res.redirect('/login')
  }
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    title : '',
    price : 0,
    description : '',
    isAuthenticated : req.session.isLoggedIn,
    errorMessage : ''
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  console.log(image)
  const price = req.body.price;
  const description = req.body.description;
  if(!image) {
    res.render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      title : title,
      price : price,
      description : description,
      errorMessage : 'Wrong Image format',
      isAuthenticated : req.session.isLoggedIn,
    });
  }
  const imageUrl = image.path
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
  }).catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error);
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
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error);
  })
}

exports.postEditProduct = (req,res,next) => {
  const prodId = req.body.productId
  const newTitle = req.body.title
  const newImage = req.file
  const newPrice = req.body.price
  const newDesc = req.body.description
  Product.findById(prodId)
  .then(product => {
    if(product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/')
    }
    product.title = newTitle;
    product.price = newPrice;
    if(newImage) {
      fileHelper.deleteFile(product.imageUrl)
      product.imageUrl = newImage.path;
    }
    product.description = newDesc; 
    return product.save().then(result => {
      console.log('PRODUCT UPDATED')
      res.redirect('/admin/products')
    }).catch(err => {
      const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error);
    })
  })
  
  
}

exports.deleteProduct = (req,res,next) => {
  const prodId = req.params.productId
  Product.findById(prodId).then(product => {
    if(!product) {
      return next(new Error('Product not found!'))
    }
    fileHelper.deleteFile(product.imageUrl)
    return Product.deleteOne({_id : prodId, userId : req.user._id})
  })
  .then(resp => {
      console.log('PRODUCT DELETED')
      // res.redirect('/admin/products')
      res.status(200).json({message : 'succes'})
  }).catch(err => {
    // const error = new Error(err)
    // error.httpStatusCode = 500;
    // return next(error);
    res.status(500).json({message : 'failed'})
  })
  
}

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalProduct;
  Product.countDocuments()
  .then(num => {
    totalProduct = num;
    return Product.find({userId : req.user._id})
    .skip((page - 1) * ITEM_PER_PAGE)
    .limit(ITEM_PER_PAGE)
  })
  .then(result => {
    res.render('admin/products', {
      prods: result,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated : req.session.isLoggedIn,
      totalProduct : totalProduct,
      hasNextPage : ITEM_PER_PAGE * page < totalProduct,
      hasPreviousPage : page > 1,
      nextPage : page + 1,
      prevPage : page - 1,
      currentPage : page
    });
  }).catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error);
  })
 
};
