import React from "react";

interface ShopBannerProps {
  imageUrl: string;
  title?: string;
  rating?: number;
  reviews?: number;
}

const ShopBanner: React.FC<ShopBannerProps> = ({
  imageUrl,
  title = "My Shop",
  rating = 4.8,
  reviews = 1267,
}) => {
  return (
    <div className="relative h-96 w-full overflow-hidden">
      <img
        src={imageUrl}
        alt="Shop Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-400 text-xl">★ {rating}</span>
          <span className="text-white">({reviews} reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default ShopBanner;
