const express = require('express')
const router = express.Router();
//Here only the / is used because the middleware in the app.js already filters so that only requests with the /products
//are forwarded to this file as such if /products is added in the get function the request url will have to /products/p
router.get('/', (req, res, next)=>{
     res.status(200).json({
         message: "Handling get requests to /products"
     });
});

//when posting its better to send a status code of 201
router.post('/', (req, res, next)=>{
    res.status(201).json({
        message: "Handling posts requests to /products"
    });
});

router.get('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    if (id === 'special'){
        res.status(200).json({
            message: "You disccovered the special id",
            id: id
        });
    }else{
        res.status(404).json({
            message: "You passed an ID"
        })
    }
});

router.patch('/', (req, res, next)=>{
    res.status(200).json({
        message: "updated product"
    });
});

router.delete('/', (req, res, next)=>{
    res.status(200).json({
        message: "deleted product"
    });
});

module.exports = router;