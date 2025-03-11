import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { PiClipboardTextLight } from "react-icons/pi";
import { useModal } from '../context/ModalContext';

function StripePaymentInfoModal() {

  const { showStripePaymentInfoModal, setShowStripePaymentInfoModal } = useModal();

  const [showTooltip, setShowTooltip] = useState(false);
  const cardNumber = "4000003560000008";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cardNumber);
    toast.success('Card number copied!');
  };

  if (showStripePaymentInfoModal !== 'VIEWING') return null;

  return (
    <div className="fixed top-0 left-0 z-[100] w-full h-screen bg-black/50 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="bg-yellow-300 rounded-md shadow-md py-10 w-1/3">
        <h2 className="text-lg font-medium mb-4">Important</h2>
        <p className="flex flex-col mx-auto text-sm mb-6 w-2/3 ">
            <span>Use only this 
              <span className='relative text-blue-600 inline-block align-middle text-center'>&nbsp;{cardNumber} <PiClipboardTextLight onClick={copyToClipboard} onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)} className="inline-block ml-1 w-4 h-4 cursor-pointer" />
              {showTooltip && (
                <span className="absolute -translate-x-6 -translate-y-6 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-md z-10">
                  Copy
                </span>
              )}</span>
            </span> 
            <span>card number while on the stripe payment page.</span>
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setShowStripePaymentInfoModal('VIEWED')}
            className={`w-30 px-6 py-2 bg-red-500 text-white font-medium rounded-sm`}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  )
}

export default StripePaymentInfoModal;