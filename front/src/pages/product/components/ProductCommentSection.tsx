import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

interface ProductCommentSectionProps {
  productId: any;
  refreshFetchTrigger: any;
}

const ProductCommentSection: React.FC<ProductCommentSectionProps> = ({ productId, refreshFetchTrigger}) => {
  const [formData, setFormData] = useState({
    comment: "",
    rating: 0,
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [hoveredRating, setHoveredRating] = useState(0);


  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.comment || formData.comment.length < 5) {
      newErrors.comment = "Comment must be at least 5 characters long";
    }
    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!isAuthenticated || !productId) {
      setErrors({ global: "You must be logged in to submit a comment." });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getAccessTokenSilently();

      const commentDto = {
        comment: formData.comment,
        rating: formData.rating,
        productId: productId
      };

      await axios.post(
        `http://localhost:8080/api/comment/create`,
        commentDto,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFormData({ comment: "", rating: 0 });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      refreshFetchTrigger();
    } catch (err) {
      console.error("Failed to submit comment:", err);
      setErrors({ global: "Failed to submit comment. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const successMessage = showSuccess && (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between">
      <span>Comment submitted successfully!</span>
      <button
        onClick={() => setShowSuccess(false)}
        className="ml-4 text-white hover:text-gray-200"
      >
        <IoMdClose size={20} />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      {successMessage}

      <h2 className="text-2xl font-bold text-gray-100 mb-6">Write a Review</h2>

      {errors.global && (
        <div className="text-red-500 text-sm mb-4">{errors.global}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Rating</label>
          <div className="flex space-x-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <FaStar
                  size={24}
                  className={
                    (hoveredRating || formData.rating) >= star
                      ? "text-purple-400 transition-colors"
                      : "text-gray-600 transition-colors"
                  }
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Your Comment</label>
          <textarea
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            placeholder="Share your experience with this product..."
            className="w-full bg-gray-700 text-gray-100 rounded-lg p-4 min-h-[120px] border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-400">
              {formData.comment.length} characters
              {formData.comment.length < 5 && " (minimum 5)"}
            </span>
            {errors.comment && (
              <span className="text-red-500 text-sm">{errors.comment}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ProductCommentSection;
