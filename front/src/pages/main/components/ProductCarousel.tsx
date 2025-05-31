import React from "react";
import Slider from "react-slick";
import {
  FaStar,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductCarousel = () => {
  const products = [
    {
      id: 1,
      name: "Purple Gaming Headset",
      price: 199.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
      description: "Premium gaming headset with surround sound and RGB lighting",
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      price: 159.99,
      rating: 5,
      image: "https://images.unsplash.com/photo-1595225476474-055e6378c8e0",
      description: "RGB mechanical keyboard with Cherry MX switches",
    },
    {
      id: 3,
      name: "Gaming Mouse",
      price: 79.99,
      rating: 4,
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
      description: "High-precision gaming mouse with customizable buttons",
    },
    {
      id: 4,
      name: "Gaming Monitor",
      price: 399.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1527219525722-f9767a7f2884",
      description: "27-inch 4K gaming monitor with 144Hz refresh rate",
    },
    {
      id: 5,
      name: "Gaming Chair",
      price: 299.99,
      rating: 4,
      image: "https://images.unsplash.com/photo-1622372738946-62e02505feb3",
      description: "Ergonomic gaming chair with lumbar support",
    },
    {
      id: 6,
      name: "RGB Mouse Pad",
      price: 29.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1625723044792-89623f51b809",
      description: "Extended RGB mouse pad with multiple lighting modes",
    },
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        <FaStar className="text-purple-400" />
        <span className="ml-1 text-white">{rating}</span>
      </div>
    );
  };

  const CustomArrow = ({ onClick, direction }) => {
    const Icon = direction === "left" ? FaArrowLeft : FaArrowRight;
    return (
      <button
        onClick={onClick}
        className={`absolute top-1/2 z-10 p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors ${
          direction === "left"
            ? "left-0 -translate-x-full"
            : "right-0 translate-x-full"
        } -translate-y-1/2`}
        aria-label={`${direction === "left" ? "Previous" : "Next"} slides`}
      >
        <Icon className="text-white text-xl" />
      </button>
    );
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-900 min-h-screen pt-12 pb-4 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Products</h2>
        <div className="relative px-12">
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.id} className="px-2">
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg group relative h-full">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1590845947670-c009801ffa74";
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center px-4 text-sm text-white text-center">
                      {product.description}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 h-16 overflow-hidden">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-400 font-bold">${product.price}</span>
                      <StarRating rating={product.rating} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;