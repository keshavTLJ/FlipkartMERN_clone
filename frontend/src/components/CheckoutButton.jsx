import { useStripe, Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../config/stripe';
import { useState } from 'react';
import { apiRequest } from '../api/api';
import { useModal } from '../context/ModalContext';

const CheckoutButton = ({ products, shippingAddress }) => {
  
  const { showStripePaymentInfoModal, setShowStripePaymentInfoModal } = useModal();

  const [loading, setLoading] = useState(false);
  const stripe = useStripe();

  const placeOrder = async () => {
    if(showStripePaymentInfoModal === 'NOT_VIEWED')
      setShowStripePaymentInfoModal('VIEWING');
    else if(showStripePaymentInfoModal === 'VIEWED') {
      setLoading(true);
      try {
        delete shippingAddress._id;   //removing '_id' key from object
        delete shippingAddress.editing;   //removing 'editing' key from object
  
        const { data } = await apiRequest({
          method: 'post',
          url: `${import.meta.env.VITE_SERVER_URL}/create-checkout-session`, 
          data: { products, shippingAddress }, 
        });
  
        const result = await stripe.redirectToCheckout({ sessionId: data.id });
        
        if (result.error) console.error(result.error);
      } catch (error) {
        console.error('Error during checkout:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='bg-white py-4 px-5 shadow-[0_-4px_6px_-5px_rgba(0,0,0,0.3)]'>
      <button 
        onClick={placeOrder} 
        disabled={loading}
        className='bg-[#FB641B] text-white float-right py-4 px-20 font-semibold'>
        {loading ? 'Processing...' : 'PLACE ORDER'}
      </button>
  </div>
  );
};


const StripeCheckoutWrapper = ({ products, shippingAddress }) => (

  <Elements stripe={stripePromise}>
    <CheckoutButton products={products} shippingAddress={shippingAddress}  />
  </Elements>
);

export default StripeCheckoutWrapper;