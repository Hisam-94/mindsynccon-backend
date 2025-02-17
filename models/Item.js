const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  imageUrl: { type: String },
});
module.exports = mongoose.model('Item', itemSchema);
