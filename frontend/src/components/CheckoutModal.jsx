import { useNavigate } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useModal } from "../context/ModalContext";

const CheckoutModal = () => {
  const { showCheckoutModal, setShowCheckoutModal } = useModal();

  const navigate = useNavigate();
  
  function handleClose() {
    setShowCheckoutModal(false);
    navigate('/cart');
  }

  if (!showCheckoutModal) return null;

  return (
    <div onClick={() => setShowCheckoutModal(false)} className="fixed top-0 left-0 z-[100] inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded shadow-lg w-[420px] p-24 text-center">
        <div className="flex flex-col items-center">
          <AiOutlineInfoCircle className="text-red-500 w-20 h-20" />
          <h2 className="text-lg font-semibold mt-4">Your checkout has no items.</h2>
          <button
            className="mt-12 bg-blue-600 text-white text-sm font-medium px-6 py-3 rounded-sm shadow-lg hover:bg-blue-700"
            onClick={handleClose}
          >
            GO TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;