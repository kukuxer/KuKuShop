import { useEffect, useState } from "react";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import ShopCard from "./components/ShopCard";
import SecurityInfo from "./components/SecurityInfo";
import Product from "../../entity/Product";
import Comment from "../../entity/Comment";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import Loading from "../utils/Loading";
import ErrorPage from "../utils/ErrorPage";
import ShopEntity from "../../entity/ShopEntity";
import AddToBasketButton from "../buttons/AddToCartBtn";
import LikeBtn from "../buttons/LikeBtn";
import ProductCommentSection from "./components/ProductCommentSection";

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [shop, setShop] = useState<ShopEntity | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [selectedImage, setSelectedImage] = useState(0);
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
        setSelectedImage(data.imageUrl);
        console.log("Product data:", data);
      } catch (err) {
        setError("Failed to fetch product");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, getAccessTokenSilently, isAuthenticated]);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        console.log("Fetching shop for ID:", product?.shopId);
        const response = await axios.get(
          `http://localhost:8080/api/shop/getById/${product?.shopId}`
        );
        if (response.data) {
          setShop(response.data);
          console.log("Shop data:", response.data);
        } else {
          setError("Shop not found");
        }
      } catch (err) {
        setError("No shop found with this ID");
        console.error("Error fetching shop:", err);
      } finally {
        setLoading(false);
      }
    };

    if (product?.shopId) {
      fetchShop();
    }
  }, [product?.shopId]);

  const fetchComments = async () => {
    if (!productId) return;

    try {
      let headers = {};
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await axios.get(
        `http://localhost:8080/api/comment/getProductComments/${productId}`,
        { headers }
      );

      setComments(response.data);
      console.log("Comments:", response.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
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

  if (loading) return <Loading />;
  if (error) return <ErrorPage errorCode={error} />;
  if (!product || loading) return <ErrorPage errorCode="ИДИИ НАХУУЙ" />;

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
              <div className="absolute top-3 right-3 z-10 scale-150 p-3">
                <LikeBtn isFavorite={product.favorite} productId={product.id} />
              </div>
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
              <span className="text-3xl font-bold text-purple-400">
                ${product.price}
              </span>
              <div className="flex items-center">
                {renderStars(product.rating)}
                <span className="ml-2 text-gray-400">({product.rating})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 rounded-full bg-purple-900 text-purple-200 text-sm"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Add to Cart and Like Buttons */}
            <div className="space-y-4">
              <p
                className={`text-lg ${
                  product.quantity < 20 ? "text-red-400" : "text-green-400"
                }`}
              >
                {product.quantity} units in stock
              </p>

              <div className="flex space-x-4">
                <div className="w-full">
                  <AddToBasketButton
                    productId={product.id}
                    isProductAlreadyInCart={product.inBasket}
                  />
                </div>
              </div>
            </div>

            <SecurityInfo />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shop Details Section */}
          <div className="col-span-1 md:col-span-2">
            {shop ? (
              <ShopCard shop={shop} />
            ) : (
              <p className="text-red-500">Shop not loaded</p>
            )}
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
            {comments.map((comment) => (
              <div key={comment?.id} className="bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={comment.profileImage || "https://i.pinimg.com/736x/c8/ec/05/c8ec0552d878e70bd29c25d0957a6faf.jpg"}
                    alt={comment.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{comment.username}</h3>
                    <div className="flex items-center">
                      {renderStars(comment.rating)}
                      <span className="ml-2 text-sm text-gray-400">
                        {comment.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300">{comment.comment}</p>
              </div>
            ))}
            <ProductCommentSection
              refreshComments={fetchComments}
              productId={productId}
            />
          </div>

          {/* Review Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              <BsChevronLeft />
            </button>
            <span className="px-4 py-2 rounded-lg bg-gray-800">
              {currentPage}
            </span>
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
