import React, { ChangeEvent, useRef, useState } from "react";
import { FiEdit, FiImage, FiSave, FiX } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import ShopEntity from "../../../entity/ShopEntity.ts";
import ShopDescription from "./ShopDescription.tsx";
import { useAuth0 } from "@auth0/auth0-react";

import ImageCropModal from "../../../components/utils/ImageCropModal.tsx";

interface MyShopBannerProps {
  shop?: ShopEntity;
}

const MyShopBanner: React.FC<MyShopBannerProps> = ({ shop }) => {
  const [initialTitle, setInitialTitle] = useState(
    shop?.name || "Elegant Fashion Boutique"
  );
  const [initialDescription, setInitialDescription] = useState(
    shop?.description?.toString().trim() ||
      "Discover our curated collection of luxury fashion pieces, where style meets sophistication. Experience premium quality and trendsetting designs."
  );
  const [initialImageUrl, setInitialImageUrl] = useState(shop?.imageUrl || "");


  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [rating] = useState(shop?.rating || 4.8);
  const [reviewCount] = useState(256);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);


  const Stars = () => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          className={`${
            index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
          } w-5 h-5`}
        />
      ))}
    </div>
  );


  return (
    <div className="relative h-96 overflow-hidden rounded-xl shadow-lg">
      <img
        src={imageUrl || "/placeholder.jpg"}
        alt="Shop Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-black/40">
        <div className="w-full max-w-3xl text-center space-y-6">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {title}
            </h1>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <Stars />
            <span className="text-white">
              {rating} ({reviewCount} reviews)
            </span>
          </div>
          <ShopDescription description={description} />
        </div>
      </div>
    </div>
  );
};

export default MyShopBanner;
