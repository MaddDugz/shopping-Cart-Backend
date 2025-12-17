const mongoose = require('mongoose');

// add products to display on site
const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model('products', ProductSchema);