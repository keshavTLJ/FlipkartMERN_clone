import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "./Banner";
import Slide from "./Slide";
import Footer from "./footer/Footer";
import Loader from "../../components/Loader";
import { apiRequest } from "../../api/api";
import toast from "react-hot-toast";

const navData = [
  { url: 'https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png?q=100', text: 'Grocery' },
  { url: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100', text: 'Mobile' },
  { url: 'https://rukminim1.flixcart.com/flap/128/128/image/82b3ca5fb2301045.png?q=100', text: 'Fashion' },
  { url: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100', text: 'Electronics' },
  { url: 'https://rukminim1.flixcart.com/flap/128/128/image/ee162bad964c46ae.png?q=100', text: 'Home' },
  { url: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100', text: 'Appliances' },
  { url: 'https://rukminim1.flixcart.com/flap/128/128/image/71050627a56b4693.png?q=100', text: 'Travel' },
  { url: 'https://rukminim1.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100', text: 'Top Offers' },
  { url: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100', text: 'Beauty, Toys & More' }
]

const Home = () => {

  const [homeProducts, setHomeProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await apiRequest({ method: 'get', url: '/home' }, false);
        setHomeProducts(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching data!")
      } finally {
        setLoading(false);
      }
    };

    fetchData()
  }, []);

  return (
    <div className="bg-[#F2F2F2]">
      <div className="flex justify-center gap-14 p-3 shadow w-full">
        {navData?.map((item, index) => {
          if (item.text === "Fashion") {
            return (
              <div
                key={index}
                className="flex flex-col justify-center items-center cursor-pointer group relative"
              >
                <img src={item.url} alt={item.text} width={66} />
                <p className="text-center text-sm font-semibold group-hover:text-blue-500">
                  {item.text}
                </p>
                <ul className="hidden z-30 absolute w-52 top-[88px] text-black group-hover:block shadow-lg bg-white">
                  <Link to="/fashion">
                    <li className="">
                      <p className="flex flex-row items-center justify-start gap-2 bg-white hover:bg-gray-100 pt-3 pb-2 px-4 whitespace-no-wrap cursor-pointer font-light text-sm hover:font-semibold">
                        All
                      </p>
                    </li>
                  </Link>
                  <Link to="/fashion/men">
                    <li className="">
                      <p className="flex flex-row items-center justify-start gap-2 bg-white hover:bg-gray-100 pt-2 pb-2 px-4 whitespace-no-wrap cursor-pointer font-light text-sm hover:font-semibold">
                        Men
                      </p>
                    </li>
                  </Link>
                  <Link to="/fashion/women">
                    <li className="">
                      <p className="flex flex-row items-center justify-start gap-2 bg-white hover:bg-gray-100 pt-2 pb-3 px-4 whitespace-no-wrap cursor-pointer font-light text-sm hover:font-semibold">
                        Women
                      </p>
                    </li>
                  </Link>
                </ul>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="flex flex-col justify-center items-center cursor-pointer group"
              >
                <img src={item.url} alt={item.text} width={66} />
                <p className="text-center text-sm font-semibold group-hover:text-blue-500">
                  {item.text}
                </p>
              </div>
            );
          }
        })}
      </div>
      <div className="flex flex-col gap-[10px] p-2">
        <Banner />
        {!loading ? (
          <>
            {homeProducts.map((slideData, index) => (
              <Slide 
              key={index}
              slideData={slideData}
              autoPlaySpeed={[3500, 3000, 2700, 3800, 3300, 4000][index] || 3000}
              />
            ))}
          </>
          ) : (
          <Loader width="40px" height="40px" style={{ marginTop: "20px" }} />
        )}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
