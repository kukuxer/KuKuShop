class Product {
  id: string;
  name: string;
  description: string;
  price: string;  
  categories: string[];  
  imageUrl: string;
  rating: number;
  quantity: number;
  favorite: boolean;
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
    favorite: any,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.categories = categories;
    this.imageUrl = imageUrl;
    this.rating = rating;
    this.quantity = quantity;
    this.favorite = favorite;
  }
}

export default Product;
