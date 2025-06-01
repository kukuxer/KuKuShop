export interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string;
  price: string;
  categories: string[];
  imageUrl: string;
  additionalPictures: string[];
  rating: number;
  creationDate: Date;
  quantity: number;
  favorite: boolean;
  inBasket: boolean;
  reviews: number;
  owner: boolean;
}