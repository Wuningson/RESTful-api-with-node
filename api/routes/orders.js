const express = require('express');
const router = express.Router();

//handling incoming get requests to /orders
router.get('/', (req, res, next)=> {
	res.status(200).json({
		message: 'Orders were fetched'
	});
});

//hanling incoming post requests to /orders
router.post('/', (req, res, next)=>{
	const order = {
		productId: req.body.productId,
		quantity: req.body.quantity
	}
	res.status(201).json({
		message: 'Orders were created',
		order: order
  });  
});

//handling incoming get requests to /order/orderId
router.get('/:orderId', (req, res, next)=> {
	res.status(200).json({
		message: 'Order details',
		orderId: req.params.orderId
	});
});

//handling incoming delete requests to /order/orderId
router.delete('/:orderId', (req, res, next)=> {
	res.status(200).json({
		message: 'Order deleted',
		orderId: req.params.orderId
	});
});

module.exports = router;