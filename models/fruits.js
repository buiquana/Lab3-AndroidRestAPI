// models/fruits.js
const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
    status: String,
    description: String,
    image: [String],  // Chuyển từ String sang Array of Strings
    id_distributors: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor' }
});


module.exports = mongoose.model('Fruits', fruitSchema);
