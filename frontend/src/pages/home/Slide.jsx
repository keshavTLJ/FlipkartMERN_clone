import React, { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import SlideProduct from "./SlideProduct";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
const Slide = ({ slideData, autoPlaySpeed }) => {

  const { slideHeading, products } = slideData;

  return (
    <div className="flex flex-col bg-white shadow">
      <div className="flex flex-row justify-between items-center border-b-2 px-4 py-3">
        <h3 className="text-xl font-bold ml-2">{slideHeading}</h3>
        {/* <button className="text-white bg-blue-500 w-[7%] h-10 mr-1 rounded-sm">
          VIEW ALL
        </button> */}
      </div>
      <Carousel
        swipeable={false}
        draggable={false}
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={autoPlaySpeed}
        keyBoardControl={true}
        centerMode={true}
        slidesToSlide={1}
        containerClass="carousel-container z-10"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {products?.map((product) => {
          return <SlideProduct slideHeading={slideHeading} product={product} key={product._id} />;
        })}
      </Carousel>
    </div>
  );
};

export default Slide;
