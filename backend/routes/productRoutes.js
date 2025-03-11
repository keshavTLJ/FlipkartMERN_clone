const express = require("express");
const productController = require('../controllers/productController');
const verifyAuth = require("../middlewares/verifyAuth");

const productRouter = express.Router();

//getHomeProducts
productRouter.get("/home", productController.getHomeProducts);

//getProductsByCategory
productRouter.get("/fashion/:category?", productController.getProductsByCategory);

//getProductById
productRouter.get("/products/:id", productController.getProductById);

//searchProducts
productRouter.get("/search", productController.searchProducts);

//suggestProductsInSearchBar
productRouter.post("/suggest", productController.suggestProducts);


//getWishlistProducts
productRouter.get("/wishlist", verifyAuth, productController.getWishlistProducts);

//getCartProducts
productRouter.get("/cart", verifyAuth, productController.getCartProducts);

module.exports = productRouter;
