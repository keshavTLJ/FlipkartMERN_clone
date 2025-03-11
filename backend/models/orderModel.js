const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    }
  ],
  orderStatus: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  paymentMethod: { type: String, required: true }, // e.g., 'card', 'UPI', 'COD'
  shippingAddress: {
    name: { type: String, required: true },
    mobNum: { type: String, required: true },
    pincode: { type: String, required: true },
    locality: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    addressType: { type: String, required: true },
  },
  totalAmount: { type: Number, required: true },
  stripeSessionId: { type: String },
  successPageAccessed: { type: Boolean, default: false },
}, 
{ timestamps: true });

module.exports = mongoose.model('Order', orderSchema);