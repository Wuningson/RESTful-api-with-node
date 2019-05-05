const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

//Here only the / is used because the middleware in the app.js already filters so that only requests with the /products
//are forwarded to this file as such if /products is added in the get function the request url will have to /products/p
router.get('/', (req, res, next)=>{
	Product.find()
	.select('name price _id')
	//This function select basically selects the keys provided and their values to be returned instead of the entire
	//object
	.exec()
	.then(prods=>{
		const response = {
			count: prods.length,
			products: prods.map(doc=>{
				return {
					name: doc.name,
					price: doc.price,
					_id: doc._id,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/products/' + doc._id
					}
				}
			})
		}
		if (prods.length>0){
			res.status(200).json(response);
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
		//_id: new mongoose.Types.ObjectId,
		name: req.body.name,
		price: req.body.price,
		description: req.body.description
	});
	//Great care should be taken to ensure that the status for success is sent in the promise. This is because Promises
	//execute asynchronously as such whether it fails or succeeds the status gets executed.
	product.save()
	.then(result=>{
		console.log(result);
		res.status(201).json({
			message: "Created product successfully",
			createdProduct: {
				name: result.name,
				price: result.price,
				_id: result._id,
				request: {
					type: 'GET',
					url: "http://localhost:3000/products/" + result._id
				}
			}
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
	.select('name price _id description')
	.exec()
	.then(doc=>{
		console.log(doc);
//if(doc !==null){...} will also work here because that will basically check if it exists i.e. if it is not null
		if (doc !== null){
			res.status(200).json({
				product: doc,
				request:{
					type: 'GET',
					url: 'http://localhost:3000/products'
				}
			});
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
	const newDescription = req.body.description;
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
	Product.findById(id)
	.select('name price description')
	.then(doc=>{
		var newValues ={name: doc.name, price: doc.price, description: doc.description}
		const reqBody = [newName, newPrice, newDescription];
		console.log(reqBody);
		for (var i= 0; i<=reqBody.length - 1; i++){
			if (reqBody[i] !== undefined){
				// toBeUsed.unshift(reqBody[i]);
				if (i==0){
					newValues.name = newName
				}else if(i==1){
					newValues.price = newPrice
				}else{
					newValues.description = newDescription
				}
			}
		}
		
	
		Product.updateOne({_id: id}, {$set:newValues})
		.exec()
		.then(updated=>{
			res.status(200).json({
				message: 'Product updated',
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/' + id
				}
			});
		})
		.catch(err=>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	})
	.catch(err=>{
		console.log(err);
	})
	
	// if (newPrice !== undefined && newName !== undefined && newDescription !== undefined){
	// 	newValues = {$set: {
	// 		name: newName,
	// 		price: newPrice,
	// 		description: newDescription
	// 	}};
	// }else if(newPrice == undefined && newName !== undefined && newDescription !== undefined){
	// 	newValues ={$set:{
	// 		name: newName,
	// 		description: newDescription
	// 	}
	// };
	// }else if(newPrice !== undefined && newName == undefined && newDescription !== undefined){
	// 	newValues ={$set:{
	// 		name: newName,
	// 		price: newPrice
	// 	}
	// };
	// }else if(newPrice !== undefined && newName == undefined && newDescription !== undefined){
	// 	newValues ={$set:{
	// 		description: newDescription,
	// 		price: newPrice
	// 	}
	// };
	// }else if(newPrice !== undefined && newName == undefined && newDescription == undefined){
	// 	newValues ={$set:{
	// 		price: newPrice
	// 	}
	// };
	// }else if (newName !== undefined && newPrice == undefined && newDescription == undefined){
	// 	newValues ={
	// 		$set:{
	// 			name: newName
	// 		}
	// 	};		
	// }else if(newPrice == undefined && newName == undefined && newDescription !== undefined){
	// 	newValues ={$set:{
	// 		description: newDescription
	// 	}
	// };
	// let toBeUsed = []

});

router.delete('/:productId', (req, res, next)=>{
	const id = req.params.productId;
	Product.findById(id)
	.exec()
	.then(prod=>{
		prod.remove();
		res.status(200).json({
			message: 'Product deleted',
			request:{
				type: 'POST',
				url: 'http://localhost:3000/products',
				body: {name: 'String', price: 'Number'}
			}
		});
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	})
});

module.exports = router;