// models/Purchase.js
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;