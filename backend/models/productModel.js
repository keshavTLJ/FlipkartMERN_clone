const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  brand: { 
    type: String, 
    required: true 
  },
  originalprice: { 
    type: Number, 
    min: [1, "Invalid Price"], 
    required: true 
  },
  discount: {
    type: String,
  },
  price: { 
    type: Number, 
    min: [1, "Invalid Price"] 
  },
  category: { 
    type: String, 
    required: true 
  },
  url: String,
  description: String,
  tagline: String,
  dealOfTheDay: Boolean,
});

productSchema.index({ brand: "text", name: "text" });

exports.Product = mongoose.model("Product", productSchema);
