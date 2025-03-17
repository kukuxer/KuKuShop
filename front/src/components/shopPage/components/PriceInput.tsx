import React, { useState } from "react";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import { FaDollarSign } from "react-icons/fa";
import { MdError } from "react-icons/md";

const PriceInput = () => {
  const [error, setError] = useState("");
  const [PriceInputIsFocused, PriceInputSetIsFocused] = useState(false);

  const formatPrice = (val) => {
    if (!val) return "";
    const numericValue = val.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length > 2) return value;
    if (parts[1]?.length > 2) parts[1] = parts[1].slice(0, 2);
    return parts.join(".");
  };

  const handlePriceChange = (e) => {
    const formattedPrice = formatPrice(e.target.value);
    if (!formattedPrice) {
      setError("Price is required");
    } else if (parseFloat(formattedPrice) < 0) {
      setError("Price cannot be negative");
    } else if (parseFloat(formattedPrice) > 1000000) {
      setError("Price cannot exceed 1,000,000");
    } else {
      setError("");
    }
    onChange(formattedPrice);
  };

  const incrementPrice = () => {
    const currentPrice = parseFloat(value) || 0;
    onChange((currentPrice + 1).toFixed(2));
  };

  const decrementPrice = () => {
    const currentPrice = parseFloat(value) || 0;
    if (currentPrice > 0) {
      onChange((currentPrice - 1).toFixed(2));
    }
  };

  return (
    <div className="w-full max-w-xs">
      <div className="relative">
        <label className="block text-white mb-2">Price<span className="text-red-500">*</span></label>
        <div className={`relative border ${error ? "border-red-500" : PriceInputIsFocused ? "border-purple-500" : "border-gray-700"} rounded-lg shadow-sm transition-all hover:border-purple-400 bg-[#121212]`}>
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <FaDollarSign className={`${error ? "text-red-500" : "text-purple-400"} text-sm`} />
          </div>
          <input
            type="text"
            value={value}
            onChange={handlePriceChange}
            onFocus={() => PriceInputSetIsFocused(true)}
            onBlur={() => PriceInputSetIsFocused(false)}
            className="w-full bg-[#121212] text-purple-400 text-sm py-2 px-8 rounded-lg focus:outline-none"
            placeholder="0.00"
            aria-label="Price input"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5">
            <button onClick={incrementPrice} className="p-1 hover:bg-purple-700 rounded" aria-label="Increment price">
              <BsChevronUp className="text-gray-400 group-hover:text-purple-400 text-xs" />
            </button>
            <button onClick={decrementPrice} className="p-1 hover:bg-purple-700 rounded" aria-label="Decrement price">
              <BsChevronDown className="text-gray-400 group-hover:text-purple-400 text-xs" />
            </button>
          </div>
        </div>
        {error && <div className="absolute -bottom-5 left-0 flex items-center text-red-500 text-xs"><MdError className="mr-1" />{error}</div>}
      </div>
    </div>
  );
};

export default PriceInput;
