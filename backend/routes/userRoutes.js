const express = require('express');
const userController = require('../controllers/userController');
const verifyAuth = require('../middlewares/verifyAuth');

const userRouter = express.Router();

userRouter.post('/signup', userController.signupUser);

userRouter.post('/login', userController.loginUser);

//verifying authorization
userRouter.post('/verify-auth', verifyAuth, (req, res) => {
  const { name, wishlist, cart } = req.user;
  
  const cartIds = cart.map(item => item.product);
  
  res.status(200).json({
    name,
    verified: true,
    wishlistIds: wishlist,
    cartIds: cartIds
  });
});

//add product to wishlist
userRouter.post('/wishlist', verifyAuth, userController.addToWishlist);
//delete from wishlist
userRouter.delete('/wishlist/:id', verifyAuth, userController.deleteFromWishlist);

//add to cart
userRouter.post('/cart', verifyAuth, userController.addToCart);
//delete from cart
userRouter.delete('/cart/:id', verifyAuth, userController.deleteFromCart);
//update Cart Item quantity
userRouter.patch('/cart', verifyAuth, userController.updateCartItem);

//get user addresses
userRouter.get('/user-address', verifyAuth, userController.getUserAddresses);
//add a user address
userRouter.post('/user-address', verifyAuth, userController.addUserAddress);
//update a user address
userRouter.patch('/user-address/:addressId', verifyAuth, userController.updateUserAddress);
//delete a user address
userRouter.delete('/user-address/:addressId', verifyAuth, userController.deleteUserAddress);

userRouter.get('/account', verifyAuth, userController.getUserDetails);

userRouter.patch('/account', verifyAuth, userController.updateUserDetails);

userRouter.post('/account', verifyAuth, userController.deleteUser);

module.exports = userRouter;