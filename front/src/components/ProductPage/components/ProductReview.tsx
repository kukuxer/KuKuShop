import React from "react";
import { FaStar } from "react-icons/fa";
import Comment from "../../../entity/Comment";

interface ProductReviewProps {
  comment: Comment;
  renderStars: (rating: number) => React.ReactNode[];
}

const ProductReview: React.FC<ProductReviewProps> = ({ comment, renderStars }) => {
  return (
        <div key={comment?.id} className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={
                comment.profileImage ||
                "https://i.pinimg.com/736x/c8/ec/05/c8ec0552d878e70bd29c25d0957a6faf.jpg"
              }
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
  );
};

export default ProductReview;
