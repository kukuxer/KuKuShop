import React, { Component } from "react";
import { FaHeart } from "react-icons/fa";
import Product from "../../../entity/Product";
import RatingStars from "./RatingStars";

interface ProductCardProps {
  product: Product;
  onToggleFavorite: (productId: string) => void;
}

interface ProductCardState {
  isHovered: boolean;
}

class ProductCard extends Component<ProductCardProps, ProductCardState> {
  constructor(props: ProductCardProps) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  render() {
    const { product, onToggleFavorite } = this.props;
    const { isHovered } = this.state;

    return (
      <div
        className={`bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 ${
          isHovered ? "scale-105 shadow-purple-500/50 shadow-lg" : ""
        }`}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className="relative aspect-w-16 aspect-h-9">
          <img
            src={product.imageUrl || "/default-product-image.jpg"}
            alt={product.name}
            className="object-cover w-full h-48"
            loading="lazy"
          />
          <button
            onClick={() => onToggleFavorite(product.id)}
            className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 bg-opacity-70 hover:bg-opacity-100 transition-all duration-300"
          >
            <FaHeart className={`w-5 h-5 ${product.isFavorite ? "text-red-500" : "text-gray-400"}`} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-400 font-bold">${product.price}</span>
            <RatingStars rating={product.rating || 0} /> 
          </div>
          <p className="text-gray-400 text-sm mb-4">{product.reviews || 0} reviews</p>
          

          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  }
}

export default ProductCard;
