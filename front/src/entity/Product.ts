class Product {
  id: string;
  name: string;
  description: string;
  price: string;  
  categories: string[];  
  imageUrl: string;
  rating: number;
  quantity: number;
  isFavorite: boolean;
  reviews: number;

  constructor(
    id: string,
    name: string,
    description: string,
    price: string,  
    categories: string[],  
    imageUrl: string,
    rating: number,
    quantity: number,
    isFavorite: any,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.categories = categories;
    this.imageUrl = imageUrl;
    this.rating = rating;
    this.quantity = quantity;
    this.isFavorite = isFavorite;
  }
}

export default Product;
