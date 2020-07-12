const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
// const getDb = require('../util/database').getDb

const { ObjectID } = require('mongodb');
const ITEM_PER_PAGE = 10;

exports.getProducts = (req, res, next) => {
  //you can use .populate() to get all user data not just the userID
  //in mongoose, req.user only return the user._id not all the data, use populate to fetch all the data
  //u also can use select() method to filter which data or field you want to fetch
  //but we dont need that method in this project
  // .select('title price -_id' )
  // .populate('userId')
  const page = +req.query.page || 1;
  let totalProduct;
  Product.countDocuments()
  .then(num => {
    totalProduct = num;
    return Product.find()
    .skip((page - 1) * ITEM_PER_PAGE)
    .limit(ITEM_PER_PAGE)
  })
  .then(result => {
    res.render('shop/product-list', {
      prods: result,
      pageTitle: 'All Products',
      path: '/products',
      isAuthenticated : req.session.isLoggedIn,
      totalProduct : totalProduct,
      hasNextPage : ITEM_PER_PAGE * page < totalProduct,
      hasPreviousPage : page > 1,
      nextPage : page + 1,
      prevPage : page - 1,
      currentPage : page
    });
  }).catch(err => {
    console.log(err)
  })
  
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalProduct;
  Product.countDocuments()
  .then(num => {
    totalProduct = num;
    return Product.find()
    .skip((page - 1) * ITEM_PER_PAGE)
    .limit(ITEM_PER_PAGE)
  })
  .then(result => {
    res.render('shop/index', {
      prods: result,
      pageTitle: 'Shop',
      path: '/',
      totalProduct : totalProduct,
      hasNextPage : ITEM_PER_PAGE * page < totalProduct,
      hasPreviousPage : page > 1,
      nextPage : page + 1,
      prevPage : page - 1,
      currentPage : page,
      // lastPage : Math.ceil(totalProduct * ITEM_PER_PAGE)
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
       
      })
  })
  .catch(err => {
    console.log(err)
  }) 
}

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')
  .execPopulate() // puplate method does not give a promise, execPopulate will give the promise
    .then(user => {
      const products = user.cart.items
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products : products,
        
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
  const prodId = new ObjectID(req.body.productId)
  console.log(prodId)
  req.user.deleteCartItem(prodId)
  .then(respons => {
    res.redirect('/cart')
  })
  .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  req.user.populate('cart.items.productId')
  .execPopulate() // puplate method does not give a promise, execPopulate will give the promise
  .then(user => {
      const products = user.cart.items.map(i => {
        return {quantity : i.quantity, productData : {...i.productId._doc}}
      })
      const order = new Order({
        user : {
          email : req.user.email,
          userId : req.session.user
        },
        products : products
      })
      return order.save()
  })
  .then(orders => {
    return req.user.clearCart()
    
  })
  .then(result => {
    res.redirect('/orders')
  })
  .catch(err =>{
    return next(err)
  })
  
};


exports.getOrders = (req,res,next) => {
  Order.find({'user.userId' : req.user._id})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders : orders,
      
    });
   
  })
  .catch(err =>  console.log(err))
}


exports.getInvoice = (req,res,next) => {
  const orderId = req.params.orderId;
  const invoiceName = 'invoice-' + orderId + '.pdf'
  const invoicePath = path.join('data', 'invoices', invoiceName);
  Order.findById(orderId).then(order => {
    if(!order) {
      return next(new Error('No order Found'))
    }
    if(order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error('Unauthorized User'))
    }
    // fs.readFileSync(invoicePath, (err,data)=> {
    //   console.log(data)
    //   if(err) {
    //     return next(err)
    //   }
    //   res.setHeader('Content-Type','application/pdf')
    //   res.setHeader('Content-Disposition', 'inline; filename="Invoice.pdf"')
    //   res.send(data)
    // })
    const pdfDoc = new PDFDocument()
    pdfDoc.pipe(fs.createWriteStream(invoicePath))
    res.setHeader('Content-Type','application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="Invoice.pdf"')
    pdfDoc.pipe(res)
    pdfDoc.fontSize(26).text('INVOICE')
    pdfDoc.text('-------------------------------------------------')
    pdfDoc.text('Order ID :' + order._id.toString())
    let totalPrice = 0;
    order.products.forEach(product => {
      pdfDoc.text('Product Title : ' + product.productData.title);
      pdfDoc.text('Price : ' + product.productData.price);
      totalPrice = product.productData.price * product.quantity + totalPrice;
    })
    pdfDoc.text('Total Price : ' + totalPrice)

    pdfDoc.end()
    // const file = fs.createReadStream(invoicePath)
    
    // file.pipe(res)

  }).catch(err => {
    return next(err)
  })
  
}

