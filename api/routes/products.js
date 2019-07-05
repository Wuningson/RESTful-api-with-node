const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname )
	}
});

const fileFilter = (req, file, cb) => {
	//accept
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
		cb(null, true);	//You can set something else in this cb for the null part so as to have a response
	}else{
		cb(new Error('Product not created'), false);
	}
}

const upload = multer({ 
	storage, 
	limits: {
	fileSize: 1024 * 1024 * 5
	},
	fileFilter
});

const checkAuth = require('../middleware/check-auth');
const ProductsControllers = require('../controllers/products');

//The checkAuth takes a valid token in the headers: authorization. The token is usually created at user login

//To get access to the uploads, we can either have a route to /uploads or use a middleware in the app.js file.

//Here only the / is used because the middleware in the app.js already filters so that only requests with the /products
//are forwarded to this file as such if /products is added in the get function the request url will have to /products/p
router.get('/', ProductsControllers.products_get_all);

//when posting its better to send a status code of 201
router.post('/', checkAuth, upload.single('productImage'), ProductsControllers.products_create);

router.get('/:productId', ProductsControllers.products_get_product);

router.patch('/:productId', checkAuth, );

router.delete('/:productId', checkAuth, ProductsControllers.products_delete);

module.exports = router;