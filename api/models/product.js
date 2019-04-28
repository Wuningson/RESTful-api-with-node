const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
	//_id: mongoose.Schema.Types.ObjectId,
	// It's not compulsory to make mongoose generate an id like this since it automatically generates one already
	name: String,
	price: Number
});

module.exports = mongoose.model('Product', productSchema);