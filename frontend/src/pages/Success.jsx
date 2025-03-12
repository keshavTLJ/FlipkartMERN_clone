import axios from "axios";
import { useEffect, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import ConfettiExplosion from "react-confetti-explosion";
import Loader from "../components/Loader";
import { apiRequest } from "../api/api";

function Success() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    async function verifyPayment() {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        toast.error("Invalid payment session");
        navigate("/");
        return;
      }

      try {
        // const token = localStorage.getItem("token");
        const res = await apiRequest({
          method: 'post',
          url: `${import.meta.env.VITE_SERVER_URL}/verify-payment`,
          data: { sessionId },
        });
        // console.log(res?.data);

        // if (res?.data.error === "Success page already accessed") {
        //     toast.error('Access orders in Orders page!');
        //     navigate('/orders');
        //     return;
        // }

        setOrder(res?.data.order);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
        setError(error.response.data.error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
      } else {
        // Replace current entry with /orders and remove /success from history
        navigate("/orders", { replace: true });
      }
    }
  }, [countdown, navigate, order]);

  if (loading) return <Loader size='50px' borderWidth='4px' style={{ marginTop: "240px" }} />;
  if (error) return <p>{error}</p>;

  return order && order.paymentStatus === "paid" ? (
    <div className="bg-white flex flex-col items-center ">
      <div className="flex flex-col mt-[10%] justify-center items-center gap-3 mx-auto text-4xl text-white bg-blue-400 w-[28%] py-10 rounded-md">
        <ConfettiExplosion duration={5000} height={"180vh"} width={1800} />
        <span className="w-20 h-20 rounded-full bg-green-400 flex flex-row justify-center items-center">
          <BsCheckLg className="text-white text-7xl" />
        </span>
        <h1>Order Confirmed!</h1>
      </div>
      <div className="text-center mt-2 font-medium text-gray-600">
        Redirecting to{" "}
        <button
          onClick={() => navigate("/orders")}
          className="text-blue-500 text-lg font-normal"
        >
          Orders
        </button>{" "}
        page in {countdown} seconds...
      </div>
    </div>
  ) : null;
}

export default Success;
