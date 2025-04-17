import { useEffect, useState } from "react";
import { FaHeart, FaStar, FaStarHalf, FaShoppingCart } from "react-icons/fa";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import ShopCard from "./components/ShopCard";
import SecurityInfo from "./components/SecurityInfo";
import Product from "../../entity/Product";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import Loading from "../utils/Loading";
import ErrorPage from "../utils/ErrorPage";

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isInBasket, setIsInBasket] = useState(false);
  const [currentSort, setCurrentSort] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { productId } = useParams();

  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let headers = {};
        if (isAuthenticated) {
          const token = await getAccessTokenSilently();
          headers = {
            Authorization: `Bearer ${token}`,
          };
        }

        const response = await axios.get(
          `http://localhost:8080/api/product/getProduct/${productId}`,
          { headers }
        );

        const data = response.data;
        setProduct(data);
        setIsLiked(data.favorite);
        setIsInBasket(data.inBasket);
        setSelectedImage(data.imageUrl);
      } catch (err) {
        setError("Failed to fetch product");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, getAccessTokenSilently, isAuthenticated]);
  

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - rating === 0.5) {
        stars.push(<FaStarHalf key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-400" />);
      }
    }
    return stars;
  };

  // const navigateImage = (direction: "next" | "prev") => {
  //   if (direction === "next") {
  //     setSelectedImage((prev) => (prev + 1) % product.images.length);
  //   } else {
  //     setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  //   }
  // };

  if (loading) return <Loading /> ;
  if (error) return < ErrorPage errorCode={error} />;
  if(!product || loading) return <ErrorPage errorCode="ИДИИ НАХУУЙ" />;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
              {/* {product.images.length > 3 && (
                <>
                  <button
                    onClick={() => navigateImage("prev")}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full"
                  >
                    <BsChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => navigateImage("next")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full"
                  >
                    <BsChevronRight size={20} />
                  </button>
                </>
              )} */}
              <img
                 src={product.imageUrl ? product.imageUrl : "/Default.png"}
                alt="Product"
                className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {/* {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden ${selectedImage === index ? "ring-2 ring-purple-500" : ""}`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))} */}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="text-gray-400 text-lg">{product.description}</p>
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-purple-400">${product.price}</span>
              <div className="flex items-center">
                {renderStars(product.rating)}
                <span className="ml-2 text-gray-400">({product.rating})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <span key={category} className="px-3 py-1 rounded-full bg-purple-900 text-purple-200 text-sm">
                  {category}
                </span>
              ))}
            </div>

            {/* Add to Cart and Like Buttons */}
            <div className="space-y-4">
              <p className={`text-lg ${product.quantity < 20 ? "text-red-400" : "text-green-400"}`}>
                {product.quantity} units in stock
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-full transition-colors ${isLiked ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                  <FaHeart className={isLiked ? "text-white" : "text-gray-400"} />
                </button>
                <button
                  onClick={() => setIsInBasket(!isInBasket)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg transition-colors ${isInBasket ? "bg-purple-600" : "bg-purple-500 hover:bg-purple-400"}`}
                >
                  <FaShoppingCart />
                  <span>{isInBasket ? "Added to Basket" : "Add to Basket"}</span>
                </button>
              </div>
            </div>

            <SecurityInfo />

          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shop Details Section */}
          <div className="col-span-1 md:col-span-2">
            <ShopCard />
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <select
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
              className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div className="space-y-6">
            {/* {reviews.map((review) => (
              <div key={review.id} className="bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.user}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{review.user}</h3>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-400">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300">{review.text}</p>
              </div>
            ))} */}
          </div>

          {/* Review Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              <BsChevronLeft />
            </button>
            <span className="px-4 py-2 rounded-lg bg-gray-800">{currentPage}</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              <BsChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
