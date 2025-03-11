const mongoose = require("mongoose");
const { Product } = require("../models/productModel");
const User = require('../models/userModel');

async function getHomeProducts(req, res) {
  try {
    const dealOfTheDayProducts = await Product.find({ dealOfTheDay: true })
    const menSlideProducts = await Product.aggregate([
      { $match: { category: 'men'} },
      { $sample: { size: 14 } },
    ])
    const womenSlideProducts = await Product.aggregate([
      { $match: { category: 'women'} },
      { $sample: { size: 21 } },
    ])

    const data = [
      { slideHeading: "Deals of the Day", products: dealOfTheDayProducts },
      { slideHeading: "Discounts for You", products: womenSlideProducts.slice(0, 7) },
      { slideHeading: "Suggesting Items", products: menSlideProducts.slice(0, 7) },
      { slideHeading: "Trending Offers", products: womenSlideProducts.slice(7, 14) },
      { slideHeading: "Season's top Picks", products: menSlideProducts.slice(7, 14) },
      { slideHeading: "Top Deals on Accessories", products: womenSlideProducts.slice(14, 21) },
    ]

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({error: error.message})
  }

}

async function getProductsByCategory(req, res) {
  const { params, query } = req;
  // console.log(params, query)
  // console.log(query.sortby);

  const page = query.page || 1;
  const limit = 40;
  const skip = (parseInt(page) - 1) * limit;
  
  let filter = {};
  if(!params.category)
    filter = { category: { $in: ['men', 'women'] } };
  else
    filter = { category: params.category};

  let sortOption = {};
  if(query.sortby === 'popularity')
    sortOption = {};
  else if(query.sortby === 'price')
    sortOption = { price: parseInt(query.order) };

  const totalProductsCount = await Product.countDocuments(filter);
  const products = await Product.find(filter)
                            .sort(sortOption)
                            .skip(skip)
                            .limit(limit);

  const totalPages = Math.ceil(totalProductsCount/40);
  const pages = Array(totalPages).fill().map((v,i) => ++i);

  res.status(200).json({ 
    totalProductsCount: totalProductsCount,
    sortby: query.sortby || 'popularity',
    order: query.order,
    pages: pages,
    currentPage: page,
    products: products
  });
}

async function getProductById(req, res) {
  const productId = req.params.id;
  console.log(productId)

  if(!mongoose.Types.ObjectId.isValid(productId))
    return res.status(400).json({ error: 'Invalid product ID' });

  const product = await Product.findById(productId);
  
  if(!product)
    return res.status(404).json({ error: 'Product Not Found!' })

  res.status(200).json(product)
}

async function searchProducts(req, res) {
  
  const { query } = req;
  
  const page = parseInt(query.page) || 1;
  const limit = 40;
  const skip = (page - 1) * limit;

  const formattedQuery = query.q ? query.q.trim().replace(/\s+/g, " ") : null;
  // console.log("formattedQuery:", formattedQuery);

  const allowedSortFields = ['popularity', 'price'];
  const sortOption = allowedSortFields.includes(query.sortby) ? { [query.sortby]: parseInt(query.order) || 1 } : {};

  let searchFilter = {};
  let products = [];
  let totalProductsCount = 0;
  
  // 1. Exact Match Check with product name
  if (formattedQuery) {
    searchFilter = { name: formattedQuery };
    totalProductsCount = await Product.countDocuments(searchFilter);
    products = await Product.find(searchFilter)
                            .sort(sortOption)
                            .skip(skip)
                            .limit(limit);
  }
  // 2. Fallback to $text Search against product name and brand if No Exact Match
  if (!products.length && formattedQuery) {
    searchFilter = { $text: { $search: formattedQuery } };
    totalProductsCount = await Product.countDocuments(searchFilter);
    products = await Product.find(searchFilter)
                            .sort({ score: { $meta: "textScore" }, ...sortOption })
                            .skip(skip)
                            .limit(limit);
  }

  const totalPages = Math.ceil(totalProductsCount/limit);
  const pages = Array(totalPages).fill().map((v,i) => ++i);

  res.status(200).json({ 
    totalProductsCount: totalProductsCount,
    sortby: query.sortby || 'popularity',
    order: query.order,
    pages,
    currentPage: page,
    products
  });
}

async function suggestProducts(req, res) {
  try {
    const query = req.body.query ? req.body.query.trim().replace(/\s+/g, " ") : null; // Trim whitespace
    // console.log(query);

    if (!query) return res.status(200).json([]);

    let products = await Product.find({ 
      $text: { $search: query } 
    })
    .sort({ score: { $meta: "textScore" } }) // Sort by relevance
    .limit(8);

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getWishlistProducts(req, res) {
  try {
    const user = await User.findById(req.user._id)
                            .populate('wishlist');
  
    res.status(200).json(user.wishlist);  
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

async function getCartProducts(req, res) {
  try {
    const user = await User.findById(req.user._id)
                            .populate({
                              path: 'cart.product',
                              model: 'Product'
                            });

    const cartItems = user.cart.map(item => {
      const { _id, ...rest } = item.toObject();
      return rest;
    });

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getHomeProducts,
  getProductsByCategory,
  getProductById,
  searchProducts,
  suggestProducts,
  getWishlistProducts,
  getCartProducts
}