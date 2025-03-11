const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi', 'Puducherry', 'Ladakh', 'Jammu and Kashmir'
];

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gender: { type: String, enum: ['male', 'female'] },
  mobNum: { type: String, maxLength: 10 },
  address: [{
    name: { type: String, required: true },
    mobNum: { type: String, maxLength: 10, required: true },
    pincode: { type: String, maxLength: 6, required: true },
    locality: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, enum: indianStates, required: true },
    addressType: { type: String, enum: ['home', 'work'] }
  }],
  wishlist: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  },
  cart: {
    type: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1, required: true }
    }]
  }
})

//static signup method
userSchema.statics.signup = async function(email, password) {

  //validation
  if(!email || !password)
    throw Error("All fields must be filled!");

  if(!validator.isEmail(email))
    throw Error("Invalid Email!");

  const user = await this.findOne({ email: email });
  if(user)
    throw Error('Email already in use!');

  if(!validator.isStrongPassword(password))
    throw Error("Use a strong password!");


  const saltRounds = 10;
  const salt =await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

userSchema.statics.login = async function(email, password) {
  
  //validation
  if(!email || !password)
    throw Error("All fields must be filled");

  const user = await this.findOne({ email: email });

  if(!user)
    throw Error('Incorrect Email');

  const matchPasswordHash = bcrypt.compareSync(password, user.password);

  if(!matchPasswordHash)
    throw Error("Incorrect Password");

  return user;
}

module.exports = mongoose.model('User', userSchema);