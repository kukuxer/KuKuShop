import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import { FaShoppingCart, FaUserPlus, FaInfoCircle } from "react-icons/fa";

interface Feature {
  title: string;
  description: string;
  image: string;
}

const HeroSection: React.FC = () => {
 const {isAuthenticated , loginWithPopup} = useAuth0();

  const handleShopNow = (): void => {
    console.log("Shop Now clicked");
  };

  const handleCreateAccount = (): void => {
    loginWithPopup();
  };

  const handleLearnMore = (): void => {
    console.log("Learn More clicked");
  };

  const features: Feature[] = [
    {
      title: "Premium Quality",
      description: "Handpicked products ensuring the highest quality standards",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
    },
    {
      title: "Fast Delivery",
      description: "Express shipping available worldwide with tracking",
      image: "https://images.unsplash.com/photo-1601158935942-52255782d322",
    },
    {
      title: "24/7 Support",
      description: "Round the clock customer service to assist you",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            KuKuShop
          </h1>
          <div className="h-1 bg-purple-600 rounded-full w-24 mx-auto mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Discover a world of premium products curated just for you. Shop the latest trends and must-have items from top brands around the globe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={handleShopNow}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Shop Now"
            >
              <FaShoppingCart className="text-lg" />
              Shop Now
            </button>

            {!isAuthenticated && (
              <button
                onClick={handleCreateAccount}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto border border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Create Account"
              >
                <FaUserPlus className="text-lg" />
                Create Account
              </button>
            )}

            <button
              onClick={handleLearnMore}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-transparent hover:bg-gray-800 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto border border-gray-600 hover:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Learn More"
            >
              <FaInfoCircle className="text-lg" />
              Learn More
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da";
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-purple-400">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
