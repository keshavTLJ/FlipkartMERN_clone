import React, { createContext, useContext, useEffect, useState } from 'react'

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [loginModal, setLoginModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showStripePaymentInfoModal, setShowStripePaymentInfoModal] = useState('NOT_VIEWED');

  // Prevent scrolling when the modal is open
  useEffect(() => {
    if (loginModal || showDeleteAccountModal || showCheckoutModal || showStripePaymentInfoModal === 'VIEWING') {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [loginModal, showDeleteAccountModal, showCheckoutModal]);
  
  const value = {
    loginModal,
    setLoginModal,
    showCheckoutModal,
    setShowCheckoutModal,
    showDeleteAccountModal,
    setShowDeleteAccountModal,
    showStripePaymentInfoModal,
    setShowStripePaymentInfoModal
  }

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext);
  if(context === undefined)
    throw new Error('useModal must be used within a ModalProvider');

  return context;
}