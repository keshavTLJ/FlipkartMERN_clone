import React from 'react';
import { useLocation } from 'react-router-dom';

const ContentWrapper = ({ children }) => {
  const location = useLocation();
  const isCheckoutRoute = location.pathname === '/checkout';

  return (
    <div className={isCheckoutRoute ? "" : "pt-14"}>
      {children}
    </div>
  );
};

export default ContentWrapper;