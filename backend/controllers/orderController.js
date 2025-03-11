const Order = require('../models/orderModel');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
      const { products, shippingAddress } = req.body;
      const userId = req.user._id;

      // console.log(shippingAddress);
      
      const order = new Order({
        userId,
        items: products.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        orderStatus: "pending",
        paymentStatus: "unpaid",
        paymentMethod: "card",
        shippingAddress,
        totalAmount: products.reduce((total, item) => total + item.product.price * item.quantity, 0),
        stripeSessionId: "",
        successPageAccessed: false
      });
  
      const savedOrder = await order.save();
  
      const line_items = products.map(p => ({
        price_data: {
          currency: 'inr',
          product_data: { name: p.product.name },
          unit_amount: p.product.price * 100,
        },
        quantity: p.quantity,
      }));
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel?session_id={CHECKOUT_SESSION_ID}`,
        metadata: { orderId: savedOrder._id.toString() }
      });

      // console.log('stripe session: ', session)
      savedOrder.stripeSessionId = session.id;
      await savedOrder.save();
  
      res.json({ id: session.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const verifyPayment = async (req, res) => {
  const { sessionId } = req.body;
  const { user } = req;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // console.log("session from verify-payment: ", session);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const order = await Order.findOne({ stripeSessionId: sessionId, userId: user._id });

    if(!order) {
      return res.status(404).json({ error: "Order not found"});
    }

    if(order.successPageAccessed)
      return res.status(401).json({ error: "Success page already accessed" });

    order.successPageAccessed = true;
    await order.save();

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error?.raw?.message ? error?.raw?.message : "Failed to verify payment" });
  }
}

const getOrders = async (req, res) => {
  const user = req.user;

  try {
    const orders = await Order.find({ userId : user._id }).sort({ createdAt: -1 }).populate('items.product');
    
    if(!orders)
      return res.status(404).json({ error: 'order not found!' });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getOrder = async (req, res) => {
  const { orderId } = req.query;
  
  try {
    const order = await Order.findOne({ _id: orderId, userId: req.user._id }).populate('items.product');

    if (!order) return res.status(404).json({ error: 'Order not found!' });

    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createCheckoutSession,
  verifyPayment,
  getOrders,
  getOrder
};