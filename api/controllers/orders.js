const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.orders_get_all = (req, res, next)=> {
	Order.find()
	.select('product quantity _id')
	.populate('product', 'name') 
	//Populate takes the property name of the reference in the schema, then the next argument is like select attached to the find
	.exec()
	.then(docs=>{
		res.status(200).json({
			count: docs.length,
			orders: docs.map(doc=> {
				return {
					_id: doc._id,
					product:  doc.product,
					quantity: doc.quantity,
					request: {
						type: 'GET',
						url: 'http://localhost:4444/orders/' + doc._id
					}
				}
			})
		});
	})
	.catch(err=>{
		res.status(500).json({
			error: err
		});
    });
};



exports.orders_create_orders = (req, res, next) => {
	Product.findById(req.body.productId)
		.then(product => {
			if (!product) {
				return res.status(404).json({
					message: "Product not found"
				});
			}	
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				quantity: req.body.quantity,
				product: req.body.productId
			});
			return order.save();
		}).catch(err=>{
			res.status(500).json({
				error: err
			})
		})
		.then(result=>{
			console.log(result);
			res.status(201).json({
				message: 'Order stored',
				createdOrder: {
					_id: result._id,
					product: result.product,
					quantity: result.quantity
				},
				request: {
					type: 'GET',
					url: 'http://localhost:4444/orders/' + result._id
				}
			});
		}).catch(err=>{
			console.log(err)
			res.status(500).json({
				error: err
			})
        });
    };



exports.orders_get_order = (req, res, next)=> {
	Order.findById(req.params.orderId)
	.populate('product', 'name description') 	
	.exec()
	.then(order=>{
		if (!order) {
			return res.status(404).json({
				message: 'Order not found'
			});
		}
		res.status(200).json({
			order: order,
			request: {
				type: 'GET',
				url: 'https://localhost:4444/orders'
			}
		});
	})
	.catch(err=>{
		res.status(500).json({
			error: err
		});
	});
};


exports.orders_delete_one = (req, res, next)=> {
	Order.deleteOne({_id: req.params.orderId})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Order deleted',
			request:{
				type: "POST",
				url: "https://localhost:4444/orders",
				body: {productId: 'ID', quantity: 'Number'}
			}
		})
	})
	.catch(del => {
		res.status(500).json({
			message: 'Delete failed'
		})
	})
};