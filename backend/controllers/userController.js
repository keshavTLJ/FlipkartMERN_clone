const mongoose = require('mongoose');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

function capitalizeName(name) {
  return name
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY)
}

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  // console.log("name: ", name);
  
  try {
    const passwordHash = await User.signup(email, password);
    const nameInTitleCase = capitalizeName(name);
    // console.log("nameInTitleCase: ", nameInTitleCase)
    const user = await User.create({ ...req.body, name: nameInTitleCase, password: passwordHash });

    const token = createToken(user?._id)

    const cartIds = user.cart.map(item => item.product);
    
    res.status(200).json({ 
      name: user.name,
      token,
      authType: 'signup',
      wishlistIds: user.wishlist,
      cartIds: cartIds
    });

  } catch(error) {
    res.status(400).json({ error: error.message });
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password)
    const token = createToken(user?._id)

    const cartIds = user.cart.map(item => item.product);

    res.status(200).json({ 
      name: user.name,
      token,
      authType: 'login',
      wishlistIds: user.wishlist,
      cartIds: cartIds
    });

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const addToWishlist = async (req, res) => {
  const productId = req.body.id;
  const user = req.user;

  try {
    if(!user.wishlist.includes(productId)) {
      user.wishlist.unshift(productId);
      await user.save();

      res.status(200).json({
        message: "Product added to wishlist succesfully",
        id: productId,
      });
    }
    else {
      res.status(400).json({ error: 'Product already in wishlist' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteFromWishlist = async (req, res) => {
  const productId = req.params.id;
  const user = req.user;

  try {
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Check if the product is in the user's wishlist
    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
      await user.save();

      return res.status(200).json({
        message: 'Product removed from Wishlist succesfully',
        id: productId,
      });
    } else {
      return res.status(400).json({ error: 'Product not found in wishlist' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

const addToCart = async (req, res) => {
  const productId = req.body.id;
  const user = req.user;

  try {
    const itemExists = user.cart.some(item => item.product.toString() === productId)
    if(!itemExists) {
      user.cart.push({ product: productId, quantity: 1 });
      await user.save();

      res.status(200).json({
        message: "Product added to cart succesfully",
        id: productId,
      });
    }
    else {
      res.status(400).json({ error: 'Product already in Cart' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteFromCart = async (req, res) => {
  const productId = req.params.id;
  const user = req.user;

  try {
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Check if the product is in the user's cart
    const index = user.cart.findIndex(item => item.product.toString() === productId);
    if (index > -1) {
      user.cart.splice(index, 1);
      await user.save();

      return res.status(200).json({
        message: 'Product removed from Cart succesfully',
        id: productId
      });
    } else {
      return res.status(400).json({ error: 'Product not found in Cart' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

const updateCartItem = async (req, res) => {
  const {id: productId, quantity } = req.body;
  const user = req.user;

  try {
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Check if the product is in the user's cart
    const index = user.cart.findIndex(item => item.product.toString() === productId);
    if (index > -1) {
      user.cart[index].quantity = quantity;
      await user.save();

      return res.status(200).json({
        message: 'Quantity updated succesfully',
        id: productId,
        quantity: quantity,
      });
    } else {
      return res.status(400).json({ error: 'Product not found in Cart' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

const getUserAddresses = async (req, res) => {
  const modifiedAddressData = req.user.address.map(address => ({...address.toObject(), editing: false}));

  res.status(200).json({ addresses: modifiedAddressData })
}

const addUserAddress = async (req, res) => {
  const user = req.user;
  const newAddress = req.body.address;

  try {
    user.address.unshift(newAddress);
    await user.save();

    const savedAddress = user.address[0];

    res.status(200).json({
      message: "Address added succesfully",
      newAddress: {...savedAddress.toObject(), editing: false}
    });
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const updateUserAddress = async (req, res) => {
  const user = req.user;
  const { addressId } = req.params;
  const updatedAddress = req.body.address;

  try {
    const addrIndex = user.address.findIndex(addr => addr._id.toString() === addressId);
    if(addrIndex === -1)
      return res.status(404).json({ error: "Address not found" });

    user.address[addrIndex] = { ...user.address[addrIndex].toObject(), ...updatedAddress };
    await user.save();

    res.status(200).json({ 
      message: "Address updated succesfully",
      updatedAddress: { ...user.address[addrIndex].toObject(), editing: false }
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteUserAddress = async (req, res) => {
  const { user } = req;
  const { addressId } = req.params;

  try {
    const addrIndex = user.address.findIndex(addr => addr._id.toString() === addressId);
    if(addrIndex === -1)
      return res.status(404).json({ error: "Address not found" });

    user.address = user.address.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    res.status(200).json({ message: "Address deleted succesfully" });
  } catch {
    res.status(400).json({ error: error.message });
  }
}

const getUserDetails = async (req, res) => {
  const { user } = req;
  
  try {
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    res.status(200).json({
      name: user.name,
      gender: user.gender ?? null,
      email: user.email,
      mobNum: user.mobNum ?? null,
      // addresses: user.address,
    });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updateUserDetails = async(req, res) => {
  const { user } = req;
  const newDetails = req.body.data;
  
  try {
    user.name = capitalizeName(newDetails.name);
    user.gender = newDetails.gender || user.gender;
    user.email = newDetails.email || user.email;
    user.mobNum = newDetails.mobNum || user.mobNum;

    await user.save();

    res.status(200).json({
      message: "User details updated successfully",
      updatedData: {
        name: user.name,
        gender: user.gender ?? null,
        email: user.email,
        mobNum: user.mobNum ?? null,
        addresses: user.address,
      }
    });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteUser = async (req, res) => {
  const { user } = req;

  try {
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ 
      message: "User deleted succesfully",
    })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  loginUser,
  signupUser,
  addToWishlist,
  deleteFromWishlist,
  addToCart,
  deleteFromCart,
  updateCartItem,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserDetails,
  updateUserDetails,
  deleteUser
}