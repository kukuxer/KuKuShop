export interface Comment {
  id: string;
  author: string;
  comment: string;
  profileImage: string;
  username: string;
  createdAt: string;
  rating: number;
  productId: string;
}
export interface CreateCommentDto {
  comment: string;
  rating: number;
  productId: string | number;
}