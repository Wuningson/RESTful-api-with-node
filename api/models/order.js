const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    //the product part of this schema is supposed to reference the product schema and as such a reference is made by
    // using the ref keyword and entering the name of the schema the reference is being made to in this case 'Product'
    //This is kind of a relation and as such in cases where there are too mucn of this in an api it's best to use 
    //a relational database like mySql
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId, ref:'Product', required: true
    },
    quantity:{
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Order', orderSchema);