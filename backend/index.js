require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('./models/orderModel');
const productRouter = require('./routes/productRoutes')
const userRouter = require('./routes/userRoutes')
const orderRouter = require('./routes/orderRoutes')
const User = require('./models/userModel');

const server = express();

//middleware to allow request from frontend
server.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

//express.json middleware is not used for order routes because stripe /webhook requires 'raw request body' for signature verification
server.post('/webhook', express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
  
    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      // console.log("event", event)
      const session = event.data.object;
      // console.log("metadata: ", session.metadata)
      const orderId = session.metadata.orderId;
  
      if (!orderId) return res.status(400).send("Order ID missing in stripe metadata");
  
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).send("Order not found");
  
      if (event.type === 'checkout.session.completed') {
        order.paymentStatus = "paid";
        order.orderStatus = "pending";

        const user = await User.findOne(order.userId);
        if(user) {
          user.cart = [];
          await user.save();
        }
      } 
      else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
        order.paymentStatus = "failed";
        order.orderStatus = "cancelled";
      }
  
      await order.save();
      res.status(200).send();
    } catch (error) {
      console.error("Webhook Error:", error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

//middleware to parse the request body in JSON to object type for the requests made to 'user' and 'product' endpoints only
server.use(express.json())

server.use('/', userRouter);
server.use('/', productRouter);
server.use('/', orderRouter); 

//connect to database
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    // console.log("Database connected")
    
    server.listen(process.env.PORT || 3000, () => {
        // console.log('server running on port ' + process.env.PORT);
    })
}
main().catch(err => console.log(err))
