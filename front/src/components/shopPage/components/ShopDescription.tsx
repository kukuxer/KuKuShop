import React, { useState } from "react";

interface ShopDescriptionProps {
  description?: string;
  maxLength?: number;
}

const ShopDescription: React.FC<ShopDescriptionProps> = ({
  description = "Welcome to our shop! We specialize in providing high-quality products and exceptional service to our valued customers. Our team is dedicated to ensuring that you have the best shopping experience possible. Whether you're looking for the latest trends or timeless classics, we have something for everyone. Thank you for choosing us!",
  maxLength = 120,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = description.length > maxLength;
  const visibleText = isExpanded || !shouldTruncate
    ? description
    : description.slice(0, maxLength).trim() + "...";

  const highlightLetters = (text: string) =>
    text.split("").map((char, i) => {
      if (char === "K" || char === "U" || char === "k" || char === "u") {
        return (
          <span key={i} className="text-purple-400 font-semibold">
            {char}
          </span>
        );
      }
      return <span key={i}>{char}</span>;
    });

  return (
    <div className="w-full flex justify-center mt-6">
      <div className="px-6 py-4 max-w-2xl text-center">
        <p className="text-sm text-gray-300 leading-relaxed">
          {highlightLetters(visibleText)}
          {shouldTruncate && (
            <span
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-purple-400 hover:text-purple-300 cursor-pointer transition-colors duration-200"
            >
              {isExpanded ? "less" : "more"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ShopDescription;
