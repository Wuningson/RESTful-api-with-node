const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb://127.0.0.1/node-rest-shop', {useNewUrlParser: true}, ()=>{
	console.log('Connected to database');
});

//middleware for making the uploads folder public
app.use('/uploads',express.static('uploads'));
//middleware for handling morgan which logs
app.use(morgan('dev'));
//The url encoding sets the type of data the bodyParser should expect. it mostly takes in the html
app.use(bodyParser.urlencoded({extended: false}));
//This middleware allows for json sending and retrieval
app.use(bodyParser.json());

//This middleware allows CORS: Cross Origin Resource sharing i.e. The api will allow itself to be served on different
//domain different from its original domain/access point
app.use((req, res, next)=>{
	//The res header then sets the Access Control Allow Origin and then the domains to allow from here we set * to 
	//allow all domains/sites/origins
	res.header('Access-Control-Allow-Origin','*');
	//This sets the headers to allow
	res.header('Access-Control-Allow-Origin','Origin, X-Requested-With, Content-Type, Accept, Authorization');
	
	if (req.method === 'OPTIONS'){
		//Here you put in all the options supported in the api
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});


//routes handling requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//middleware taking errors
app.use((req, res, next)=> {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

//middleware handling error from anywhere in the application including those created in the previous middleware
app.use((error, req, res, next)=>{
	res.status(error.status || 500);
	res.json({
		error : {
			message: error.message
		}
	});
});

module.exports = app;
