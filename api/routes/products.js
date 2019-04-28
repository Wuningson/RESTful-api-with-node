const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

//Here only the / is used because the middleware in the app.js already filters so that only requests with the /products
//are forwarded to this file as such if /products is added in the get function the request url will have to /products/p
router.get('/', (req, res, next)=>{
	Product.find()
	.exec()
	.then(prods=>{
		console.log(prods);
		if (prods.length>0){
			res.status(200).json(prods);
		}else{
			res.status(404).json({
				message: "No product found"
			});
		}
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({error: err});
	});
});

//when posting its better to send a status code of 201
router.post('/', (req, res, next)=>{
	const product = new Product({
		_id: new mongoose.Types.ObjectId,
		name: req.body.name,
		price: req.body.price
	});
	//Great care should be taken to ensure that the status for success is sent in the promise. This is because Promises
	//execute asynchronously as such whether it fails or succeeds the status gets executed.
	product.save()
	.then(result=>{
		console.log(result);
		res.status(201).json({
			message: "Handling posts requests to /products",
			createdProduct: result
		});
	})
	.catch(err=>{
		console.log(`Unable to add product due to ${err} error`);
		res.status(500).json({error: err});
	});
});

router.get('/:productId', (req, res, next)=>{
	const id = req.params.productId;
	Product.findById(id)
	.exec()
	.then(doc=>{
		console.log(doc);
//if(doc !==null){...} will also work here because that will basically check if it exists i.e. if it is not null
		if (doc !== null){
			res.status(200).json({doc});
		}else{
			res.status(404).json({
				message: `${id} is not a valid ID`
			});
		}
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({error: err})
	})
});

router.patch('/:productId', (req, res, next)=>{
	const id = req.params.productId;
	const newName = req.body.newName;
	const newPrice = req.body.newPrice;
	//The for loop here is to ensure that when there are no values passed into the body for the update the patch request
	//won't be executed since the body will be empty
	// for (const ops in req.body){
	// 	updateOps[ops.propName] = ops.value
	// }
	// Product.updateOne({_id: id}, {$set: updateOps})
	// .exec()
	// .then(updated=>{
	// 	console.log(updated);
	// 	res.status(200).json(updated);
	// })
	
	//Instead of the for loop which will require an array input this other lengthy but quite 
	//straightforward method can be used. The only disadvantage is that it will patch one by one
	var newValues ={}
	if (newPrice !== undefined && newName !== undefined){
		newValues = {$set: {
			name: newName,
			price: newPrice
		}};
	}else if(newPrice !== undefined && newName == undefined){
		newValues ={$set:{
			price: newPrice
		}
	};
	}else if (newName !== undefined && newPrice == undefined){
		newValues ={
			$set:{
				name: newName
			}
		};		
	}
	Product.updateOne({_id: id}, newValues)
	.exec()
	.then(updated=>{
		console.log(updated);
		res.status(200).json(updated);
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.delete('/:productId', (req, res, next)=>{
	const id = req.params.productId;
	Product.findById(id)
	.exec()
	.then(prod=>{
		prod.remove();
		res.status(200).json(`The product ${prod.name} has been removed`);
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	})
});

module.exports = router;